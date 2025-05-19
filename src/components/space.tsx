"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpaceProps {
  spaceId: string;
  onClose: () => void;
}

export function Space({ spaceId, onClose }: SpaceProps) {
  const [notes, setNotes] = useState<{ id: string; content: string }[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`space-notes-${spaceId}`);
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, [spaceId]);

  useEffect(() => {
    localStorage.setItem(`space-notes-${spaceId}`, JSON.stringify(notes));
  }, [notes, spaceId]);

  function addNote() {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), content: newNote },
    ]);
    setNewNote("");
  }

  return (
    <div className="bg-white rounded shadow-lg p-6 w-[400px] max-h-[80vh] overflow-auto fixed top-16 right-8 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Space: {spaceId}</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-bold">
          ✕
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Write a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button onClick={addNote}>Add Note</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
