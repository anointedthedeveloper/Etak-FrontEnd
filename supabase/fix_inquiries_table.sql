-- =============================================
-- FIX: Recreate inquiries table if missing
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- INQUIRIES TABLE
create table if not exists public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete set null,
  name              text not null,
  email             text not null,
  phone             text,
  service           text,
  preferred_contact text,
  travel_dates      text,
  message           text not null,
  details           jsonb default null,
  status            text not null default 'new',
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- Drop old policies to avoid conflicts
drop policy if exists "Anyone can submit inquiry" on public.inquiries;
drop policy if exists "Anyone can read own insert" on public.inquiries;
drop policy if exists "Users can view own inquiries" on public.inquiries;
drop policy if exists "Admins can view all inquiries" on public.inquiries;
drop policy if exists "Admins can update inquiries" on public.inquiries;

-- Recreate policies
create policy "Anyone can submit inquiry"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can read own insert"
  on public.inquiries for select
  to anon, authenticated
  using (true);

create policy "Admins can update inquiries"
  on public.inquiries for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete inquiries"
  on public.inquiries for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Grants
grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant insert, select on public.inquiries to anon;
grant insert, select, update, delete on public.inquiries to authenticated;

-- INQUIRY RESPONSES TABLE
create table if not exists public.inquiry_responses (
  id           uuid primary key default gen_random_uuid(),
  inquiry_id   uuid not null references public.inquiries(id) on delete cascade,
  message      text not null,
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.inquiry_responses enable row level security;

drop policy if exists "Admins can insert responses" on public.inquiry_responses;
drop policy if exists "Admins can view all responses" on public.inquiry_responses;
drop policy if exists "Users can view responses to own inquiries" on public.inquiry_responses;

create policy "Anyone can view responses"
  on public.inquiry_responses for select
  to anon, authenticated
  using (true);

create policy "Admins can insert responses"
  on public.inquiry_responses for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

grant insert, select on public.inquiry_responses to anon;
grant insert, select, update, delete on public.inquiry_responses to authenticated;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists inquiries_updated_at on public.inquiries;
create trigger inquiries_updated_at
  before update on public.inquiries
  for each row execute procedure public.set_updated_at();
