// src/types/space.ts
export interface Note {
  id: string;
  user_id: string;
  space_id: string | null; // <-- add this line
  title: string;
  content: string;
  start_time: string | null;
  end_time: string | null;
  color: string | null;
  created_at: string;
}

export interface Space {
  id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: string;
  name?: string;
}

export interface SharedNote {
  id: string;
  from_user_id: string;
  to_user_id: string;
  space_id: string;
  title: string;
  content: string;
  start_time: string | null;
  end_time: string | null;
  color: string | null;
  created_at: string;
  original_note_id: string;
}