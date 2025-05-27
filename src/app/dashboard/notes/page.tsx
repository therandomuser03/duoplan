"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // ShadCN Switch

export default function Notes() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    start_time: "",
    end_time: "",
    color: "",
  });
  const [shareWithPartner, setShareWithPartner] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const notePayload = {
      ...formData,
      shareWithPartner,
    };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notePayload),
      });

      if (res.ok) {
        alert("Note created successfully!");
        setFormData({
          title: "",
          content: "",
          start_time: "",
          end_time: "",
          color: "",
        });
        setShareWithPartner(false);
        fetchNotes(); // Re-fetch notes after creating one
      } else {
        alert("Failed to create note.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedDate]);

  return (
    <SidebarProvider>
      <AppSidebar />
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
            {/* Left Panel: Create Note */}
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
                  <Input name="color" value={formData.color} onChange={handleChange} />
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="share" checked={shareWithPartner} onCheckedChange={setShareWithPartner} />
                  <Label htmlFor="share">Share with partner</Label>
                </div>

                {/* If shareWithPartner === true, backend should create a shared_notes entry using `spaces`. */}

                <Button type="submit">Create Note</Button>
              </form>
            </Card>

            {/* Right Panel: View Notes by Date */}
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
                    <p className="text-muted-foreground">No notes for today. Create a note.</p>
                  ) : (
                    notes.map((note) => (
                      <Card key={note.id} className="p-4 border-l-4" style={{ borderColor: note.color || "#ccc" }}>
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-sm text-muted-foreground">{note.content}</p>
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
