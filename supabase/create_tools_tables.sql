-- Fix for existing time_entries table which might have a non-null 'project' column
do $$ 
begin 
    if exists (select 1 from information_schema.columns where table_name = 'time_entries' and column_name = 'project') then
        alter table public.time_entries alter column project drop not null;
    end if;
end $$;

-- 1. TOOLS: TAX VAULT (EXPENSES)
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  amount numeric not null,
  category text not null,
  description text,
  date timestamp with time zone default now(),
  receipt_url text,
  is_deductible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Expenses
alter table public.expenses enable row level security;

drop policy if exists "Users can view their own expenses" on public.expenses;
create policy "Users can view their own expenses" on public.expenses for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own expenses" on public.expenses;
create policy "Users can insert their own expenses" on public.expenses for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own expenses" on public.expenses;
create policy "Users can update their own expenses" on public.expenses for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own expenses" on public.expenses;
create policy "Users can delete their own expenses" on public.expenses for delete using (auth.uid() = user_id);


-- 2. TOOLS: FOCUS TIMER (TIME ENTRIES)
create table if not exists public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration integer, -- in seconds
  project_id uuid, -- Optional link to projects
  project text, -- Ensure this exists if it was in old schema, but nullable
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Time Entries
alter table public.time_entries enable row level security;

drop policy if exists "Users can view their own time entries" on public.time_entries;
create policy "Users can view their own time entries" on public.time_entries for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own time entries" on public.time_entries;
create policy "Users can insert their own time entries" on public.time_entries for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own time entries" on public.time_entries;
create policy "Users can update their own time entries" on public.time_entries for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own time entries" on public.time_entries;
create policy "Users can delete their own time entries" on public.time_entries for delete using (auth.uid() = user_id);


-- 3. TOOLS: SHOWCASE (PORTFOLIO)
create table if not exists public.portfolio_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  image_url text,
  project_url text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Portfolio
alter table public.portfolio_items enable row level security;

drop policy if exists "Users can view all portfolio items" on public.portfolio_items;
create policy "Users can view all portfolio items" on public.portfolio_items for select using (true); 

drop policy if exists "Users can insert their own portfolio items" on public.portfolio_items;
create policy "Users can insert their own portfolio items" on public.portfolio_items for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own portfolio items" on public.portfolio_items;
create policy "Users can update their own portfolio items" on public.portfolio_items for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own portfolio items" on public.portfolio_items;
create policy "Users can delete their own portfolio items" on public.portfolio_items for delete using (auth.uid() = user_id);
