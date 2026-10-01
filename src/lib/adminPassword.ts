import { supabase } from './supabase'

/** Does the signed-in admin still have to replace the password they were given? */
export async function adminNeedsPasswordChange(): Promise<boolean> {
  const { data, error } = await supabase.rpc('admin_needs_password_change')
  if (error) return false
  return data === true
}

/**
 * Change the admin password in both places it lives: Supabase Auth (used for
 * the session) and admin_credentials (used by the username login), and clear
 * the "must change" flag.
 */
export async function changeAdminPassword(newPassword: string): Promise<void> {
  const { error: authErr } = await supabase.auth.updateUser({ password: newPassword })
  if (authErr) throw new Error(authErr.message)
  const { error: rpcErr } = await supabase.rpc('admin_set_password', { p_new_password: newPassword })
  if (rpcErr) throw new Error(rpcErr.message)
}
