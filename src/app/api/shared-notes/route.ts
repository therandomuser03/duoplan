// app/api/shared-notes/route.ts (unified route with both GET and POST)
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET handler to fetch shared notes
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const direction = searchParams.get("direction"); // 'incoming' or 'outgoing'

  try {
    if (direction === "incoming") {
      // Fetch notes shared with the current user
      const { data: incomingNotes, error: incomingError } = await supabase
        .from("shared_notes")
        .select(
          `
          *,
          from_user:users!from_user_id(first_name, last_name, username, avatar_url),
          to_user:users!to_user_id(first_name, last_name, username, avatar_url)
        `
        )
        .eq("to_user_id", user.id)
        .order("created_at", { ascending: false });

      if (incomingError) {
        console.error("Error fetching incoming notes:", incomingError);
        return NextResponse.json(
          { error: "Failed to fetch incoming notes" },
          { status: 500 }
        );
      }

      // Format the data to include user names and avatars
      const formattedNotes =
        incomingNotes?.map((note) => ({
          ...note,
          from_user_name: note.from_user?.first_name
            ? `${note.from_user.first_name} ${
                note.from_user.last_name || ""
              }`.trim()
            : note.from_user?.username || "Unknown User",
          from_user_avatar: note.from_user?.avatar_url || null,
        })) || [];

      return NextResponse.json(formattedNotes);
    } else if (direction === "outgoing") {
      // Fetch notes shared by the current user
      const { data: outgoingNotes, error: outgoingError } = await supabase
        .from("shared_notes")
        .select(
          `
          *,
          from_user:users!from_user_id(first_name, last_name, username, avatar_url),
          to_user:users!to_user_id(first_name, last_name, username, avatar_url)
        `
        )
        .eq("from_user_id", user.id)
        .order("created_at", { ascending: false });

      if (outgoingError) {
        console.error("Error fetching outgoing notes:", outgoingError);
        return NextResponse.json(
          { error: "Failed to fetch outgoing notes" },
          { status: 500 }
        );
      }

      // Format the data to include user names and avatars
      const formattedNotes =
        outgoingNotes?.map((note) => ({
          ...note,
          to_user_name: note.to_user?.first_name
            ? `${note.to_user.first_name} ${
                note.to_user.last_name || ""
              }`.trim()
            : note.to_user?.username || "Unknown User",
          to_user_avatar: note.to_user?.avatar_url || null,
        })) || [];

      return NextResponse.json(formattedNotes);
    } else {
      return NextResponse.json(
        { error: "Direction parameter is required (incoming or outgoing)" },
        { status: 400 }
      );
    }
  } catch (runtimeError) {
    console.error("Runtime error during fetching shared notes:", runtimeError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler to share a note
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
  const { noteId, activeSpaceId, partnerId } = body;

  if (!noteId || !activeSpaceId || !partnerId) {
    return NextResponse.json(
      { error: "Note ID, activeSpaceId, and partnerId are required" },
      { status: 400 }
    );
  }

  try {
    // 1. Verify the space relationship exists
    const { data: spaceData, error: spaceError } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", activeSpaceId)
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .single();

    if (spaceError || !spaceData) {
      console.error("Error verifying space relationship:", spaceError);
      return NextResponse.json(
        { error: "Invalid space or unauthorized access" },
        { status: 403 }
      );
    }

    // Verify partnerId is the other user in the space
    const isValidPartner =
      (spaceData.user_a_id === user.id && spaceData.user_b_id === partnerId) ||
      (spaceData.user_b_id === user.id && spaceData.user_a_id === partnerId);

    if (!isValidPartner) {
      return NextResponse.json(
        { error: "Invalid partner for this space" },
        { status: 403 }
      );
    }

    // 2. Fetch the original note details to copy them to shared_notes
    const { data: originalNote, error: fetchNoteError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .eq("user_id", user.id) // Ensure only the owner can share their note
      .single();

    if (fetchNoteError || !originalNote) {
      console.error("Error fetching original note:", fetchNoteError);
      return NextResponse.json(
        { error: "Original note not found or unauthorized to share" },
        { status: 404 }
      );
    }

    // 3. Check if note is already shared with this user in this space
    const { data: existingShare } = await supabase
      .from("shared_notes")
      .select("id")
      .eq("original_note_id", noteId)
      .eq("from_user_id", user.id)
      .eq("to_user_id", partnerId)
      .eq("space_id", activeSpaceId)
      .single();

    if (existingShare) {
      return NextResponse.json(
        { error: "Note already shared with this user" },
        { status: 409 }
      );
    }

    // 4. Insert into shared_notes table
    const { data: sharedNote, error: shareError } = await supabase
      .from("shared_notes")
      .insert({
        from_user_id: user.id,
        to_user_id: partnerId,
        space_id: activeSpaceId,
        original_note_id: originalNote.id,
        title: originalNote.title,
        content: originalNote.content,
        start_time: originalNote.start_time,
        end_time: originalNote.end_time,
        color: originalNote.color,
      })
      .select()
      .single();

    if (shareError) {
      console.error("Error sharing note:", shareError);
      return NextResponse.json(
        { error: "Failed to share note", details: shareError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Note shared successfully!", sharedNote },
      { status: 201 }
    );
  } catch (runtimeError) {
    console.error("Runtime error during note sharing:", runtimeError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
