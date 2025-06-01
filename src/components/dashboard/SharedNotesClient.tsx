"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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

export default function SharedNotesClient({ user }: { user: User }) {
  const [incomingNotes, setIncomingNotes] = useState<SharedNote[]>([]);
  const [outgoingNotes, setOutgoingNotes] = useState<SharedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        fetch("/api/shared-notes?direction=incoming"),
        fetch("/api/shared-notes?direction=outgoing"),
      ]);

      if (!incomingRes.ok || !outgoingRes.ok) {
        throw new Error(
          `HTTP error! Incoming: ${incomingRes.status}, Outgoing: ${outgoingRes.status}`
        );
      }

      const incoming = await incomingRes.json();
      const outgoing = await outgoingRes.json();

      // Handle error responses
      if (incoming.error) {
        throw new Error(`Incoming notes error: ${incoming.error}`);
      }
      if (outgoing.error) {
        throw new Error(`Outgoing notes error: ${outgoing.error}`);
      }

      setIncomingNotes(Array.isArray(incoming) ? incoming : []);
      setOutgoingNotes(Array.isArray(outgoing) ? outgoing : []);
    } catch (error) {
      console.error("Failed to fetch shared notes", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch shared notes"
      );
      setIncomingNotes([]);
      setOutgoingNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = format(time, "EEEE, MMMM d, yyyy");
  const formattedTime = format(time, "p");

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
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
                <BreadcrumbPage>Shared Notes</BreadcrumbPage>
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
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* SPLIT VIEW */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN - NOTES SHARED WITH ME */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">
                Notes Shared By{" "}
                {incomingNotes.length > 0
                  ? incomingNotes[0].from_user_name === user.name
                    ? incomingNotes[0].to_user_name || "Partner"
                    : incomingNotes[0].from_user_name || "Partner"
                  : "Partner"}
              </h2>
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
                <div className="space-y-3">
                  {incomingNotes.map((note) => (
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
                          {note.from_user_avatar && (
                            <AvatarImage
                              src={note.from_user_avatar}
                              alt={`${note.from_user_name}'s avatar`}
                            />
                          )}
                          <AvatarFallback>
                            {note.from_user_name?.slice(0, 2).toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                        {note.content || "No content"}
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
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - NOTES I SHARED */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">My Notes</h2>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              ) : outgoingNotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t shared any notes yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share notes from your Notes page to see them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {outgoingNotes.map((note) => (
                    <Card
                      key={note.id}
                      className="p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
                      style={{ borderColor: note.color || "#ccc" }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-medium truncate pr-2">
                          {note.title}
                        </h3>
                        {/* <Avatar className="h-6 w-6 text-xs flex-shrink-0">
                          <AvatarFallback>
                            {note.to_user_name?.slice(0, 2).toUpperCase() || "P"}
                          </AvatarFallback>
                        </Avatar> */}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                        {note.content || "No content"}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>To: {note.to_user_name || "Unknown"}</span>
                        <span>{formatDateTime(note.created_at)}</span>
                      </div>
                      {(note.start_time || note.end_time) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Schedule: {formatDateTime(note.start_time)} -{" "}
                          {formatDateTime(note.end_time)}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
