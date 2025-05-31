// app/api/shared_notes/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

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
  const { noteId, activeSpaceId, partnerId } = body;

  if (!noteId || !activeSpaceId || !partnerId) {
    return NextResponse.json({ error: 'Note ID, activeSpaceId, and partnerId are required' }, { status: 400 });
  }

  try {
    // 1. Fetch the original note details to copy them to shared_notes
    const { data: originalNote, error: fetchNoteError } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', user.id) // Ensure only the owner can share their note
      .single();

    if (fetchNoteError || !originalNote) {
      console.error("Error fetching original note:", fetchNoteError);
      return NextResponse.json({ error: 'Original note not found or unauthorized to share' }, { status: 404 });
    }

    // 2. Insert into shared_notes table
    const { data: sharedNote, error: shareError } = await supabase
      .from('shared_notes')
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
        // You could also store original_note_id if you want to link them
      })
      .select()
      .single();

    if (shareError) {
      console.error("Error sharing note:", shareError);
      return NextResponse.json({ error: 'Failed to share note', details: shareError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Note shared successfully!', sharedNote }, { status: 201 });

  } catch (runtimeError) {
    console.error("Runtime error during note sharing:", runtimeError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}