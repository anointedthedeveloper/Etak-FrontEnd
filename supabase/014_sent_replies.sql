-- Migration 014: sent replies table
create table if not exists public.sent_replies (
  id           uuid primary key default gen_random_uuid(),
  to_email     text not null,
  to_name      text,
  subject      text not null,
  body_text    text not null,
  in_reply_to  text,
  sent_at      timestamptz not null default now()
);

alter table public.sent_replies enable row level security;

create policy "Admins can view sent replies"
  on public.sent_replies for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can insert sent replies"
  on public.sent_replies for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
