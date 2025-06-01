// components/dashboard/MyNotesList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
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

export default function MyNotesList({}: { user: User }) {
  const supabase = createClient();

  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      // Assuming dateString is ISO 8601 UTC from Supabase
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
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
        return;
      }
      setCurrentUserId(currentUser.id);

      const { data: spaces, error: spacesError } = await supabase
        .from("spaces")
        .select("*")
        .or(`user_a_id.eq.${currentUser.id},user_b_id.eq.${currentUser.id}`);

      if (spacesError) {
        console.error("Error fetching spaces:", spacesError);
        return;
      }

      if (spaces && spaces.length > 0) {
        const activeSpace = spaces[0];
        setActiveSpaceId(activeSpace.id);
        const partnerId =
          activeSpace.user_a_id === currentUser.id
            ? activeSpace.user_b_id
            : activeSpace.user_a_id;
        setPartnerId(partnerId);
      } else {
        setActiveSpaceId(null);
        setPartnerId(null);
      }
    };

    fetchSpaceAndPartner();
  }, [supabase]);

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

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({ date: selectedDate });
    // These are crucial for the backend to determine `is_shared` status correctly
    if (partnerId && activeSpaceId) {
      queryParams.append("partnerId", partnerId);
      queryParams.append("activeSpaceId", activeSpaceId);
    }
    try {
      const res = await fetch(`/api/notes?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else {
        setNotes([]);
        toast.error("Failed to fetch notes.");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
      toast.error("An error occurred while fetching notes.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, partnerId, activeSpaceId]); // Dependencies are important

  useEffect(() => {
    if (currentUserId) {
      // Fetch notes only after currentUserId is known
      fetchNotes();
    }
  }, [fetchNotes, currentUserId]); // Add currentUserId

  return (
    <div className="flex flex-col gap-4">
      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="note-date-filter" className="text-sm">
          Filter by Date:
        </Label>
        <Input
          id="note-date-filter"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No notes found for this date.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a new note or select a different date.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <Card
              key={note.id}
              className="p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
              style={{ borderColor: note.color || "#ccc" }}
            >
              <h3 className="text-base font-medium truncate pr-2">
                {note.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                {note.content || "No content"}
              </p>
              <div className="text-xs text-muted-foreground">
                Created: {formatDateTime(note.created_at)}
              </div>
              {(note.start_time || note.end_time) && (
                <div className="text-xs text-muted-foreground mt-1">
                  Schedule: {formatDateTime(note.start_time)} -{" "}
                  {formatDateTime(note.end_time)}
                </div>
              )}
              <div className="flex justify-between items-center mt-3">
                {partnerId && ( // Only show share switch if a partner exists
                  <div className="flex items-center gap-2">
                    {/* <Label htmlFor={`share-note-${note.id}`} className="text-sm">
                      {note.is_shared ? "Shared" : "Share"}
                    </Label>
                    <Switch
                      id={`share-note-${note.id}`}
                      checked={!!note.is_shared}
                      onCheckedChange={(checked) => handleToggleShare(note, checked)}
                      disabled={!activeSpaceId || !partnerId}
                    /> */}
                  </div>
                )}
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