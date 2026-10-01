# Supabase Setup

## Project
URL: https://wotluxawncpqvgrvhdnw.supabase.co

## Files
- `001_initial_schema.sql` — profiles + inquiries tables, RLS policies, triggers

## How to run
1. Go to Supabase Dashboard → SQL Editor → New query
2. Paste the contents of the file and click Run

## Make yourself admin
After signing up, find your UUID in Authentication → Users, then run:
```sql
update public.profiles set role = 'admin' where id = 'your-uuid-here';
```

## Auth settings
- Email confirmation: OFF (Authentication → Providers → Email)
- Google OAuth: Authentication → Providers → Google
- Facebook OAuth: Authentication → Providers → Facebook

## Admin password reset (migration 013)
`013_admin_password_and_inbox.sql` adds `admin_credentials.must_change_password`
(default `true`). After signing in at `/adlog`, any admin who still has the
password they were given is sent to `/admin/change-password` and cannot reach
the admin panel until they set a new one. Changing the password (there or in
Admin → Settings) updates both Supabase Auth and `admin_credentials`, so the
username login keeps working with the new password.

For a newly created admin, insert the row as in `006_admin_username.sql`; the
flag defaults to `true`, so they are prompted on first login.

## Inbox for info@etaktravels.com (migration 013 + Edge Function)
The admin panel has an **Inbox** page (`/admin/inbox`) that reads
`public.inbox_messages`. A browser cannot read a mailbox directly, so mail is
pushed in by the `inbound-email` Edge Function:

1. Run `013_admin_password_and_inbox.sql`.
2. `supabase secrets set INBOX_WEBHOOK_SECRET=<long random string>`
3. `supabase functions deploy inbound-email --no-verify-jwt`
4. Configure your mail provider (Cloudflare Email Routing worker, Postmark /
   Resend / SendGrid inbound, ImprovMX webhook, …) to POST incoming mail for
   info@etaktravels.com to
   `https://<project>.supabase.co/functions/v1/inbound-email` with header
   `x-inbox-secret: <secret>` (or `?secret=<secret>`). See the comment at the top
   of `functions/inbound-email/index.ts` for the accepted JSON fields.
