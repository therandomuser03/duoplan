"use client";

import React from "react";
import { format, startOfWeek, addDays, isToday } from "date-fns";

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

type EventType = {
  title: string;
  date: string;
  color?: string;
};

function FullCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const [events, setEvents] = React.useState<EventType[]>([
    { date: "2025-05-16", title: "Team Meeting", color: "bg-blue-500" },
    { date: "2025-05-16", title: "Dinner", color: "bg-purple-500" },
    { date: "2025-05-22", title: "Birthday", color: "bg-orange-500" },
  ]);

  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] =
    React.useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = React.useState("");
  const [editingEvent, setEditingEvent] = React.useState<EventType | null>(
    null
  );

  const handleAddOrEditEvent = () => {
    if (!newEventTitle || !selectedDateForEvent) return;

    const newEvent = {
      title: newEventTitle,
      date: format(selectedDateForEvent, "yyyy-MM-dd"),
      color: editingEvent?.color || "bg-green-600",
    };

    if (editingEvent) {
      // Edit mode
      setEvents((prev) =>
        prev.map((event) => (event === editingEvent ? newEvent : event))
      );
    } else {
      // Add mode
      setEvents((prev) => [...prev, newEvent]);
    }

    setIsModalOpen(false);
    setEditingEvent(null);
    setNewEventTitle("");
    setSelectedDateForEvent(null);
  };

  return (
    <SidebarProvider>
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
            <div className="flex items-center gap-8">
              <Bell />
              <Plus />
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Controls */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => {
                setSelectedDateForEvent(date ?? null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>

            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded-md border transition-colors ${
                viewMode === "month"
                  ? "bg-primary text-secondary border-primary"
                  : "bg-muted text-muted-foreground border-muted"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded-md border transition-colors ${
                viewMode === "week"
                  ? "bg-primary text-secondary border-primary"
                  : "bg-muted text-muted-foreground border-muted"
              }`}
            >
              Week
            </button>
          </div>

          {/* Calendar */}
          <div className="flex-1 w-full overflow-x-hidden">
            {viewMode === "month" ? (
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
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
                          isToday(date) ? "bg-accent border-2 border-primary" : ""
                        }`}
                      >
                        <div className="font-medium">{format(date, "d")}</div>
                        {dayEvents.map((event, idx) => (
                          <span
                            key={idx}
                            onClick={() => {
                              setEditingEvent(event);
                              setNewEventTitle(event.title);
                              setSelectedDateForEvent(new Date(event.date));
                              setIsModalOpen(true);
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
                            setSelectedDateForEvent(new Date(event.date));
                            setIsModalOpen(true);
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
                  {editingEvent ? "Edit Event" : "Add Event"}
                </h2>

                <input
                  type="text"
                  placeholder="Event title"
                  className="w-full mb-3 border px-3 py-2 rounded"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
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
                />

                <button
                  onClick={handleAddOrEditEvent}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                  {editingEvent ? "Update Event" : "Save Event"}
                </button>

                {editingEvent && (
                  <button
                    onClick={() => {
                      setEvents((prev) =>
                        prev.filter((e) => e !== editingEvent)
                      );
                      setIsModalOpen(false);
                      setEditingEvent(null);
                      setNewEventTitle("");
                      setSelectedDateForEvent(null);
                    }}
                    className="mt-2 text-sm text-red-600 w-full"
                  >
                    Delete Event
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEvent(null);
                    setNewEventTitle("");
                    setSelectedDateForEvent(null);
                  }}
                  className="mt-2 text-sm text-gray-500 w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default FullCalendar;
