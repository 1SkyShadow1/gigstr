-- Client Command Center storage
create extension if not exists "uuid-ossp";

create table if not exists public.clients (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    name text not null,
    stage text default 'Discovery' check (stage in ('Discovery', 'Proposal Sent', 'Negotiation', 'Closed Won')),
    value numeric default 0,
    last_contact timestamp with time zone,
    next_step text,
    owner text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists clients_user_id_idx on public.clients(user_id);
create index if not exists clients_stage_idx on public.clients(stage);

alter table public.clients enable row level security;

drop policy if exists "Users manage their clients" on public.clients;
create policy "Users manage their clients"
    on public.clients for all
    using (auth.uid() = user_id);
