-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE
    users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE,
        first_name TEXT,
        last_name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW ()
    );

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can access only their own profile" ON users USING (id = auth.uid ());

CREATE TABLE
    spaces (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_a_id UUID REFERENCES users (id) ON DELETE CASCADE,
        user_b_id UUID REFERENCES users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        UNIQUE (user_a_id, user_b_id)
    );

ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can access their spaces" ON spaces USING (
    user_a_id = auth.uid ()
    OR user_b_id = auth.uid ()
);

CREATE TABLE
    notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT,
        start_time TIMESTAMPTZ,
        end_time TIMESTAMPTZ,
        color TEXT DEFAULT 'gray',
        created_at TIMESTAMPTZ DEFAULT NOW ()
    );

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access only their notes" ON notes USING (user_id = auth.uid ());

CREATE TABLE
    shared_notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        from_user_id UUID REFERENCES users (id),
        to_user_id UUID REFERENCES users (id),
        space_id UUID REFERENCES spaces (id),
        title TEXT NOT NULL,
        content TEXT,
        start_time TIMESTAMPTZ,
        end_time TIMESTAMPTZ,
        color TEXT DEFAULT 'blue',
        created_at TIMESTAMPTZ DEFAULT NOW ()
    );

ALTER TABLE shared_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access shared notes where they are involved" ON shared_notes USING (
    from_user_id = auth.uid ()
    OR to_user_id = auth.uid ()
);