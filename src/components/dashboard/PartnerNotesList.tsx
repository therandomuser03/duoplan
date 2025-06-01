// components/dashboard/PartnerNotesList.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { RefreshCw } from "lucide-react";
import { format } from "date-fns";


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

export default function PartnerNotesList({}: { user: User }) {
  const [incomingNotes, setIncomingNotes] = useState<SharedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const fetchIncomingNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const incomingRes = await fetch("/api/shared-notes?direction=incoming");

      if (!incomingRes.ok) {
        throw new Error(`HTTP error! Incoming: ${incomingRes.status}`);
      }

      const incoming = await incomingRes.json();

      if (incoming.error) {
        throw new Error(`Incoming notes error: ${incoming.error}`);
      }

      setIncomingNotes(Array.isArray(incoming) ? incoming : []);
    } catch (error) {
      console.error("Failed to fetch incoming shared notes", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch incoming shared notes"
      );
      setIncomingNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomingNotes();
  }, [fetchIncomingNotes]);

  return (
    <div className="flex flex-col gap-4">
      {/* <div className="flex justify-end items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchIncomingNotes}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />{" "}
          Refresh
        </Button>
      </div> */}
      {error && (
        <div>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex-1 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : incomingNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No notes shared with you yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Notes shared by your space partners will appear here.
            </p>
          </div>
        ) : (
          incomingNotes.map((note) => (
            <Card
              key={note.id}
              className="p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
              style={{ borderColor: note.color || "#ccc" }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-medium truncate pr-2">
                  {note.title}
                </h3>
                <Avatar className="h-6 w-6 text-xs flex-shrink-0">
                  <AvatarImage src={note.from_user_avatar} />
                  <AvatarFallback>
                    {note.from_user_name?.slice(0, 2).toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                {note.content || "-"}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>From: {note.from_user_name || "Unknown"}</span>
                <span>{formatDateTime(note.created_at)}</span>
              </div>
              {(note.start_time || note.end_time) && (
                <div className="text-xs text-muted-foreground mt-1">
                  Schedule: {formatDateTime(note.start_time)} -{" "}
                  {formatDateTime(note.end_time)}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}