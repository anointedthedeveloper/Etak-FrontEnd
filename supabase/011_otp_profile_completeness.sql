-- =============================================
-- Etak Travels — Migration 011: OTP + Profile Completeness
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- ── 1. ENABLE EMAIL OTP IN SUPABASE DASHBOARD ────────────────────────────────
-- SQL cannot enable OTP — do this manually:
-- Supabase Dashboard → Authentication → Providers → Email
--   ✅ Enable Email provider
--   ✅ Enable "Email OTP" (or "Magic Link" — both use signInWithOtp)
--   Set OTP expiry to 600 (10 minutes) or your preference
--   Disable "Confirm email" if you want OTP-only flow
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 2. PROFILE COMPLETENESS FUNCTION ─────────────────────────────────────────
-- Returns true if the user's profile is complete (has name + phone)

create or replace function public.is_profile_complete(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_first text;
  v_last  text;
  v_phone text;
begin
  set local row_security = off;
  select first_name, last_name, phone
  into v_first, v_last, v_phone
  from public.profiles
  where id = p_user_id;

  return (
    v_first is not null and trim(v_first) <> '' and
    v_last  is not null and trim(v_last)  <> '' and
    v_phone is not null and trim(v_phone) <> ''
  );
end;
$$;

grant execute on function public.is_profile_complete(uuid) to authenticated;

-- ── 3. UPDATE PROFILE FUNCTION ────────────────────────────────────────────────
-- Allows users to update their own profile fields including phone

create or replace function public.update_my_profile(
  p_first_name text,
  p_last_name  text,
  p_phone      text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    first_name = p_first_name,
    last_name  = p_last_name,
    phone      = p_phone,
    updated_at = now()
  where id = auth.uid();
end;
$$;

grant execute on function public.update_my_profile(text, text, text) to authenticated;

-- ── 4. ENSURE PROFILES TABLE HAS CORRECT POLICIES ────────────────────────────

-- Users can insert their own profile (needed for new signups)
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can view their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Users can update their own profile
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- ── 5. ENSURE PHONE COLUMN EXISTS ON PROFILES ────────────────────────────────
alter table public.profiles
  alter column phone set default '';

-- ── 6. EMAIL TEMPLATE NOTE ───────────────────────────────────────────────────
-- To customise the OTP email template:
-- Supabase Dashboard → Authentication → Email Templates → Magic Link
-- Change subject to: "Your Etak Travels verification code"
-- Change body to include: {{ .Token }} (this is the 6-digit OTP)
-- Email OTP length is set to 8 digits in your Supabase config.
-- The frontend ForgotPassword page uses maxLength=8 to match.
