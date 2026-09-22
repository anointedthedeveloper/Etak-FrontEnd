-- =============================================
-- Etak Travels — Migration 012: Allow clients to reply to their own inquiries
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- Allow authenticated users to insert responses on their own inquiries
drop policy if exists "Users can insert responses to own inquiries" on public.inquiry_responses;

create policy "Users can insert responses to own inquiries"
  on public.inquiry_responses for insert
  to authenticated
  with check (
    exists (
      select 1 from public.inquiries
      where inquiries.id = inquiry_id
        and inquiries.user_id = auth.uid()
    )
  );

-- Ensure grant is in place
grant insert on public.inquiry_responses to authenticated;
