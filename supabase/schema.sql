-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text unique,
  first_name text,
  last_name text,
  avatar_url text,
  bio text,
  skills text[], -- Array of strings
  rating numeric default 0,
  jobs_completed integer default 0,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GIGS (Marketplace)
create table public.gigs (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) not null,
  title text not null,
  description text not null,
  category text not null,
  location text,
  price numeric not null,
  status text default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  worker_id uuid references public.profiles(id), -- Assigned worker
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- APPLICATIONS (Gig Proposals)
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete cascade not null,
  worker_id uuid references public.profiles(id) not null,
  proposal text not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MESSAGES (Chat)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  read boolean default false,
  attachment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  message text not null,
  type text not null, -- 'system', 'gig', 'message', 'payment'
  link text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TOOLS: CONTRACTS
create table public.contracts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null, -- Owner of the document
  title text not null,
  client_name text not null,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  terms text,
  status text default 'draft' check (status in ('draft', 'active', 'completed', 'terminated')),
  file_path text, -- PDF copy
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TOOLS: PROJECTS
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  description text,
  status text default 'active' check (status in ('active', 'completed', 'archived')),
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TOOLS: TASKS
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in_progress', 'done')),
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TOOLS: SCHEDULES
create table public.schedules (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  recurrence text, -- 'none', 'daily', 'weekly', 'monthly'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TOOLS: INVOICES
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  invoice_number text not null,
  client_name text not null,
  client_email text,
  amount numeric not null,
  status text default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),
  due_date timestamp with time zone not null,
  issued_date timestamp with time zone default timezone('utc'::text, now()) not null,
  items jsonb, -- Array of line items
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TOOLS: TIME ENTRIES
create table public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  project text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration integer, -- in seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRUSTLOCK: Verifications
create table public.trustlock_verifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  document_type text not null, -- 'id', 'address', 'cert'
  file_path text not null,
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  reviewed_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRUSTLOCK: Disputes
create table public.trustlock_disputes (
  id uuid default uuid_generate_v4() primary key,
  contract_id uuid references public.contracts(id), 
  -- note: linking to personal contracts for now, in a real app might link to gigs
  status text default 'open' check (status in ('open', 'resolving', 'resolved', 'closed')),
  resolution_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRUSTLOCK: Dispute Messages
create table public.trustlock_dispute_messages (
  id uuid default uuid_generate_v4() primary key,
  dispute_id uuid references public.trustlock_disputes(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  message text not null,
  attachment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table gigs enable row level security;
alter table applications enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table contracts enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table schedules enable row level security;
alter table invoices enable row level security;
alter table time_entries enable row level security;
alter table trustlock_verifications enable row level security;
alter table trustlock_disputes enable row level security;
alter table trustlock_dispute_messages enable row level security;

-- POLICIES

-- Profiles: Public can view basic info, Owner can update
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Gigs: Everyone can view, Authenticated users can create
create policy "Gigs are viewable by everyone" on gigs for select using (true);
create policy "Users can create gigs" on gigs for insert with check (auth.uid() = client_id);
create policy "Clients can update their own gigs" on gigs for update using (auth.uid() = client_id);

-- Applications: Client sees applications for their gig, Worker sees their own
create policy "View applications" on applications for select using (
  auth.uid() = worker_id or 
  auth.uid() in (select client_id from gigs where id = gig_id)
);
create policy "Workers can apply" on applications for insert with check (auth.uid() = worker_id);
create policy "Workers/Clients can update applications" on applications for update using (
  auth.uid() = worker_id or 
  auth.uid() in (select client_id from gigs where id = gig_id)
);

-- Messages: Participants can see/send
create policy "View messages" on messages for select using (
  auth.uid() = sender_id or auth.uid() = receiver_id
);
create policy "Send messages" on messages for insert with check (
  auth.uid() = sender_id
);

-- Notifications: User sees own
create policy "View own notifications" on notifications for select using (auth.uid() = user_id);

-- Tools: User sees/edits own data
-- Contracts
create policy "Manage own contracts" on contracts for all using (auth.uid() = user_id);
-- Projects
create policy "Manage own projects" on projects for all using (auth.uid() = user_id);
-- Tasks (via project owner)
create policy "Manage tasks for own projects" on tasks for all using (
  project_id in (select id from projects where user_id = auth.uid())
);
-- Schedules
create policy "Manage own schedules" on schedules for all using (auth.uid() = user_id);
-- Invoices
create policy "Manage own invoices" on invoices for all using (auth.uid() = user_id);
-- Time Entries
create policy "Manage own time entries" on time_entries for all using (auth.uid() = user_id);

-- TrustLock
create policy "Users view own verifications" on trustlock_verifications for select using (auth.uid() = user_id);
create policy "Users create verifications" on trustlock_verifications for insert with check (auth.uid() = user_id);

-- User trigger setup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, first_name, last_name, bio)
  values (new.id, new.email, '', '', '');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TOOLS: TAX VAULT (EXPENSES)
create table public.expenses (
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

-- Enable RLS for expenses
alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- TOOLS: FOCUS TIMER (TIME ENTRIES)
create table public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration integer, -- in seconds
  project_id uuid, -- Optional link to projects
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for time_entries
alter table public.time_entries enable row level security;

create policy "Users can view their own time entries"
  on public.time_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own time entries"
  on public.time_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own time entries"
  on public.time_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own time entries"
  on public.time_entries for delete
  using (auth.uid() = user_id);

-- TOOLS: SHOWCASE (PORTFOLIO)
create table public.portfolio_items (
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

-- Enable RLS for portfolio_items
alter table public.portfolio_items enable row level security;

create policy "Users can view all portfolio items"
  on public.portfolio_items for select
  using (true); -- Publicly viewable potentially

create policy "Users can insert their own portfolio items"
  on public.portfolio_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own portfolio items"
  on public.portfolio_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own portfolio items"
  on public.portfolio_items for delete
  using (auth.uid() = user_id);
