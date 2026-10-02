import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Verify caller is an admin
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return new Response('Unauthorized', { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403 })

  const { to, subject, body, message_id } = await req.json()
  if (!to || !subject || !body) return new Response('Missing fields', { status: 400 })

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Etak Travels <info@etaktravels.com>',
      to: [to],
      subject,
      text: body,
      ...(message_id ? { headers: { 'In-Reply-To': message_id, 'References': message_id } } : {}),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return new Response(err, { status: 500 })
  }

  return new Response('ok')
})
