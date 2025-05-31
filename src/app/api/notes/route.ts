// app/api/notes/route.ts
import { createClient } from '@/utils/supabase/server'; // Assuming you have a server-side Supabase client
import { NextResponse } from 'next/server';

// --- POST method (for creating notes) ---
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, start_time, end_time, color, shareWithPartner, activeSpaceId, partnerId } = body; 

  const noteToInsert = {
    user_id: user.id, // CRITICAL: Add the user ID here
    title,
    content,
    start_time: start_time || null,
    end_time: end_time || null,
    color: color || null,
  };

  try {
    const { data: insertedNote, error: insertError } = await supabase
      .from('notes')
      .insert([noteToInsert])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting note:", insertError);
      return NextResponse.json({ error: 'Failed to create note', details: insertError.message }, { status: 500 });
    }

    if (shareWithPartner && activeSpaceId && partnerId) {
    console.log("Attempting to share note on creation:", insertedNote.id, "to", partnerId, "in space", activeSpaceId);
    const { error: shareError } = await supabase
        .from('shared_notes')
        .insert({
            from_user_id: user.id,
            to_user_id: partnerId,
            space_id: activeSpaceId,
            original_note_id: insertedNote.id, // <--- ADD THIS LINE
            title: insertedNote.title,
            content: insertedNote.content,
            start_time: insertedNote.start_time,
            end_time: insertedNote.end_time,
            color: insertedNote.color,
        });

      if (shareError) {
        console.error("Error sharing note on creation:", shareError);
        // Do not return error here, note is already created. Log it.
      } else {
        console.log("Note successfully shared on creation.");
      }
    }

    return NextResponse.json({ message: 'Note created successfully!', note: insertedNote }, { status: 201 });

  } catch (runtimeError) {
    console.error("Runtime error during note creation:", runtimeError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- GET method (for fetching notes) ---
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get('date');
  const partnerId = searchParams.get('partnerId');
  const activeSpaceId = searchParams.get('activeSpaceId');

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!selectedDate) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    // Supabase stores timestamptz, so we need to query for notes within the selected day
    const startDate = `${selectedDate}T00:00:00.000Z`; // Start of the selected day in UTC
    const endDate = `${selectedDate}T23:59:59.999Z`;   // End of the selected day in UTC

    const { data: notes, error: fetchError } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id) // Filter by the current user's ID
      .gte('created_at', startDate) // Notes created on or after the start of the day
      .lte('created_at', endDate)   // Notes created on or before the end of the day
      .order('created_at', { ascending: true }); // Order by creation time

    if (fetchError) {
      console.error("Error fetching notes:", fetchError);
      return NextResponse.json({ error: 'Failed to fetch notes', details: fetchError.message }, { status: 500 });
    }

    if (partnerId && activeSpaceId) {
    const { data: sharedNoteLinks, error: fetchSharedError } = await supabase
        .from('shared_notes')
        .select('original_note_id') // Fetch only the original_note_id
        .eq('from_user_id', user.id) // Notes shared *by* the current user
        .eq('to_user_id', partnerId)
        .eq('space_id', activeSpaceId);

    if (fetchSharedError) {
        console.error("Error fetching shared note links:", fetchSharedError);
        // Decide how to handle this error. For now, continue but log.
    }

    // Create a Set for efficient lookup of shared note IDs
    const sharedNoteIds = new Set(sharedNoteLinks?.map(link => link.original_note_id));

    const notesWithSharedStatus = notes.map(note => {
        // Check if the current note's ID exists in the set of sharedNoteIds
        const isShared = sharedNoteIds.has(note.id);
        return { ...note, is_shared: isShared };
    });
    return NextResponse.json(notesWithSharedStatus, { status: 200 });

} else {
    // If no partner or space, notes cannot be shared, so is_shared is always false
    const notesWithoutSharedStatus = notes.map(note => ({ ...note, is_shared: false }));
    return NextResponse.json(notesWithoutSharedStatus, { status: 200 });
}

  } catch (runtimeError) {
    console.error("Runtime error during notes fetch:", runtimeError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const noteId = searchParams.get('id'); // Get the note ID from URL query params

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!noteId) {
    return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
  }

  try {
    // Delete the note, ensuring it belongs to the authenticated user
    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id); // Crucial for security and RLS

    if (deleteError) {
      console.error("Error deleting note:", deleteError);
      return NextResponse.json({ error: 'Failed to delete note', details: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Note deleted successfully!' }, { status: 200 });

  } catch (runtimeError) {
    console.error("Runtime error during note deletion:", runtimeError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}