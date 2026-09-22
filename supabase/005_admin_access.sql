-- =============================================
-- Etak Travels — Migration 005: Admin Access Policies
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- ── PROFILES: admins can read all users ──────────────────────────────────────

drop policy if exists "Admins can view all profiles" on public.profiles;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can update any profile (e.g. promote/demote roles)
drop policy if exists "Admins can update any profile" on public.profiles;

create policy "Admins can update any profile"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── INQUIRIES: already have admin policies, ensure they exist ────────────────

drop policy if exists "Admins can view all inquiries" on public.inquiries;

create policy "Admins can view all inquiries"
  on public.inquiries for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins can update inquiries" on public.inquiries;

create policy "Admins can update inquiries"
  on public.inquiries for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins can delete inquiries" on public.inquiries;

create policy "Admins can delete inquiries"
  on public.inquiries for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── INQUIRY RESPONSES: admins can do everything ──────────────────────────────

drop policy if exists "Admins can view all responses" on public.inquiry_responses;

create policy "Admins can view all responses"
  on public.inquiry_responses for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins can insert responses" on public.inquiry_responses;

create policy "Admins can insert responses"
  on public.inquiry_responses for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins can update responses" on public.inquiry_responses;

create policy "Admins can update responses"
  on public.inquiry_responses for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins can delete responses" on public.inquiry_responses;

create policy "Admins can delete responses"
  on public.inquiry_responses for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── GRANTS ───────────────────────────────────────────────────────────────────

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.inquiries to authenticated;
grant select, insert, update, delete on public.inquiry_responses to authenticated;

-- ── PROMOTE A USER TO ADMIN ──────────────────────────────────────────────────
-- Replace the email below and run this to make someone an admin.
-- You can run this multiple times for different users.

-- update public.profiles
-- set role = 'admin'
-- where id = (
--   select id from auth.users where email = 'your-admin@email.com'
-- );
