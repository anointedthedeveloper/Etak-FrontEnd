-- =============================================
-- Etak Travels — Migration 009: admin_login returns email for Auth sign-in
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- Return the auth email instead of profile_id so the frontend can call
-- supabase.auth.signInWithPassword after verifying username/password

drop function if exists public.admin_login(text, text);

create or replace function public.admin_login(p_username text, p_password text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_profile_id uuid;
  v_hash text;
  v_email text;
begin
  set local row_security = off;

  select ac.password_hash, ac.profile_id, au.email
  into v_hash, v_profile_id, v_email
  from public.admin_credentials ac
  join auth.users au on au.id = ac.profile_id
  where ac.username = p_username;

  if not found then
    return null;
  end if;

  if v_hash = extensions.crypt(p_password, v_hash) then
    return v_email;
  end if;

  return null;
end;
$$;

grant execute on function public.admin_login(text, text) to anon, authenticated;
