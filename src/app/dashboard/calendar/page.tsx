// calendar/page.tsx

"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

import { Calendar } from "@/components/ui/calendar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Bell, Plus } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

// Initialize Supabase client
// Replace these with your actual Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type EventType = {
  id?: string;
  title: string;
  date: string;
  color?: string;
  content?: string;
  user_id?: string;
};

function FullCalendar() {
  const { user } = useUser();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<EventType[]>([]);
  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] =
    React.useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = React.useState("");
  const [newEventContent, setNewEventContent] = React.useState("");
  const [editingEvent, setEditingEvent] = React.useState<EventType | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Get current user information
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  // Fetch current user on component mount
  React.useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
    }
  }, [user]);

  // Fetch notes from Supabase when the component mounts
  React.useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .order("time_created", { ascending: false });

        if (error) {
          toast.error("Failed to fetch notes");
          console.error("Error fetching notes:", error);
        } else {
          // Map Supabase data to our EventType format
          const formattedEvents = data.map((note) => ({
            id: note.id,
            title: note.title,
            content: note.content,
            date: format(new Date(note.start_time), "yyyy-MM-dd"),
            color: note.color_class || "bg-green-600",
            user_id: note.user_id,
          }));

          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleAddOrEditEvent = async () => {
    if (!newEventTitle || !selectedDateForEvent) return;

    setIsLoading(true);

    try {
      const eventDate = format(selectedDateForEvent, "yyyy-MM-dd");
      const now = new Date();

      // Format the date string in the format expected by Supabase
      const formattedStartTime = `${eventDate}T00:00:00`;
      const formattedEndTime = `${eventDate}T23:59:59`;

      const newEvent = {
        title: newEventTitle,
        content: newEventContent,
        date: eventDate,
        color: editingEvent?.color || "bg-green-600",
      };

      if (editingEvent && editingEvent.id) {
        // Update existing note in Supabase
        const { error } = await supabase
          .from("notes")
          .update({
            title: newEventTitle,
            content: newEventContent,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            color_class: newEvent.color,
            updated_at: now.toISOString(),
          })
          .eq("id", editingEvent.id);

        if (error) {
          toast.error("Failed to update note");
          console.error("Error updating note:", error);
          return;
        }

        // Update local state
        setEvents((prev) =>
          prev.map((event) =>
            event.id === editingEvent.id
              ? {
                  ...newEvent,
                  id: editingEvent.id,
                  user_id: editingEvent.user_id,
                }
              : event
          )
        );

        toast.success(`Note "${newEventTitle}" updated successfully`, {
          description: `Date: ${format(selectedDateForEvent, "MMM dd, yyyy")}`,
        });
      } else {
        // Add new note to Supabase
        const { data, error } = await supabase
          .from("notes")
          .insert([
            {
              title: newEventTitle,
              content: newEventContent,
              time_created: now.toISOString(),
              start_time: formattedStartTime,
              end_time: formattedEndTime,
              place: "", // Default empty place
              color_class: newEvent.color,
              user_id: currentUserId, // Use the current user's ID
              created_at: now.toISOString(),
            },
          ])
          .select();

        if (error) {
          toast.error("Failed to add note");
          console.error("Error adding note:", error);
          return;
        }

        // Add the new event to local state with the ID from Supabase
        if (data && data.length > 0) {
          const addedNote = data[0];
          setEvents((prev) => [
            ...prev,
            {
              ...newEvent,
              id: addedNote.id,
              user_id: addedNote.user_id,
            },
          ]);

          toast.success(`Note "${newEventTitle}" added to calendar`, {
            description: `Date: ${format(
              selectedDateForEvent,
              "MMM dd, yyyy"
            )}`,
          });
        }
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setEditingEvent(null);
      setNewEventTitle("");
      setNewEventContent("");
      setSelectedDateForEvent(null);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent || !editingEvent.id) return;

    setIsLoading(true);

    try {
      // Delete note from Supabase
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", editingEvent.id);

      if (error) {
        toast.error("Failed to delete note");
        console.error("Error deleting note:", error);
        return;
      }

      // Update local state
      setEvents((prev) => prev.filter((e) => e.id !== editingEvent.id));

      toast.error(`Note "${editingEvent.title}" deleted`, {
        description: `Removed from ${format(
          new Date(editingEvent.date),
          "MMM dd, yyyy"
        )}`,
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setEditingEvent(null);
      setNewEventTitle("");
      setNewEventContent("");
      setSelectedDateForEvent(null);
    }
  };

  return (
    <SidebarProvider>
      <Toaster position="top-right" />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbPage className="text-xl">Calendar</BreadcrumbPage>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">
                <Bell />
              </Button>
              <Button variant="ghost">
                <Plus />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Controls */}
          <div className="flex gap-4 mb-4 flex-wrap justify-end">
            <Button
              onClick={() => {
                setSelectedDateForEvent(date ?? new Date());
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary hover:bg-primary text-primary hover:text-secondary text-sm"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Note
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setViewMode("month");
                toast.info("Switched to month view");
              }}
              className={`px-4 py-2 rounded-md border transition-colors ${
                viewMode === "month"
                  ? "bg-primary hover:bg-secondary text-secondary hover:text-primary border-primary"
                  : "bg-muted hover:bg-neutral-500 hover:text-neutral-900 text-muted-foreground border-muted"
              }`}
              disabled={isLoading}
            >
              Month
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setViewMode("week");
                toast.info("Switched to week view");
              }}
              className={`px-4 py-2 rounded-md border transition-colors ${
                viewMode === "week"
                  ? "bg-primary hover:bg-secondary text-secondary hover:text-primary border-primary"
                  : "bg-muted hover:bg-neutral-500 hover:text-neutral-900 text-muted-foreground border-muted"
              }`}
              disabled={isLoading}
            >
              Week
            </Button>
          </div>

          {/* Calendar */}
          <div className="flex-1 w-full overflow-x-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : viewMode === "month" ? (
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    const formattedDate = format(newDate, "MMM dd, yyyy");
                    toast.info(`Selected date: ${formattedDate}`);
                  }
                }}
                className="w-full h-full"
                classNames={{
                  table: "w-full h-full table-fixed border-collapse",
                  head_row: "flex w-full",
                  head_cell: "flex-1 text-center text-sm md:text-base py-1",
                  row: "flex w-full text-xl md:flex-nowrap",
                  cell: "flex-1 p-[12px] border",
                  day: "w-full h-[48px] flex flex-col items-start justify-start p-1 text-[16px] md:text-base rounded hover:bg-accent transition-all",
                  caption_label:
                    "text-base md:text-2xl font-semibold text-center",
                }}
                components={{
                  Day: ({ date }) => {
                    const dayEvents = events.filter(
                      (event) => format(date, "yyyy-MM-dd") === event.date
                    );
                    return (
                      <div
                        className={`w-full h-full flex flex-col items-start justify-start p-2 gap-1 text-sm rounded-md ${
                          isToday(date)
                            ? "bg-accent border-2 border-primary"
                            : ""
                        }`}
                      >
                        <div className="font-medium">{format(date, "d")}</div>
                        {dayEvents.map((event, idx) => (
                          <span
                            key={idx}
                            onClick={() => {
                              setEditingEvent(event);
                              setNewEventTitle(event.title);
                              setNewEventContent(event.content || "");
                              setSelectedDateForEvent(new Date(event.date));
                              setIsModalOpen(true);
                              toast("Editing note", {
                                description: event.title,
                              });
                            }}
                            className={`cursor-pointer text-white text-xs px-2 py-1 rounded ${event.color}`}
                          >
                            {event.title}
                          </span>
                        ))}
                      </div>
                    );
                  },
                }}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 w-full">
                {[...Array(7)].map((_, i) => {
                  const currentDate = addDays(
                    startOfWeek(date ?? new Date()),
                    i
                  );
                  const dayEvents = events.filter(
                    (event) => format(currentDate, "yyyy-MM-dd") === event.date
                  );

                  return (
                    <div
                      key={i}
                      className={`flex flex-col p-2 sm:p-4 border rounded-md h-40 bg-background ${
                        isToday(currentDate) ? "border-2 border-primary" : ""
                      }`}
                    >
                      <div className="font-semibold text-sm md:text-base">
                        {format(currentDate, "EEE dd")}
                      </div>
                      {dayEvents.map((event, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setEditingEvent(event);
                            setNewEventTitle(event.title);
                            setNewEventContent(event.content || "");
                            setSelectedDateForEvent(new Date(event.date));
                            setIsModalOpen(true);
                            toast("Editing note", {
                              description: event.title,
                            });
                          }}
                          className={`mt-1 text-xs px-2 py-1 rounded text-white cursor-pointer ${event.color}`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-secondary p-6 rounded-md shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">
                  {editingEvent ? "Edit Note" : "Add Note"}
                </h2>

                <input
                  type="text"
                  placeholder="Note title"
                  className="w-full mb-3 border px-3 py-2 rounded"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  disabled={isLoading}
                />

                <textarea
                  placeholder="Note content (optional)"
                  className="w-full mb-3 border px-3 py-2 rounded h-24"
                  value={newEventContent}
                  onChange={(e) => setNewEventContent(e.target.value)}
                  disabled={isLoading}
                />

                <input
                  type="date"
                  className="w-full mb-3 border px-3 py-2 rounded"
                  value={
                    selectedDateForEvent
                      ? format(selectedDateForEvent, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedDateForEvent(new Date(e.target.value))
                  }
                  disabled={isLoading}
                />

                <Button
                  onClick={handleAddOrEditEvent}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      {editingEvent ? "Updating..." : "Saving..."}
                    </span>
                  ) : editingEvent ? (
                    "Update Note"
                  ) : (
                    "Save Note"
                  )}
                </Button>

                {editingEvent && (
                  <Button
                    onClick={handleDeleteEvent}
                    className="mt-2 text-sm text-red-600 w-full disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-2"></span>
                        Deleting...
                      </span>
                    ) : (
                      "Delete Note"
                    )}
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEvent(null);
                    setNewEventTitle("");
                    setNewEventContent("");
                    setSelectedDateForEvent(null);
                    toast.info("Action cancelled");
                  }}
                  className="mt-2 text-sm text-gray-500 w-full disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default FullCalendar;
