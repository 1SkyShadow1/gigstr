-- Create buckets for uploads (idempotent)
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values
  ('messages', 'messages', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values
  ('portal-files', 'portal-files', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values
  ('trustlock-docs', 'trustlock-docs', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values
  ('portfolio', 'portfolio', true)
  on conflict (id) do nothing;

-- Storage policies to scope access per user
-- Avatars
drop policy if exists "Users upload own avatars" on storage.objects;
create policy "Users upload own avatars" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Users manage own avatars" on storage.objects;
create policy "Users manage own avatars" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Read avatars" on storage.objects;
create policy "Read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

-- Messages attachments
drop policy if exists "Users upload message attachments" on storage.objects;
create policy "Users upload message attachments" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'messages' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Users manage message attachments" on storage.objects;
create policy "Users manage message attachments" on storage.objects
  for delete to authenticated
  using (bucket_id = 'messages' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Read message attachments" on storage.objects;
create policy "Read message attachments" on storage.objects
  for select using (bucket_id = 'messages');

-- Portal files (shared)
drop policy if exists "Users upload portal files" on storage.objects;
create policy "Users upload portal files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portal-files' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Users manage portal files" on storage.objects;
create policy "Users manage portal files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portal-files' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Read portal files" on storage.objects;
create policy "Read portal files" on storage.objects
  for select using (bucket_id = 'portal-files');

-- Portfolio images (public)
drop policy if exists "Users upload portfolio" on storage.objects;
create policy "Users upload portfolio" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Users manage portfolio" on storage.objects;
create policy "Users manage portfolio" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Read portfolio" on storage.objects;
create policy "Read portfolio" on storage.objects
  for select using (bucket_id = 'portfolio');

-- TrustLock docs (private)
drop policy if exists "Users upload trustlock docs" on storage.objects;
create policy "Users upload trustlock docs" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'trustlock-docs' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Users manage trustlock docs" on storage.objects;
create policy "Users manage trustlock docs" on storage.objects
  for delete to authenticated
  using (bucket_id = 'trustlock-docs' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "Read trustlock docs" on storage.objects;
create policy "Read trustlock docs" on storage.objects
  for select to authenticated
  using (bucket_id = 'trustlock-docs' and auth.uid()::text = split_part(name, '/', 1));
