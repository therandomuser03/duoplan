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
import { Share2, Trash2 } from "lucide-react";
import { toast } from "sonner"; // Import toast from Sonner

interface User {
  name: string;
  email: string;
  avatar: string;
}

export default function NotesClient({ user }: { user: User }) {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    start_time: "",
    end_time: "",
    color: "",
  });
  const [shareWithPartner, setShareWithPartner] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  interface Note {
    id: string;
    title: string;
    content: string;
    start_time?: string;
    end_time?: string;
    color?: string;
    created_at: string;
    user_id: string;
    is_already_shared?: boolean; // Keeping this if used elsewhere, but focusing on is_shared
    is_shared?: boolean;
  }

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (value: string) => {
    setFormData({ ...formData, color: value === "none" ? "" : value });
  };

  useEffect(() => {
    const fetchSpaceAndPartner = async () => {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        console.error("Auth error fetching user:", authError);
        // toast.error("Authentication error. Please try again."); // Optional: notify user
        return;
      }
      setCurrentUserId(currentUser.id);

      const { data: spaces, error: spacesError } = await supabase
        .from('spaces')
        .select('*')
        .or(`user_a_id.eq.${currentUser.id},user_b_id.eq.${currentUser.id}`);

      if (spacesError) {
        console.error("Error fetching spaces:", spacesError);
        // toast.error("Could not fetch your space details."); // Optional: notify user
        return;
      }

      if (spaces && spaces.length > 0) {
        const activeSpace = spaces[0];
        setActiveSpaceId(activeSpace.id);
        const partnerId = activeSpace.user_a_id === currentUser.id
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating note...");

    const notePayload = {
      ...formData,
      shareWithPartner, // This is for sharing upon creation
      activeSpaceId: shareWithPartner ? activeSpaceId : null,
      partnerId: shareWithPartner ? partnerId : null,
    };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notePayload),
      });

      if (res.ok) {
        toast.success("Note created successfully!", { id: toastId });
        setFormData({
          title: "",
          content: "",
          start_time: "",
          end_time: "",
          color: "",
        });
        setShareWithPartner(false);
        fetchNotes();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to create note: ${errorData.message || res.statusText}`, { id: toastId });
        console.error("Failed to create note:", errorData);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Error submitting form. Check console for details.", { id: toastId });
    }
  };

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
        toast.error(`Failed to delete note: ${errorData.message || res.statusText}`, { id: toastId });
        console.error("Failed to delete note:", errorData);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Error deleting note. Check console for details.", { id: toastId });
    }
  };

  const handleToggleShare = async (note: Note, checked: boolean) => {
    if (!activeSpaceId || !partnerId || !currentUserId) {
      toast.error("Cannot share/unshare: Space or partner information is missing.");
      return;
    }

    let toastId: string | number | undefined;

    if (checked) { // User wants to SHARE
      if (!confirm(`Are you sure you want to share "${note.title}" with your partner?`)) {
        return;
      }
      toastId = toast.loading("Sharing note...");
      try {
        const res = await fetch("/api/shared_notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noteId: note.id,
            activeSpaceId: activeSpaceId,
            partnerId: partnerId,
          }),
        });

        if (res.ok) {
          toast.success("Note shared successfully!", { id: toastId });
          fetchNotes();
        } else {
          const errorData = await res.json();
          toast.error(`Failed to share note: ${errorData.message || res.statusText}`, { id: toastId });
          console.error("Failed to share note:", errorData);
          fetchNotes(); // Re-fetch to revert switch state if API failed
        }
      } catch (err) {
        console.error("Error sharing note:", err);
        toast.error("Error sharing note. Check console for details.", { id: toastId });
        fetchNotes();
      }
    } else { // User wants to UNSHARE
      if (!confirm(`Are you sure you want to unshare "${note.title}"? This will remove the shared copy from your partner.`)) {
        return;
      }
      toastId = toast.loading("Unsharing note...");
      try {
        const res = await fetch(`/api/shared_notes?fromUserId=${currentUserId}&toUserId=${partnerId}&spaceId=${activeSpaceId}&title=${encodeURIComponent(note.title)}&content=${encodeURIComponent(note.content)}`, { // Ensure your DELETE endpoint can handle these params
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          toast.success("Note unshared successfully!", { id: toastId });
          fetchNotes();
        } else {
          const errorData = await res.json();
          toast.error(`Failed to unshare note: ${errorData.message || res.statusText}`, { id: toastId });
          console.error("Failed to unshare note:", errorData);
          fetchNotes();
        }
      } catch (err) {
        console.error("Error unsharing note:", err);
        toast.error("Error unsharing note. Check console for details.", { id: toastId });
        fetchNotes();
      }
    }
  };

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      date: selectedDate,
    });

    // These are crucial for the backend to determine `is_shared` status correctly
    if (partnerId && activeSpaceId) {
      queryParams.append('partnerId', partnerId);
      queryParams.append('activeSpaceId', activeSpaceId);
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
    if (currentUserId) { // Fetch notes only after currentUserId is known
        fetchNotes();
    }
  }, [fetchNotes, currentUserId]); // Add currentUserId

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">Create a Note</h2>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea name="content" value={formData.content} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Select name="color" value={formData.color} onValueChange={handleColorChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((colorOption) => (
                        <SelectItem key={colorOption.value} value={colorOption.value}>
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
                      disabled={!activeSpaceId || !partnerId}
                    />
                    <Label htmlFor="share">Share with partner when creating</Label>
                  </div>
                )}
                {(!partnerId && !loading) && (
                    <p className="text-sm text-muted-foreground">No partner found in an active space to share with.</p>
                )}
                <Button type="submit">Create Note</Button>
              </form>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Your Notes</h2>
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
                    <p>Loading notes...</p>
                  ) : notes.length === 0 ? (
                    <p className="text-muted-foreground">No notes for this date. Create one!</p>
                  ) : (
                    notes.map((note) => (
                      <Card
                        key={note.id}
                        className="p-4 border-l-4"
                        style={{ borderColor: note.color || "#ccc" }}
                      >
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p> {/* Added whitespace-pre-wrap */}
    <p className="text-xs text-muted-foreground">
      {note.start_time && note.end_time
    ? `${new Date(note.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(note.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : note.start_time
    ? `Starts: ${new Date(note.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : note.end_time
    ? `Ends: ${new Date(note.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : ''}
    </p>
                        {note.user_id === currentUserId && (
                          <div className="flex items-center justify-end gap-2 mt-2">
                            {partnerId && activeSpaceId && (
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`share-note-${note.id}`} className="text-sm">
                                  {note.is_shared ? "Shared" : "Share"}
                                </Label>
                                <Switch
                                  id={`share-note-${note.id}`}
                                  checked={!!note.is_shared}
                                  onCheckedChange={(checked) => handleToggleShare(note, checked)}
                                  // MODIFIED: Disable if no space/partner OR if note is already shared
                                  disabled={!activeSpaceId || !partnerId || !!note.is_shared}
                                />
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