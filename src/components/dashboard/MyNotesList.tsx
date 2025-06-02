// components/dashboard/MyNotesList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { CalendarCheck2, PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns"; // Added date-fns imports
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  start_time?: string;
  end_time?: string;
  color?: string;
  created_at: string;
  user_id: string;
  is_shared?: boolean;
}

interface MyNotesListProps {
  user: User; // This prop is defined but not used in the provided snippet. Consider removing if not needed.
  selectedDate: string;
  onDateChange: (date: string) => void; // This prop is defined but not used. Consider removing if not needed.
}

export default function MyNotesList({ selectedDate }: MyNotesListProps) {
  const supabase = createClient();

  const [allNotes, setAllNotes] = useState<Note[]>([]); // Stores all fetched notes
  const [displayedNotes, setDisplayedNotes] = useState<Note[]>([]); // Stores notes filtered by selectedDate
  const [loading, setLoading] = useState(true);

  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const formatDateTime2 = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "h:mm a");
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchSpaceAndPartner = async () => {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        console.error("Auth error fetching user:", authError);
        setLoading(false); // Stop loading if user fetch fails
        return;
      }
      setCurrentUserId(currentUser.id);

      const { data: spaces, error: spacesError } = await supabase
        .from("spaces")
        .select("*")
        .or(`user_a_id.eq.${currentUser.id},user_b_id.eq.${currentUser.id}`);

      if (spacesError) {
        console.error("Error fetching spaces:", spacesError);
        // Potentially set loading to false or handle error state
        return;
      }

      if (spaces && spaces.length > 0) {
        const activeSpace = spaces[0];
        setActiveSpaceId(activeSpace.id);
        const determinedPartnerId =
          activeSpace.user_a_id === currentUser.id
            ? activeSpace.user_b_id
            : activeSpace.user_a_id;
        setPartnerId(determinedPartnerId);
      } else {
        // No active space, but we can still fetch user's own notes
        setActiveSpaceId(null);
        setPartnerId(null);
      }
    };

    fetchSpaceAndPartner();
  }, [supabase]);

  const fetchNotes = useCallback(async () => {
    if (!currentUserId) return; // Don't fetch if currentUserId is not set

    setLoading(true);
    // Modify queryParams: Remove 'date' if your API supports fetching all notes for the user.
    // If your API *requires* a date or some other parameters for fetching user's notes,
    // you might need to adjust this. For this example, we assume an endpoint
    // that returns all user notes, possibly filtered by space/partner if relevant.
    const queryParams = new URLSearchParams();
    if (partnerId && activeSpaceId) { // These might still be relevant for context
      queryParams.append("partnerId", partnerId);
      queryParams.append("activeSpaceId", activeSpaceId);
    }
    // If your API requires userId, ensure it's implicitly handled by auth or add it.
    // For example: queryParams.append("userId", currentUserId);

    try {
      // Assuming `/api/notes` without a `date` param fetches all notes for the user
      // or notes relevant to their context (e.g., based on activeSpaceId).
      // If your API needs changes to support this, that will be a backend task.
      const res = await fetch(`/api/notes?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAllNotes(Array.isArray(data) ? data : []);
      } else {
        setAllNotes([]);
        toast.error("Failed to fetch notes.");
        console.error("Failed to fetch notes:", await res.text());
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setAllNotes([]);
      toast.error("An error occurred while fetching notes.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, partnerId, activeSpaceId, supabase]); // Removed selectedDate from dependencies

  useEffect(() => {
    // Fetch notes when currentUserId is known, and also if partnerId/activeSpaceId change
    // as they might affect the context of notes fetched.
    if (currentUserId) {
      fetchNotes();
    }
  }, [fetchNotes, currentUserId]);


  const filterNotesByDate = useCallback((notesToFilter: Note[], dateString: string): Note[] => {
    if (!dateString) return notesToFilter; // Or return empty array: return [];

    try {
        const selectedDateObj = parseISO(dateString);
        const dayStart = startOfDay(selectedDateObj);
        const dayEnd = endOfDay(selectedDateObj);

        return notesToFilter.filter((note) => {
        if (note.start_time || note.end_time) {
            const startTime = note.start_time ? parseISO(note.start_time) : dayStart;
            // If end_time is not present but start_time is, consider the note valid for the start_time's day.
            // Or, if only start_time is present, it might be an event for that specific day.
            // The original PartnerNotesList uses dayEnd if end_time is missing. Adjust as per your logic.
            const endTime = note.end_time ? parseISO(note.end_time) : (note.start_time ? endOfDay(startTime) : dayEnd);


            // Check if the selected date overlaps with the note's time range
            return (
            isWithinInterval(selectedDateObj, { start: startOfDay(startTime), end: endOfDay(endTime) }) || // Selected date is within the note's range
            isWithinInterval(dayStart, { start: startTime, end: endTime }) || // Note's range overlaps with start of selected date
            isWithinInterval(dayEnd, { start: startTime, end: endTime }) || // Note's range overlaps with end of selected date
            (isSameDay(startTime, selectedDateObj) && isSameDay(endTime, selectedDateObj)) // Note is within the same selected day
            );
        } else {
            // If no start_time/end_time, filter by created_at date
            const createdDate = parseISO(note.created_at);
            return isSameDay(createdDate, selectedDateObj);
        }
        });
    } catch (error) {
        console.error("Error parsing date or filtering notes:", error);
        return []; // Return empty array on error
    }
  }, []);

  useEffect(() => {
    if (allNotes.length > 0 || !loading) { // Process notes when allNotes is populated or loading is finished (to show empty state)
        const filtered = filterNotesByDate(allNotes, selectedDate);
        // Sort notes by start_time or created_at if needed
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


  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }
    const toastId = toast.loading("Deleting note...");

    try {
      const res = await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Note deleted successfully!", { id: toastId });
        // Refetch all notes to update the list, which will then be re-filtered
        fetchNotes();
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to delete note: ${errorData.message || res.statusText}`,
          { id: toastId }
        );
        console.error("Failed to delete note:", errorData);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Error deleting note. Check console for details.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Notes List */}
      <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : displayedNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No notes found for this date.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a new note or select a different date.
            </p>
          </div>
        ) : (
          displayedNotes.map((note) => (
            <Card
              key={note.id}
              className="p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
              style={{ borderColor: note.color || "#ccc" }}
            >
              <h3 className="text-base font-medium truncate pr-2">
                {note.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 mb-2 line-clamp-3">
                {note.content || " "}
              </p>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <PencilLine className="w-4 h-4" />: {formatDateTime(note.created_at)}
              </div>
              {(note.start_time || note.end_time) && (
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <CalendarCheck2 className="w-4 h-4" />: {formatDateTime2(note.start_time)} -{" "}
                  {formatDateTime2(note.end_time)}
                </div>
              )}
              <div className="flex justify-end items-center mt-3"> {/* Adjusted to justify-end if partnerId section is removed/conditional */}
                {/*
                  If you had specific UI related to partnerId for your own notes,
                  you can add it back here. For now, it's removed as the primary
                  focus is on the note display and deletion.
                */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="size-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}