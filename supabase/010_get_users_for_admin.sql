-- =============================================
-- Etak Travels — Migration 010: get_users_for_admin RPC
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

create or replace function public.get_users_for_admin()
returns table (
  id uuid,
  first_name text,
  last_name text,
  phone text,
  role text,
  created_at timestamptz,
  email text,
  avatar_url text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  set local row_security = off;

  -- Only callable by admins
  if not exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin') then
    raise exception 'Unauthorized';
  end if;

  return query
  select
    p.id,
    p.first_name,
    p.last_name,
    p.phone,
    p.role,
    p.created_at,
    u.email,
    (u.raw_user_meta_data->>'avatar_url')::text as avatar_url
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.role = 'user'
  order by p.created_at desc;
end;
$$;

grant execute on function public.get_users_for_admin() to authenticated;
