// components/dashboard/PartnerNotesList.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, isSameDay, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Badge } from "../ui/badge";
import { CalendarCheck2, CalendarDays, PencilLine } from "lucide-react";
import { useSpace } from '@/contexts/SpaceContext';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface SharedNote {
  id: string;
  title: string;
  content: string;
  color?: string;
  from_user_name?: string;
  from_user_avatar?: string;
  to_user_name?: string;
  to_user_avatar?: string;
  created_at: string;
  start_time?: string;
  end_time?: string;
}

interface PartnerNotesListProps {
  user: User;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function PartnerNotesList({ selectedDate }: PartnerNotesListProps) {
  const { currentSpaceId } = useSpace();
  const [allIncomingNotes, setAllIncomingNotes] = useState<SharedNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<SharedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNoteIds, setNewNoteIds] = useState<Set<string>>(new Set());

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
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

  function formatDateRangeIfNeeded(start?: string, end?: string) {
    if (!start) return "";
    const startDate = new Date(start);
    const formattedStart = format(startDate, "MMM d, yyyy");

    if (!end) return formattedStart;

    const endDate = new Date(end);

    if (isSameDay(startDate, endDate)) {
      return formattedStart;
    } else {
      const formattedEnd = format(endDate, "MMM d, yyyy");
      return `${formattedStart} - ${formattedEnd}`;
    }
  }

  // Filter notes based on selected date
  const filterNotesByDate = useCallback((notes: SharedNote[], dateString: string) => {
    const selectedDateObj = parseISO(dateString);
    const dayStart = startOfDay(selectedDateObj);
    const dayEnd = endOfDay(selectedDateObj);

    return notes.filter((note) => {
      // If note has start_time and/or end_time, filter based on those
      if (note.start_time || note.end_time) {
        const startTime = note.start_time ? parseISO(note.start_time) : dayStart;
        const endTime = note.end_time ? parseISO(note.end_time) : dayEnd;

        // Check if the selected date overlaps with the note's time range
        return (
          isWithinInterval(selectedDateObj, { start: startOfDay(startTime), end: endOfDay(endTime) }) ||
          isWithinInterval(dayStart, { start: startTime, end: endTime }) ||
          isWithinInterval(dayEnd, { start: startTime, end: endTime })
        );
      } else {
        // If no start_time/end_time, filter by created_at date
        const createdDate = parseISO(note.created_at);
        return isSameDay(createdDate, selectedDateObj);
      }
    });
  }, []);

  // Update filtered notes when selectedDate or allIncomingNotes change
  useEffect(() => {
    const filtered = filterNotesByDate(allIncomingNotes, selectedDate);
    setFilteredNotes(filtered);
  }, [allIncomingNotes, selectedDate, filterNotesByDate]);

  const fetchIncomingNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Fetching incoming events...", { currentSpaceId });
      if (!currentSpaceId) {
        console.log("❌ No currentSpaceId available");
        setAllIncomingNotes([]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `/api/shared-notes?direction=incoming&space_id=${currentSpaceId}`
      );
      
      if (!res.ok) {
        throw new Error("Failed to fetch shared events");
      }

      const sharedNotes = await res.json();
      console.log("✅ Shared events:", sharedNotes);

      const now = Date.now();
      const sorted = sharedNotes.sort((a: SharedNote, b: SharedNote) => {
        const aTime = new Date(a.start_time || a.created_at || 0).getTime();
        const bTime = new Date(b.start_time || b.created_at || 0).getTime();
        return aTime - bTime;
      });

      const newIds = sorted
        .filter((note: SharedNote) => {
          const created = new Date(note.created_at).getTime();
          return now - created < 5 * 60 * 1000; // less than 5 min
        })
        .map((note: SharedNote) => note.id);

      console.log("✅ Setting events:", sorted);
      setAllIncomingNotes(sorted);
      setNewNoteIds(new Set(newIds));
      setTimeout(() => {
        setNewNoteIds(new Set());
      }, 5 * 60 * 1000);

    } catch (error) {
      console.error("❌ Failed to fetch incoming shared events:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch incoming shared events"
      );
      setAllIncomingNotes([]);
    } finally {
      setLoading(false);
    }
  }, [currentSpaceId]);

  useEffect(() => {
    fetchIncomingNotes();
  }, [fetchIncomingNotes, currentSpaceId]);

  return (
    <div className="flex flex-col gap-4">

      {error && (
        <div>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No events found for this date.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Events shared by your partner for the selected date will appear here.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
              style={{ borderColor: note.color || "#ccc" }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-medium truncate pr-2">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2">
                  {newNoteIds.has(note.id) && (
                    <Badge className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-md">
                      New
                    </Badge>
                  )}
                  <Avatar className="h-6 w-6 text-xs flex-shrink-0">
                    <AvatarImage src={note.from_user_avatar} />
                    <AvatarFallback>
                      {note.from_user_name?.slice(0, 2).toUpperCase() || "P"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                {note.content || " "}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>From: {note.from_user_name || "Unknown"}</span>

                <span className="flex items-center gap-1">
                  <PencilLine className="w-3 h-3" />: {formatDateTime(note.created_at)}
                </span>
              </div>

              {(note.start_time || note.end_time) && (
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {formatDateRangeIfNeeded(note.start_time, note.end_time)}
                </div>
              )}

              {(note.start_time || note.end_time) && (
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <CalendarCheck2 className="w-4 h-4" />:{" "}
                  {formatDateTime2(note.start_time)} -{" "}
                  {formatDateTime2(note.end_time)}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}