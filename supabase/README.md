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
4. Connect your mail — on TrueHost (cPanel) use the pipe script:
   1. Edit `cpanel/mail-to-inbox.php`: set `$url` (`https://<project-ref>.supabase.co/functions/v1/inbound-email`)
      and `$secret` (the `INBOX_WEBHOOK_SECRET` from step 2).
   2. cPanel → File Manager: upload it to your home folder (e.g. `/home/<user>/bin/mail-to-inbox.php`)
      and set permissions to `755`.
   3. cPanel → **Email Filters** → *Manage Filters* for `info@etaktravels.com` → create a filter:
      rule *To* · *contains* · `info@etaktravels.com`, with **two actions**:
      *Pipe to a Program* → `/home/<user>/bin/mail-to-inbox.php`, and
      *Deliver to Folder* → `Inbox` (webmail keeps its own copy, so nothing is lost if the POST fails).
   4. Send a test email to info@etaktravels.com; it should appear in Admin → Inbox within seconds.
      Failures are logged to `mail-to-inbox.log` next to the script.

   If TrueHost does not offer "Pipe to a Program", ask them to enable it, or use a forwarding
   service (Cloudflare Email Routing worker, Postmark/Resend inbound, ImprovMX webhook) that POSTs to the
   same URL with header `x-inbox-secret: <secret>`; JSON fields are listed in `functions/inbound-email/index.ts`.

## Keep Supabase awake
`.github/workflows/keep-supabase-awake.yml` queries the database twice a day so the free
project is never paused for inactivity. Add repo secrets `SUPABASE_URL` and `SUPABASE_ANON_KEY`
(Settings → Secrets and variables → Actions), then run it once from the Actions tab to confirm.
