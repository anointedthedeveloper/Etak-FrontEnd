-- =============================================
-- Etak Travels — Supabase Initial Schema
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- PROFILES TABLE
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name  text not null default '',
  phone      text not null default '',
  role       text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);


-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- INQUIRIES TABLE
create table public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete set null,
  name              text not null,
  email             text not null,
  phone             text,
  service           text,
  preferred_contact text,
  travel_dates      text,
  message           text not null,
  status            text not null default 'new',
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy "Anyone can submit inquiry"
  on public.inquiries for insert with check (true);

create policy "Users can view own inquiries"
  on public.inquiries for select using (auth.uid() = user_id);

create policy "Admins can view all inquiries"
  on public.inquiries for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update inquiries"
  on public.inquiries for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- AUTO-UPDATE updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger inquiries_updated_at
  before update on public.inquiries
  for each row execute procedure public.set_updated_at();
