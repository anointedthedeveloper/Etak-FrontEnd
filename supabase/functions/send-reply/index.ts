import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403, headers: corsHeaders })

  const { to, to_name, subject, body, message_id } = await req.json()
  if (!to || !subject || !body) return new Response('Missing fields', { status: 400, headers: corsHeaders })

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
    return new Response(err, { status: 500, headers: corsHeaders })
  }

  await supabase.from('sent_replies').insert({
    to_email: to,
    to_name: to_name ?? null,
    subject,
    body_text: body,
    in_reply_to: message_id ?? null,
  })

  return new Response('ok', { headers: corsHeaders })
})
