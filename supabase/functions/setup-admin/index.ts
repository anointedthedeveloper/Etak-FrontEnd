import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const secret = req.headers.get('x-webhook-secret')
  if (secret !== Deno.env.get('INBOX_WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const ADMIN_EMAIL = 'admin@etaktravels.com'
  const TEMP_PASSWORD = 'EtakAdmin2026!'

  // 1. Find existing or create admin auth user
  const { data: { users: existing } } = await supabase.auth.admin.listUsers()
  let userId: string
  const found = existing?.find(u => u.email === ADMIN_EMAIL)

  if (found) {
    // Reset password on existing user
    const { error: updateErr } = await supabase.auth.admin.updateUserById(found.id, { password: TEMP_PASSWORD })
    if (updateErr) return new Response(JSON.stringify({ error: updateErr.message }), { status: 500 })
    userId = found.id
  } else {
    const { data: { user }, error: createErr } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: { first_name: 'Admin', last_name: 'Etak' },
    })
    if (createErr) return new Response(JSON.stringify({ error: createErr.message }), { status: 500 })
    userId = user!.id
  }

  // 2. Upsert profile with role = admin
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: userId,
    first_name: 'Admin',
    last_name: 'Etak',
    role: 'admin',
  })

  if (profileErr) return new Response(JSON.stringify({ error: profileErr.message }), { status: 500 })

  // 3. Update admin_credentials to point to new profile
  const { error: credErr } = await supabase
    .from('admin_credentials')
    .update({ profile_id: userId, must_change_password: true })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (credErr) return new Response(JSON.stringify({ error: credErr.message }), { status: 500 })

  return new Response(
    JSON.stringify({ success: true, userId, email: ADMIN_EMAIL, temp_password: TEMP_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
