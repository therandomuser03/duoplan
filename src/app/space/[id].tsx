"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SpacePage() {
  const router = useRouter();
  const { id } = router.query; // space id from URL

  const [notes, setNotes] = useState<
    { id: string; content: string }[]
  >([]);
  const [newNote, setNewNote] = useState("");

  // For demonstration: load saved notes from localStorage by space id
  useEffect(() => {
    if (typeof id === "string") {
      const saved = localStorage.getItem(`space-notes-${id}`);
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    }
  }, [id]);

  // Save notes to localStorage on update
  useEffect(() => {
    if (typeof id === "string") {
      localStorage.setItem(`space-notes-${id}`, JSON.stringify(notes));
    }
  }, [notes, id]);

  // Add new note handler
  function addNote() {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), content: newNote },
    ]);
    setNewNote("");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Space: {id}</h1>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Write a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button onClick={addNote}>Add Note</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="bg-yellow-200 p-4 rounded shadow">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
