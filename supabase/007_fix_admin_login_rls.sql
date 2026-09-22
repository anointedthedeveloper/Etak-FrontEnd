-- =============================================
-- Etak Travels — Migration 007: Fix admin_login RLS bypass
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- Drop conflicting policy first
drop policy if exists "Admins only" on public.admin_credentials;

-- Recreate policy
create policy "Admins only"
  on public.admin_credentials for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Recreate the function with row_security bypassed so anon callers can verify credentials
create or replace function public.admin_login(p_username text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public
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

  if v_hash = crypt(p_password, v_hash) then
    return v_profile_id;
  end if;

  return null;
end;
$$;

grant execute on function public.admin_login(text, text) to anon, authenticated;
