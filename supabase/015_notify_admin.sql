-- Migration 015: Notify admin on new enquiry
-- Run this in Supabase Dashboard → SQL Editor

-- Enable pg_net extension
create extension if not exists pg_net schema extensions;

-- Create the trigger function
create or replace function notify_admin_on_enquiry()
returns trigger language plpgsql security definer as $$
begin
  perform extensions.http_post(
    url := 'https://wotluxawncpqvgrvhdnw.supabase.co/functions/v1/notify-admin',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', 'etak-inbox-2025-super-secret-key'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  return NEW;
end;
$$;

-- Attach trigger to inquiries table
drop trigger if exists on_new_enquiry on inquiries;
create trigger on_new_enquiry
  after insert on inquiries
  for each row execute function notify_admin_on_enquiry();
