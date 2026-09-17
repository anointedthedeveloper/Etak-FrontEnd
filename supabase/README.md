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
