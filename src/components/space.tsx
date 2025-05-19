// src/components/space.tsx

"use client";

import { useEffect, useState } from "react";
import { getNotesInSpace } from "@/components/space-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Note {
  id: string;
  title?: string;
  content: string;
}

interface PageProps {
  spaceId: string;
  onClose: () => void;
}

export function Space({ spaceId, onClose }: PageProps) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await getNotesInSpace(spaceId);
        setNotes(notes);
      } catch (err) {
        console.error("Failed to fetch notes for space:", err);
      }
    }

    loadNotes();
  }, [spaceId]);

  return (
    <div className="bg-secondary rounded shadow-lg p-6 w-[400px] max-h-[80vh] overflow-auto fixed top-16 right-8 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Space: {spaceId}</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-bold">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="bg-yellow-200 p-4 rounded shadow">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">{note.title || "Note"}</CardTitle>
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
