// notes/page.tsx

"use client";

import React, { useState, useEffect } from "react";

import { Bell, Plus, Search } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useUser } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";

function Notes() {
  const { user } = useUser();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  type Note = {
    id: string;
    title: string;
    content: string;
    timeCreated: string;
    startTime: string;
    endTime: string;
    place: string;
    color: string;
  };

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Simulate fetching data from an API
  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching notes for Clerk ID:", user.id); // Log Clerk ID

        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("time_created", { ascending: false });

        console.log("Supabase returned:", { data, error });

        if (error) {
          console.error("Supabase query error:", error.message || error);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("No notes returned for this user.");
        }

        const mappedNotes = data.map((note: {
          id: string;
          title: string;
          content: string;
          time_created: string;
          start_time: string;
          end_time: string;
          place?: string;
          color_class?: string;
        }) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          timeCreated: note.time_created,
          startTime: note.start_time,
          endTime: note.end_time,
          place: note.place || "—",
          color: note.color_class || "bg-gray-200",
        }));

        setNotes(mappedNotes);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "Unexpected error fetching notes:",
            error.message
          );
        } else {
          console.error("Unexpected error fetching notes:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user, supabase]);

  // Filter notes based on search query and active tab
  const getFilteredNotes = () => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter (this would be more sophisticated in a real app)
    if (activeTab === "recent") {
      // Show only notes from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (note) => new Date(note.timeCreated) > sevenDaysAgo
      );
    } else if (activeTab === "favorites") {
      // In a real app, you'd have a favorites field
      // For now, just show a subset
      filtered = filtered.filter((note) => [1, 3, 5].includes(Number(note.id)));
    } else if (activeTab === "date") {
      // Already sorted by date in the useEffect
    }

    return filtered;
  };

  // Define tabs
  const tabs = [
    { id: "all", label: "All Notes" },
    { id: "recent", label: "Recent" },
    { id: "favorites", label: "Favorites" },
    { id: "date", label: "Date Added" },
  ];

  const filteredNotes = getFilteredNotes();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbPage className="text-xl">Notes</BreadcrumbPage>
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

        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search notes..."
                className="pl-10 bg-muted/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Updated tab UI to match Shared Plans design */}
          <div className="flex border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "px-6 py-3 font-medium",
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No notes found. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className={`h-2 ${note.color}`} />
                  <div className="p-4 bg-muted/30 dark:bg-muted/20 h-full flex flex-col">
                    <h3 className="text-lg font-medium text-blue-500 mb-1">
                      {note.title}
                    </h3>
                    {/* <p className="text-xs text-muted-foreground mb-3">
                      Last edited: {note.lastEdited}
                    </p> */}
                    <p className="text-xs text-muted-foreground mb-3">
                      Start: {new Date(note.startTime).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      End: {new Date(note.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm flex-1 whitespace-pre-line">
                      {note.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-4">
                      Related to: {note.place}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Notes;
