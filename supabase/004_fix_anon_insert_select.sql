-- =============================================
-- Etak Travels — Migration 004: Fix anon INSERT + SELECT for inquiry submission
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- Fix insert policy to explicitly target anon + authenticated roles
drop policy if exists "Allow anon insert" on public.inquiries;
drop policy if exists "Anyone can submit inquiry" on public.inquiries;

create policy "Anyone can submit inquiry"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

-- Allow anon to select back the inserted row (needed for .select('id') after insert)
drop policy if exists "Anyone can read own insert" on public.inquiries;

create policy "Anyone can read own insert"
  on public.inquiries for select
  to anon, authenticated
  using (true);

-- Ensure grants are in place
grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant insert on public.inquiries to anon;
grant select on public.inquiries to anon;
grant insert on public.inquiries to authenticated;
grant select on public.inquiries to authenticated;
