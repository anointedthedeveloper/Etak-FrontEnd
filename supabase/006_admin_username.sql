-- =============================================
-- Etak Travels — Migration 006: Admin Username Support
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- Add username column to profiles
alter table public.profiles
  add column if not exists username text unique;

-- Create index for fast username lookups
create index if not exists profiles_username_idx on public.profiles (username);

-- ── ADMIN CREDENTIALS TABLE ──────────────────────────────────────────────────
-- Stores hashed admin credentials for username/password login.
-- This is separate from Supabase Auth (which uses email).

create table if not exists public.admin_credentials (
  id         uuid primary key default gen_random_uuid(),
  username   text not null unique,
  -- Store a bcrypt hash of the password — NEVER store plaintext.
  -- Use: SELECT crypt('your_password', gen_salt('bf')) to generate.
  password_hash text not null,
  profile_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_credentials enable row level security;

-- Only admins can read this table (no one can read password hashes via client)
create policy "Admins only"
  on public.admin_credentials for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── ADMIN LOGIN FUNCTION ──────────────────────────────────────────────────────
-- Called from the frontend via supabase.rpc('admin_login', { username, password })
-- Returns the profile_id if credentials are valid, null otherwise.

create or replace function public.admin_login(p_username text, p_password text)
returns uuid
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
  v_hash text;
begin
  select password_hash, profile_id
  into v_hash, v_profile_id
  from public.admin_credentials
  where username = p_username;

  if not found then
    return null;
  end if;

  -- Verify password using pgcrypto
  if v_hash = crypt(p_password, v_hash) then
    return v_profile_id;
  end if;

  return null;
end;
$$;

-- Grant anon/authenticated to call the login function
grant execute on function public.admin_login(text, text) to anon, authenticated;

-- ── CREATE YOUR ADMIN ACCOUNT ─────────────────────────────────────────────────
-- 1. First make sure the user exists in auth.users and public.profiles.
-- 2. Then run the block below (replace values as needed).
--
-- insert into public.admin_credentials (username, password_hash, profile_id)
-- values (
--   'etakadmin',
--   crypt('YourStrongPassword123!', gen_salt('bf')),
--   (select id from auth.users where email = 'admin@etaktravels.com')
-- );
--
-- Also set their profile role to admin:
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@etaktravels.com');
