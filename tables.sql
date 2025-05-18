-- Database Schema Creation for Notes App
-- This SQL script creates all tables with proper relationships

-- 1. Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    encrypted_password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create spaces table (for collaborative spaces)
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_a_email TEXT NOT NULL,
    user_b_email TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Enforce uniqueness of space between two users
    UNIQUE(user_a_id, user_b_id)
);

-- 3. Create notes table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    time_created TIMESTAMPTZ DEFAULT NOW(),
    place TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    color_class TEXT DEFAULT 'bg-gray-200',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create shared_plans table
CREATE TABLE shared_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    space_id UUID REFERENCES spaces(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT,
    time_created TIMESTAMPTZ DEFAULT NOW(),
    place TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    color_class TEXT DEFAULT 'bg-gray-200',
    shared_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_shared_plans_from_user_id ON shared_plans(from_user_id);
CREATE INDEX idx_shared_plans_to_user_id ON shared_plans(to_user_id);
CREATE INDEX idx_shared_plans_space_id ON shared_plans(space_id);
CREATE INDEX idx_spaces_user_a_id ON spaces(user_a_id);
CREATE INDEX idx_spaces_user_b_id ON spaces(user_b_id);

-- Row Level Security (RLS) policies for enhanced security

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_plans ENABLE ROW LEVEL SECURITY;

-- RLS policy for users - users can only see their own profile
CREATE POLICY users_policy ON users
    USING (id = auth.uid());

-- RLS policy for spaces - users can see spaces where they are either user_a or user_b
CREATE POLICY spaces_policy ON spaces
    USING (user_a_id = auth.uid() OR user_b_id = auth.uid());

-- RLS policy for notes - users can only see their own notes
CREATE POLICY notes_policy ON notes
    USING (user_id = auth.uid());

-- RLS policy for shared_plans - users can see plans they've shared or that were shared with them
CREATE POLICY shared_plans_policy ON shared_plans
    USING (from_user_id = auth.uid() OR to_user_id = auth.uid());