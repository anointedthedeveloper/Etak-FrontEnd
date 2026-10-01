-- =============================================
-- Etak Travels — Migration 013: forced admin password reset + inbox
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- ── 1. Force admins to change the password they were given ───────────────────
-- New rows (and existing ones, once) start as "must change".
alter table public.admin_credentials
  add column if not exists must_change_password boolean not null default true;

-- Does the signed-in admin still need to change their password?
create or replace function public.admin_needs_password_change()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select must_change_password from public.admin_credentials where profile_id = auth.uid() limit 1),
    false
  );
$$;

-- Keep admin_credentials (used by username login) in sync with the Auth
-- password, and clear the flag. Must be called while signed in as the admin.
create or replace function public.admin_set_password(p_new_password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if length(p_new_password) < 8 then
    raise exception 'Password must be at least 8 characters';
  end if;

  update public.admin_credentials
  set password_hash = extensions.crypt(p_new_password, extensions.gen_salt('bf')),
      must_change_password = false
  where profile_id = auth.uid();

  if not found then
    raise exception 'Not an admin account';
  end if;
end;
$$;

revoke all on function public.admin_needs_password_change() from public, anon;
revoke all on function public.admin_set_password(text) from public, anon;
grant execute on function public.admin_needs_password_change() to authenticated;
grant execute on function public.admin_set_password(text) to authenticated;

-- ── 2. Inbox for info@etaktravels.com ────────────────────────────────────────
-- Messages are written by the `inbound-email` Edge Function (service role)
-- and read/managed by admins in the admin panel.
create table if not exists public.inbox_messages (
  id           uuid primary key default gen_random_uuid(),
  mailbox      text not null default 'info@etaktravels.com',
  from_name    text,
  from_email   text not null,
  to_email     text,
  subject      text not null default '(no subject)',
  body_text    text,
  body_html    text,
  message_id   text unique,
  is_read      boolean not null default false,
  received_at  timestamptz not null default now()
);

create index if not exists inbox_messages_received_idx on public.inbox_messages (received_at desc);

alter table public.inbox_messages enable row level security;

create policy "Admins can view inbox"
  on public.inbox_messages for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update inbox"
  on public.inbox_messages for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete inbox"
  on public.inbox_messages for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
