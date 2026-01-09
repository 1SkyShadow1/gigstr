-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Scheduler Availability Table
create table if not exists public.scheduler_availability (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    day_of_week text not null, -- 'Monday', 'Tuesday', etc.
    start_time time not null,
    end_time time not null,
    is_enabled boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_day_user unique (user_id, day_of_week, start_time)
);

-- 2. Scheduler Meetings Table
create table if not exists public.scheduler_meetings (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null, -- The host
    client_name text not null,
    client_email text not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    title text default 'Consultation',
    status text default 'scheduled', -- scheduled, cancelled, completed
    meeting_link text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.scheduler_availability enable row level security;
alter table public.scheduler_meetings enable row level security;

-- Availability Policies
drop policy if exists "Users can manage their own availability" on public.scheduler_availability;
create policy "Users can manage their own availability"
    on public.scheduler_availability for all
    using (auth.uid() = user_id);

-- Meetings Policies
drop policy if exists "Users can see their own meetings" on public.scheduler_meetings;
create policy "Users can see their own meetings"
    on public.scheduler_meetings for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert meetings" on public.scheduler_meetings;
create policy "Users can insert meetings"
    on public.scheduler_meetings for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update their own meetings" on public.scheduler_meetings;
create policy "Users can update their own meetings"
    on public.scheduler_meetings for update
    using (auth.uid() = user_id);

-- Everyone (public) can insert meetings (for booking page logic later) 
-- ideally, we'd have a public insert policy if this was a public booking page, 
-- but for now the user is creating the meeting. 
-- If we want clients to book, we'd need a public inert policy where 'user_id' is the target host.
-- For this MVP, let's assume the user logs the meeting or we enable public insert restricted to specific fields.
-- We'll keep it simple: User manages it for now.
