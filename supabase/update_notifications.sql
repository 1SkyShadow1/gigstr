-- Add FCM Tokens table for push notifications
create table if not exists public.fcm_tokens (
  user_id uuid references public.profiles(id) on delete cascade not null,
  token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, token)
);

-- Enable RLS
alter table public.fcm_tokens enable row level security;

-- RLS Policies
create policy "Users can manage their own fcm tokens"
on public.fcm_tokens for all
using (auth.uid() = user_id);

-- Function to handle new messages notification trigger (optional but good for realtime)
create or replace function public.handle_new_message() 
returns trigger as $$
begin
  insert into public.notifications (user_id, title, message, type, link)
  values (
    new.receiver_id,
    'New Message',
    substring(new.content from 1 for 50),
    'message',
    '/messages?recipient=' || new.sender_id
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create notification on new message
drop trigger if exists on_new_message on public.messages;
create trigger on_new_message
  after insert on public.messages
  for each row execute procedure public.handle_new_message();
