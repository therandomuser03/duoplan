-- Enable Row Level Security
ALTER TABLE planner_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE planner_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT 'yellow'
);

CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE user_pairs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id TEXT NOT NULL REFERENCES users(id),
  user2_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('pair_request', 'pair_accepted', 'new_message', 'new_event')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX planner_items_user_id_idx ON planner_items(user_id);
CREATE INDEX calendar_events_user_id_idx ON calendar_events(user_id);
CREATE INDEX chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX user_pairs_user1_id_idx ON user_pairs(user1_id);
CREATE INDEX user_pairs_user2_id_idx ON user_pairs(user2_id);
CREATE INDEX notifications_user_id_idx ON notifications(user_id);

-- Create RLS policies
CREATE POLICY "Users can view their own and paired planner items"
  ON planner_items FOR SELECT
  USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM user_pairs
      WHERE (user1_id = auth.uid()::text OR user2_id = auth.uid()::text)
      AND status = 'accepted'
      AND (user1_id = user_id OR user2_id = user_id)
    )
  );

CREATE POLICY "Users can insert their own planner items"
  ON planner_items FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own planner items"
  ON planner_items FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own planner items"
  ON planner_items FOR DELETE
  USING (auth.uid()::text = user_id);

-- Similar policies for calendar_events
CREATE POLICY "Users can view their own and paired calendar events"
  ON calendar_events FOR SELECT
  USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM user_pairs
      WHERE (user1_id = auth.uid()::text OR user2_id = auth.uid()::text)
      AND status = 'accepted'
      AND (user1_id = user_id OR user2_id = user_id)
    )
  );

CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own calendar events"
  ON calendar_events FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events FOR DELETE
  USING (auth.uid()::text = user_id);

-- Policies for users table
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own user record"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own user record"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- Policies for user_pairs
CREATE POLICY "Users can view their own pairs"
  ON user_pairs FOR SELECT
  USING (user1_id = auth.uid()::text OR user2_id = auth.uid()::text);

CREATE POLICY "Users can create pair requests"
  ON user_pairs FOR INSERT
  WITH CHECK (user1_id = auth.uid()::text);

CREATE POLICY "Users can update their own pair requests"
  ON user_pairs FOR UPDATE
  USING (user2_id = auth.uid()::text);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own notifications"
  ON notifications FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid()::text);

-- Policies for chat messages
CREATE POLICY "Users can view messages from their pairs"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_pairs
      WHERE (user1_id = auth.uid()::text OR user2_id = auth.uid()::text)
      AND status = 'accepted'
      AND (user1_id = user_id OR user2_id = user_id)
    )
  );

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid()::text = user_id); 