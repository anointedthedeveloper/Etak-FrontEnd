-- =============================================
-- Etak Travels — Migration 008: Fix crypt schema + null profile_id
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- Fix the function to use extensions.crypt (pgcrypto lives in extensions schema on Supabase)
create or replace function public.admin_login(p_username text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_profile_id uuid;
  v_hash text;
begin
  set local row_security = off;

  select password_hash, profile_id
  into v_hash, v_profile_id
  from public.admin_credentials
  where username = p_username;

  if not found then
    return null;
  end if;

  if v_hash = extensions.crypt(p_password, v_hash) then
    return v_profile_id;
  end if;

  return null;
end;
$$;

grant execute on function public.admin_login(text, text) to anon, authenticated;

-- Fix profile_id being null — re-link to the correct auth user
-- Replace the email below with the one that appears in auth.users
-- update public.admin_credentials
-- set profile_id = (select id from auth.users where email = 'your-actual@email.com')
-- where username = 'etakadmin';
