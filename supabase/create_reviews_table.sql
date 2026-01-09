-- Reviews for gigs
create extension if not exists "uuid-ossp";

create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    gig_id uuid references public.gigs(id) on delete cascade not null,
    freelancer_id uuid references public.profiles(id) not null,
    client_id uuid references public.profiles(id) not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create unique index if not exists reviews_gig_client_unique on public.reviews (gig_id, client_id);
create index if not exists reviews_freelancer_created_idx on public.reviews (freelancer_id, created_at desc);
create index if not exists reviews_gig_idx on public.reviews (gig_id);

alter table public.reviews enable row level security;

drop policy if exists "Clients insert their reviews" on public.reviews;
create policy "Clients insert their reviews"
    on public.reviews for insert
    with check (auth.uid() = client_id);

drop policy if exists "Freelancers read their reviews" on public.reviews;
create policy "Freelancers read their reviews"
    on public.reviews for select
    using (auth.uid() = freelancer_id or auth.uid() = client_id);
