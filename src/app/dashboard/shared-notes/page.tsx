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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function SharedNotes() {
const [incomingNotes, setIncomingNotes] = useState<SharedNote[]>([]);
const [outgoingNotes, setOutgoingNotes] = useState<SharedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  interface SharedNote {
  id: string;
  title: string;
  content: string;
  color?: string;
  from_user_name?: string;
  to_user_name?: string;
}


  const fetchNotes = async () => {
    setLoading(true);
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        fetch("/api/shared-notes?direction=incoming"),
        fetch("/api/shared-notes?direction=outgoing"),
      ]);

      const incoming = await incomingRes.json();
      const outgoing = await outgoingRes.json();

      setIncomingNotes(incoming);
      setOutgoingNotes(outgoing);
    } catch (error) {
      console.error("Failed to fetch shared notes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();

    // Live time update every minute
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = format(time, "EEEE, MMMM d, yyyy");
  const formattedTime = format(time, "p");

  return (
    <SidebarProvider>
      <AppSidebar />
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
        <div className="px-4 py-2">
          <div className="text-sm text-muted-foreground">
            {formattedDate} — {formattedTime}
          </div>
        </div>

        {/* SPLIT VIEW */}
<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* LEFT COLUMN - NOTES SHARED WITH ME */}
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Notes Shared With Me</h2>
      {loading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : incomingNotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No notes shared with you yet.
        </p>
      ) : (
        incomingNotes.map((note) => (
          <Card
            key={note.id}
            className="p-4 mb-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
            style={{ borderColor: note.color || "#ccc" }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">{note.title}</h3>
              <Avatar className="h-6 w-6 text-xs">
                <AvatarFallback>
                  {note.from_user_name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {note.content}
            </p>
          </Card>
        ))
      )}
    </div>

    {/* RIGHT COLUMN - NOTES I SHARED */}
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Notes I Shared</h2>
      {loading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : outgoingNotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t shared any notes yet.
        </p>
      ) : (
        outgoingNotes.map((note) => (
          <Card
            key={note.id}
            className="p-4 mb-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
            style={{ borderColor: note.color || "#ccc" }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">{note.title}</h3>
              <Avatar className="h-6 w-6 text-xs">
                <AvatarFallback>
                  {note.to_user_name?.slice(0, 2).toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {note.content}
            </p>
          </Card>
        ))
      )}
    </div>
  </div>
</div>

      </SidebarInset>
    </SidebarProvider>
  );
}
