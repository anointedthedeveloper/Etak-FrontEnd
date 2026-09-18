-- =============================================
-- Etak Travels — Migration 003: RLS + details column fix
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to run even if tables already exist
-- =============================================

-- Add details column if it doesn't exist yet
alter table public.inquiries
  add column if not exists details jsonb default null;

-- Drop and recreate the insert policy cleanly
-- (fixes 401 Unauthorized on inquiry submission)
drop policy if exists "Anyone can submit inquiry" on public.inquiries;

create policy "Anyone can submit inquiry"
  on public.inquiries for insert
  with check (true);

-- Make sure anon role can also insert (covers unauthenticated users)
grant insert on public.inquiries to anon;
grant insert on public.inquiries to authenticated;
grant select on public.inquiries to authenticated;
grant usage on schema public to anon;
grant usage on schema public to authenticated;
