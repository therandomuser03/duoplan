// app/api/notes/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// --- POST method (for creating notes) ---
// (Your existing POST function remains here - no changes needed from your provided code)
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    content,
    start_time,
    end_time,
    color,
    shareWithPartner,
    activeSpaceId,
    partnerId,
  } = body;

  const noteToInsert = {
    user_id: user.id,
    title,
    content,
    start_time: start_time || null,
    end_time: end_time || null,
    color: color || null,
    space_id: activeSpaceId || null,
  };

  try {
    const { data: insertedNote, error: insertError } = await supabase
      .from("notes")
      .insert([noteToInsert])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting note:", insertError);
      return NextResponse.json(
        { error: "Failed to create note", details: insertError.message },
        { status: 500 }
      );
    }

    if (shareWithPartner && activeSpaceId && partnerId && insertedNote) {
      // Instead of creating a new note, just create a sharing record
      const { error: shareError } = await supabase.from("shared_notes").insert({
        from_user_id: user.id,
        to_user_id: partnerId,
        space_id: activeSpaceId,
        original_note_id: insertedNote.id,
        title: insertedNote.title,
        content: insertedNote.content,
        start_time: insertedNote.start_time,
        end_time: insertedNote.end_time,
        color: insertedNote.color,
      });

      if (shareError) {
        console.error("Error sharing note on creation:", shareError);
        // Even if sharing fails, we still return the created note
      } else {
        console.log("Note successfully shared on creation.");
      }
    }
    return NextResponse.json(
      { message: "Note created successfully!", note: insertedNote },
      { status: 201 }
    );
  } catch (runtimeError) {
    console.error("Runtime error during note creation:", runtimeError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// --- GET method (for fetching notes) --- MODIFIED
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get("date"); // Will be used if provided
  const partnerId = searchParams.get("partnerId");
  const activeSpaceId = searchParams.get("activeSpaceId");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let query = supabase.from("notes").select("*").eq("user_id", user.id);

    // If selectedDate is provided, filter by created_at.
    // Otherwise, fetch all notes for the user (allowing client-side span filtering).
    if (selectedDate) {
      const startDate = `${selectedDate}T00:00:00.000Z`; // Start of the selected day in UTC
      const endDate = `${selectedDate}T23:59:59.999Z`; // End of the selected day in UTC
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    }
    // You might want to add other filters here if needed, e.g., based on activeSpaceId
    // if notes are context-specific even when fetching "all" for the user.

    query = query.order("created_at", { ascending: true }); // Order by creation time

    const { data: notes, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching notes:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch notes", details: fetchError.message },
        { status: 500 }
      );
    }

    // Logic to determine `is_shared` status
    if (partnerId && activeSpaceId && notes) {
      // Ensure notes is not null
      const { data: sharedNoteLinks, error: fetchSharedError } = await supabase
        .from("shared_notes")
        .select("original_note_id")
        .eq("from_user_id", user.id)
        .eq("to_user_id", partnerId)
        .eq("space_id", activeSpaceId);

      if (fetchSharedError) {
        console.error("Error fetching shared note links:", fetchSharedError);
        // Continue without shared status if this fails, or handle error more strictly
      }

      const sharedNoteIds = new Set(
        sharedNoteLinks?.map((link) => link.original_note_id) || []
      );
      const notesWithSharedStatus = notes.map((note) => ({
        ...note,
        is_shared: sharedNoteIds.has(note.id),
      }));
      return NextResponse.json(notesWithSharedStatus, { status: 200 });
    } else if (notes) {
      // Ensure notes is not null
      // If no partner or space, notes cannot be marked as shared in this context
      const notesWithoutSharedStatus = notes.map((note) => ({
        ...note,
        is_shared: false,
      }));
      return NextResponse.json(notesWithoutSharedStatus, { status: 200 });
    } else {
      return NextResponse.json([], { status: 200 }); // Return empty array if notes is null/undefined
    }
  } catch (runtimeError) {
    console.error("Runtime error during notes fetch:", runtimeError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// --- DELETE method (for deleting notes) ---
// (Your existing DELETE function remains here - no changes needed from your provided code)
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const noteId = searchParams.get("id");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!noteId) {
    return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
  }

  try {
    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting note:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete note", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Note deleted successfully!" },
      { status: 200 }
    );
  } catch (runtimeError) {
    console.error("Runtime error during note deletion:", runtimeError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
