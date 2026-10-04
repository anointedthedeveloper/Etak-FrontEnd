-- =============================================
-- Reset admin password to default + force change on next login
-- Run AFTER deleting all users and recreating the admin account
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

-- Step 1: Set must_change_password = true for all admin accounts
-- This forces the password change prompt on next login
UPDATE public.admin_credentials
SET must_change_password = true;

-- Step 2: Check current admin credentials (to confirm)
SELECT username, must_change_password FROM public.admin_credentials;
