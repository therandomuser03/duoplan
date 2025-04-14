-- Create users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  partner_id uuid references public.users(id),
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  is_shared boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.messages enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

create policy "Profiles can view their own and partner's data"
  on public.profiles for select
  using (auth.uid() = id or auth.uid() = partner_id);

create policy "Profiles can update their own data"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Events can be viewed by owner and partner"
  on public.events for select
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where (profiles.id = auth.uid() and profiles.partner_id = events.user_id) or
            (profiles.partner_id = auth.uid() and profiles.id = events.user_id)
    )
  );

create policy "Events can be created by authenticated users"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Events can be updated by owner"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Events can be deleted by owner"
  on public.events for delete
  using (auth.uid() = user_id);

create policy "Messages can be viewed by sender and receiver"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Messages can be created by authenticated users"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Messages can be updated by sender"
  on public.messages for update
  using (auth.uid() = sender_id);

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  insert into public.profiles (id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 