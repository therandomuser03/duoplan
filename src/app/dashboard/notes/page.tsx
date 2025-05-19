// notes/page.tsx

"use client";

import React, { useState, useEffect } from "react";

import { Bell, Plus, Search, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { useUser } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";

const colorOptions = [
  { name: "Blue", class: "bg-blue-500" },
  { name: "Red", class: "bg-red-500" },
  { name: "Green", class: "bg-green-500" },
  { name: "Purple", class: "bg-purple-500" },
  { name: "Orange", class: "bg-orange-500" },
  { name: "Yellow", class: "bg-yellow-500" },
  { name: "Gray", class: "bg-gray-200" },
];

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

  // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteStartTime, setNewNoteStartTime] = useState("");
  const [newNoteEndTime, setNewNoteEndTime] = useState("");
  const [newNotePlace, setNewNotePlace] = useState("");
  const [newNoteColor, setNewNoteColor] = useState("bg-blue-500");

  const fetchNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log("Fetching notes for Clerk ID:", user.id);

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("time_created", { ascending: false });

      console.log("Supabase returned:", { data, error });

      if (error) {
        console.error("Supabase query error:", error.message || error);
        toast.error("Failed to load notes");
        return;
      }

      if (!data || data.length === 0) {
        console.warn("No notes returned for this user.");
      }

      const mappedNotes = data.map(
        (note: {
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
        })
      );

      setNotes(mappedNotes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Unexpected error fetching notes:", error.message);
        toast.error("Error loading notes");
      } else {
        console.error("Unexpected error fetching notes:", error);
        toast.error("Error loading notes");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch notes on initial load
  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  const now = new Date().toISOString();

  const toUTCISOString = (local: string) => {
    return new Date(local).toISOString(); // interprets local time, converts to UTC
  };

  // Handle add/edit note submission
  const handleAddOrEditNote = async () => {
    if (!newNoteTitle || !newNoteContent || !user) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const noteData = {
        user_id: user.id,
        title: newNoteTitle,
        content: newNoteContent,
        start_time: toUTCISOString(newNoteStartTime),
        end_time: toUTCISOString(newNoteEndTime),
        place: newNotePlace,
        color_class: newNoteColor,
        time_created: now,
        created_at: now,
      };

      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from("notes")
          .update(noteData)
          .eq("id", editingNote.id);

        if (error) {
          console.error("Error updating note:", error);
          toast.error("Failed to update note");
          return;
        }

        toast.success("Note updated successfully");
      } else {
        // Create new note
        const { data, error } = await supabase.from("notes").insert([noteData]);
        if (error) {
          console.error(
            "Supabase insert error:",
            JSON.stringify(error, null, 2)
          );
        } else {
          console.log("Note created:", data);
        }
        toast.success("Note created successfully");
      }

      // Close modal and reset form
      setIsModalOpen(false);
      resetForm();

      // Refresh notes list
      fetchNotes();
    } catch (error) {
      console.error("Error in note operation:", error);
      toast.error("An error occurred");
    }
  };

  // Handle note deletion
  const handleDeleteNote = async () => {
    if (!editingNote) return;

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", editingNote.id);

      if (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
        return;
      }

      toast.success("Note deleted successfully");
      setIsModalOpen(false);
      resetForm();

      // Refresh notes list
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("An error occurred");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setEditingNote(null);
    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteStartTime("");
    setNewNoteEndTime("");
    setNewNotePlace("");
    setNewNoteColor("bg-blue-500");
  };

  // Open modal for creating new note
  const openAddNoteModal = () => {
    resetForm();

    // Set default times to now and +1 hour
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setNewNoteStartTime(now.toISOString().slice(0, 16));
    setNewNoteEndTime(oneHourLater.toISOString().slice(0, 16));

    setIsModalOpen(true);
  };

  // Open modal for editing existing note
  const openEditNoteModal = (note: Note) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);

    // Convert ISO dates to local datetime-local format
    const startDate = new Date(note.startTime);
    const endDate = new Date(note.endTime);

    setNewNoteStartTime(startDate.toISOString().slice(0, 16));
    setNewNoteEndTime(endDate.toISOString().slice(0, 16));

    setNewNotePlace(note.place === "—" ? "" : note.place);
    setNewNoteColor(note.color);

    setIsModalOpen(true);
  };

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

    // Apply tab filter
    if (activeTab === "recent") {
      // Show only notes from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (note) => new Date(note.timeCreated) > sevenDaysAgo
      );
    } else if (activeTab === "favorites") {
      // In a real app, you'd have a favorites field
      // For now, just show a subset based on colors
      filtered = filtered.filter(
        (note) =>
          note.color === "bg-yellow-500" || note.color === "bg-orange-500"
      );
    } else if (activeTab === "date") {
      // Sort by date (already ordered by date in the fetchNotes function)
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
      <Toaster position="top-right" />
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
              <Button variant="ghost" onClick={openAddNoteModal}>
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
            <Button
              onClick={openAddNoteModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </div>

          {/* Tab UI */}
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
                No notes found. Try adjusting your search criteria or create a
                new note.
              </p>
              <Button
                onClick={openAddNoteModal}
                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openEditNoteModal(note)}
                >
                  <div className={`h-2 ${note.color}`} />
                  <div className="p-4 bg-muted/30 dark:bg-muted/20 h-full flex flex-col">
                    <h3 className="text-lg font-medium text-blue-500 mb-1">
                      {note.title}
                    </h3>
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

        {/* Add/Edit Note Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-md shadow-md w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                {editingNote ? "Edit Note" : "Add New Note"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Title
                  </label>
                  <Input
                    type="text"
                    placeholder="Note title"
                    className="w-full"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    placeholder="Note content"
                    className="w-full min-h-24"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Start Time
                    </label>
                    <Input
                      type="datetime-local"
                      className="w-full"
                      value={newNoteStartTime}
                      onChange={(e) => setNewNoteStartTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      End Time
                    </label>
                    <Input
                      type="datetime-local"
                      className="w-full"
                      value={newNoteEndTime}
                      onChange={(e) => setNewNoteEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Place
                  </label>
                  <Input
                    type="text"
                    placeholder="Associated location"
                    className="w-full"
                    value={newNotePlace}
                    onChange={(e) => setNewNotePlace(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color.class}
                        type="button"
                        className={`w-8 h-8 rounded-full ${color.class} ${
                          newNoteColor === color.class
                            ? "ring-2 ring-offset-2 ring-blue-600"
                            : ""
                        }`}
                        onClick={() => setNewNoteColor(color.class)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleAddOrEditNote}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {editingNote ? "Update Note" : "Save Note"}
                  </Button>

                  <Button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>

                {editingNote && (
                  <Button
                    onClick={handleDeleteNote}
                    variant="destructive"
                    className="w-full mt-2"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Note
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Notes;
