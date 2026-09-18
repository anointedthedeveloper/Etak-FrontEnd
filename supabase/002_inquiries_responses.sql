-- =============================================
-- Etak Travels — Migration 002
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Add `details` column to inquiries (stores structured flight/hotel/tour data)
alter table public.inquiries
  add column if not exists details jsonb default null;

-- 2. INQUIRY RESPONSES TABLE
create table if not exists public.inquiry_responses (
  id           uuid primary key default gen_random_uuid(),
  inquiry_id   uuid not null references public.inquiries(id) on delete cascade,
  message      text not null,
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.inquiry_responses enable row level security;

-- Users can read responses on their own inquiries
create policy "Users can view responses to own inquiries"
  on public.inquiry_responses for select
  using (
    exists (
      select 1 from public.inquiries
      where inquiries.id = inquiry_id
        and inquiries.user_id = auth.uid()
    )
  );

-- Admins can do everything
create policy "Admins can insert responses"
  on public.inquiry_responses for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can view all responses"
  on public.inquiry_responses for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-update inquiries.updated_at when a response is added
create or replace function public.touch_inquiry_on_response()
returns trigger as $$
begin
  update public.inquiries set updated_at = now() where id = new.inquiry_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger inquiry_responses_touch_inquiry
  after insert on public.inquiry_responses
  for each row execute procedure public.touch_inquiry_on_response();
