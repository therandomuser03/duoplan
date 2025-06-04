// components/dashboard/NotesClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { Trash2, RefreshCw } from "lucide-react"; // Added RefreshCw import
import { toast } from "sonner";
import {
  format,
  parseISO,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useSpace } from '@/contexts/SpaceContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Note {
  id: string;
  title: string;
  space_id: string | null;
  content: string;
  start_time?: string;
  end_time?: string;
  color?: string;
  created_at: string;
  user_id: string;
  is_shared?: boolean;
}

export default function NotesClient({ user }: { user: User }) {
  const supabase = createClient();
  const { currentSpaceId } = useSpace();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    start_time: "",
    end_time: "",
    color: "",
  });
  const [shareWithPartner, setShareWithPartner] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [displayedNotes, setDisplayedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null); // Added error state
  const [time, setTime] = useState(new Date()); // Added time state for header

  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const [isShareAlertDialogOpen, setIsShareAlertDialogOpen] = useState<{ [key: string]: boolean }>({});
  const [, setIsUnshareAlertDialogOpen] = useState<{ [key: string]: boolean }>({});

  const colorOptions = [
    { name: "None", value: "none" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Red", value: "#ef4444" },
    { name: "Purple", value: "#a855f7" },
    { name: "Gray", value: "#6b7280" },
    { name: "Orange", value: "#f97316" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (value: string) => {
    setFormData({ ...formData, color: value === "none" ? "" : value });
  };

  useEffect(() => {
    const fetchSpaceAndPartner = async () => {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        console.error("Auth error fetching user:", authError);
        return;
      }
      setCurrentUserId(currentUser.id);

      if (!currentSpaceId) {
        setPartnerId(null);
        return;
      }

      const { data: space, error: spaceError } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", currentSpaceId)
        .single();

      if (spaceError || !space) {
        setPartnerId(null);
        return;
      }

      setPartnerId(space.user_a_id === currentUser.id ? space.user_b_id : space.user_a_id);
    };

    fetchSpaceAndPartner();
  }, [supabase, currentSpaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating event...");

    const startTimeUTC = formData.start_time
      ? new Date(formData.start_time).toISOString()
      : null;
    const endTimeUTC = formData.end_time
      ? new Date(formData.end_time).toISOString()
      : null;

    const notePayload = {
      ...formData,
      start_time: startTimeUTC,
      end_time: endTimeUTC,
      activeSpaceId: currentSpaceId,
      shareWithPartner,
      partnerId: shareWithPartner ? partnerId : null,
    };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notePayload),
      });

      if (res.ok) {
        toast.success("Event created successfully!", { id: toastId });
        setFormData({
          title: "",
          content: "",
          start_time: "",
          end_time: "",
          color: "",
        });
        setShareWithPartner(false);
        fetchNotes(); // Re-fetch all notes
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to create event: ${errorData.message || res.statusText}`,
          { id: toastId }
        );
        console.error("Failed to create event:", errorData);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Error submitting form. Check console for details.", {
        id: toastId,
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    // Instead of immediate confirmation, set the note to delete and open the dialog
    setNoteToDelete(allNotes.find(note => note.id === noteId) || null);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    const toastId = toast.loading("Deleting event...");

    try {
      const res = await fetch(`/api/notes?id=${noteToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Note deleted successfully!", { id: toastId });
        fetchNotes(); // Re-fetch all notes
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to delete event: ${errorData.message || res.statusText}`,
          { id: toastId }
        );
        console.error("Failed to delete event:", errorData);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Error deleting event. Check console for details.", {
        id: toastId,
      });
    } finally {
      setIsDeleteDialogOpen(false); // Close the dialog
      setNoteToDelete(null); // Clear the note
    }
  };

  const handleToggleShare = async (note: Note, checked: boolean) => {
    if (!note.id || !currentSpaceId || !partnerId || !currentUserId) {
      toast.error("Missing event, space, or partner ID!");
      console.error("Missing IDs", { noteId: note.id, currentSpaceId, partnerId, currentUserId });
      return;
    }

    if (checked) {
      // Open share confirmation dialog
      setIsShareAlertDialogOpen(prevState => ({ ...prevState, [note.id]: true }));
    } else {
      // Open unshare confirmation dialog
      setIsUnshareAlertDialogOpen(prevState => ({ ...prevState, [note.id]: true }));
    }
  };

  const confirmShareNote = async (note: Note) => {
    const toastId = toast.loading("Sharing event...");
    try {
      const payload = {
        noteId: note.id,
        activeSpaceId: currentSpaceId,
        partnerId: partnerId,
      };
      console.log("Sharing event with payload:", payload);
      const res = await fetch("/api/shared-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Share event response:", data);

      if (res.ok) {
        toast.success("Event shared successfully!", { id: toastId });
        fetchNotes();
      } else {
        toast.error(`Failed to share event: ${data.error || res.statusText}`, { id: toastId });
        fetchNotes();
      }
    } catch (err) {
      console.error("Error sharing event:", err);
      toast.error("Error sharing event. Check console for details.", { id: toastId });
      fetchNotes();
    } finally {
      setIsShareAlertDialogOpen(prevState => ({ ...prevState, [note.id]: false }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const confirmUnshareNote = async (note: Note) => {
    const toastId = toast.loading("Unsharing event...");
    try {
      const res = await fetch(
        `/api/shared-notes?fromUserId=${currentUserId}&toUserId=${partnerId}&spaceId=${currentSpaceId}&title=${encodeURIComponent(
          note.title
        )}&content=${encodeURIComponent(note.content)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success("Event unshared successfully!", { id: toastId });
        fetchNotes(); // Re-fetch all notes to update shared status
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to unshare event: ${errorData.message || res.statusText}`,
          { id: toastId }
        );
        console.error("Failed to unshare event:", errorData);
        fetchNotes();
      }
    } catch (err) {
      console.error("Error unsharing event:", err);
      toast.error("Error unsharing event. Check console for details.", {
        id: toastId,
      });
      fetchNotes();
    } finally {
      setIsUnshareAlertDialogOpen(prevState => ({ ...prevState, [note.id]: false }));
    }
  };

  const fetchNotes = useCallback(async () => {
    if (!currentUserId || !currentSpaceId) return;
    setLoading(true);
    try {
      // Fetch personal notes for this space
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('space_id', currentSpaceId);
      if (notesError) throw notesError;

      // Fetch shared notes for this space
      const { data: sharedNotes, error: sharedNotesError } = await supabase
        .from('shared_notes')
        .select('*')
        .eq('space_id', currentSpaceId)
        .or(`from_user_id.eq.${currentUserId},to_user_id.eq.${currentUserId}`);
      if (sharedNotesError) throw sharedNotesError;

      // Get shared note IDs to mark original notes as shared
      const sharedNoteIds = new Set(sharedNotes?.map(note => note.original_note_id) || []);
      
      // Mark notes as shared if they are in the shared_notes table
      const notesWithSharedStatus = notes?.map(note => ({
        ...note,
        is_shared: sharedNoteIds.has(note.id)
      })) || [];

      setAllNotes(notesWithSharedStatus);
    } catch (error) {
      setAllNotes([]);
      toast.error('Failed to fetch events.');
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentSpaceId, supabase]);

  useEffect(() => {
    if (currentUserId && currentSpaceId) {
      fetchNotes();
    }
  }, [fetchNotes, currentUserId, currentSpaceId]);

  // Effect for updating the current time in the header
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const formattedDate = format(time, "PPPP");
  const formattedTime = format(time, "p");

  const filterNotesByDate = useCallback(
    (notesToFilter: Note[], dateString: string): Note[] => {
      if (!dateString) return notesToFilter;

      try {
        const selectedDateObj = parseISO(dateString);
        const dayStart = startOfDay(selectedDateObj);
        const dayEnd = endOfDay(selectedDateObj);

        return notesToFilter.filter((note) => {
          if (note.start_time || note.end_time) {
            const startTime = note.start_time
              ? parseISO(note.start_time)
              : dayStart;
            const endTime = note.end_time
              ? parseISO(note.end_time)
              : note.start_time
              ? endOfDay(startTime)
              : dayEnd;

            return (
              isWithinInterval(selectedDateObj, {
                start: startOfDay(startTime),
                end: endOfDay(endTime),
              }) ||
              isWithinInterval(dayStart, { start: startTime, end: endTime }) ||
              isWithinInterval(dayEnd, { start: startTime, end: endTime }) ||
              (isSameDay(startTime, selectedDateObj) &&
                isSameDay(endTime, selectedDateObj))
            );
          } else {
            const createdDate = parseISO(note.created_at);
            return isSameDay(createdDate, selectedDateObj);
          }
        });
      } catch (error) {
        console.error("Error parsing date or filtering events:", error);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    if (allNotes.length > 0 || !loading) {
      const filtered = filterNotesByDate(allNotes, selectedDate);
      const sorted = filtered.sort((a, b) => {
        const aTime = new Date(a.start_time || a.created_at || 0).getTime();
        const bTime = new Date(b.start_time || b.created_at || 0).getTime();
        return aTime - bTime;
      });
      setDisplayedNotes(sorted);
    } else {
      setDisplayedNotes([]);
    }
  }, [allNotes, selectedDate, filterNotesByDate, loading]);

  return (
    <SidebarProvider>
      <AppSidebar user={user} selectedDate={""} onDateSelect={() => {}} />
      <SidebarInset>
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Events</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* DATE + TIME HEADER */}
        <div className="px-4 py-2 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {formattedDate} — {formattedTime}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNotes}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="px-4 pb-2">
            {/* You might want to use an Alert component from shadcn/ui here */}
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">Create an Event</h2>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Select
                    name="color"
                    value={formData.color}
                    onValueChange={handleColorChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((colorOption) => (
                        <SelectItem
                          key={colorOption.value}
                          value={colorOption.value}
                        >
                          <div className="flex items-center gap-2">
                            {colorOption.value !== "none" && (
                              <span
                                className="block size-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: colorOption.value }}
                              ></span>
                            )}
                            {colorOption.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {partnerId && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="share"
                      checked={shareWithPartner}
                      onCheckedChange={setShareWithPartner}
                      disabled={!currentSpaceId || !partnerId}
                    />
                    <Label htmlFor="share">
                      Share with partner when creating
                    </Label>
                  </div>
                )}
                {!partnerId && !loading && (
                  <p className="text-sm text-muted-foreground">
                    No partner found in an active space to share with.
                  </p>
                )}
                <Button type="submit">Create Note</Button>
              </form>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Your Events</h2>
                <div>
                  <Label htmlFor="date">Select Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  {loading ? (
                    <p>Loading events...</p>
                  ) : displayedNotes.length === 0 ? (
                    <p className="text-muted-foreground">
                      No events for this date. Create one!
                    </p>
                  ) : (
                    displayedNotes.map((note) => (
                      <Card
                        key={note.id}
                        className="p-4 border-l-4"
                        style={{ borderColor: note.color || "#ccc" }}
                      >
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {note.start_time && note.end_time
                            ? `${new Date(note.start_time).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )} - ${new Date(note.end_time).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}`
                            : note.start_time
                            ? `Starts: ${new Date(
                                note.start_time
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : note.end_time
                            ? `Ends: ${new Date(
                                note.end_time
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : ""}
                        </p>
                        {note.user_id === currentUserId && (
                          <div className="flex items-center justify-end gap-2 mt-2">
                            {partnerId && currentSpaceId && (
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`share-event-${note.id}`}
                                  className="text-sm"
                                >
                                  {note.is_shared ? "Shared" : "Share"}
                                </Label>
                                <AlertDialog
                                  open={isShareAlertDialogOpen[note.id] || false}
                                  onOpenChange={(isOpen) => setIsShareAlertDialogOpen(prevState => ({ ...prevState, [note.id]: isOpen }))}
                                >
                                  <AlertDialogTrigger asChild>
                                    <Switch
                                      id={`share-event-${note.id}`}
                                      checked={!!note.is_shared}
                                      onCheckedChange={(checked) => handleToggleShare(note, checked)}
                                      disabled={!currentSpaceId || !partnerId || !!note.is_shared}
                                    />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Share Event</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to share &quot;{note.title}&quot; with your partner?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => confirmShareNote(note)}>
                                        Share
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                            <AlertDialog open={isDeleteDialogOpen && noteToDelete?.id === note.id} onOpenChange={setIsDeleteDialogOpen}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteNote(note.id)} // This will now set the state and open the dialog
                                >
                                  <Trash2 className="size-4 mr-1" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the event
                                    <span className="font-semibold"> &quot;{noteToDelete?.title}&quot; </span>
                                    and remove its data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDeleteNote}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}