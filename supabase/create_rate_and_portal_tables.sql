-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- RATE ARCHITECT TABLES
create table if not exists public.rate_calculations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    name text default 'My Rate',
    target_annual_income numeric not null,
    billable_hours_per_week numeric not null,
    weeks_off numeric default 4,
    monthly_expenses numeric default 0,
    tax_rate numeric default 25,
    calculated_hourly_rate numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TEAM BRIDGE (CLIENT PORTAL) TABLES
create table if not exists public.client_portals (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null, -- The freelancer
    client_name text not null,
    client_email text not null,
    project_name text not null,
    portal_password text, -- Optional simple password/access code
    status text default 'active', -- active, archived
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.portal_files (
    id uuid default uuid_generate_v4() primary key,
    portal_id uuid references public.client_portals on delete cascade not null,
    name text not null,
    file_url text not null,
    file_type text,
    uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.portal_comments (
    id uuid default uuid_generate_v4() primary key,
    portal_id uuid references public.client_portals on delete cascade not null,
    author_name text not null, -- Could be 'Freelancer' or client name
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- POLICIES

-- Rate Architect Policies
alter table public.rate_calculations enable row level security;

drop policy if exists "Users can manage their own rate calculations" on public.rate_calculations;
create policy "Users can manage their own rate calculations"
    on public.rate_calculations for all
    using (auth.uid() = user_id);

-- Team Bridge Policies
alter table public.client_portals enable row level security;
alter table public.portal_files enable row level security;
alter table public.portal_comments enable row level security;

-- Portals: Freelancer has full access
drop policy if exists "Freelancers manage their portals" on public.client_portals;
create policy "Freelancers manage their portals"
    on public.client_portals for all
    using (auth.uid() = user_id);

-- Files: Freelancer has full access
drop policy if exists "Freelancers manage their portal files" on public.portal_files;
create policy "Freelancers manage their portal files"
    on public.portal_files for all
    using (
        exists (
            select 1 from public.client_portals
            where client_portals.id = portal_files.portal_id
            and client_portals.user_id = auth.uid()
        )
    );

-- Comments: Freelancer has full access
drop policy if exists "Freelancers manage their portal comments" on public.portal_comments;
create policy "Freelancers manage their portal comments"
    on public.portal_comments for all
    using (
        exists (
            select 1 from public.client_portals
            where client_portals.id = portal_comments.portal_id
            and client_portals.user_id = auth.uid()
        )
    );

-- NOTE: For clients to access the portal, we would need a public policy that checks the 'portal_password' or 'access_code' via a function or just standard RLS if we used anonymous auth.
-- For this MVP, we will assume the freelancer is using the dashboard. Client view would be a public page consuming these tables (requires 'select' policy for public with some filter).
-- Adding public read access for simplified "Share Link" functionality:
drop policy if exists "Public read access to portals" on public.client_portals;
create policy "Public read access to portals"
    on public.client_portals for select
    to anon
    using (true); -- In prod, checking a token in the URL would be better.

drop policy if exists "Public read access to files" on public.portal_files;
create policy "Public read access to files"
    on public.portal_files for select
    to anon
    using (true);

drop policy if exists "Public read access to comments" on public.portal_comments;
create policy "Public read access to comments"
    on public.portal_comments for select
    to anon
    using (true);
