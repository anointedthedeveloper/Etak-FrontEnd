// Receives mail for info@etaktravels.com and stores it in public.inbox_messages.
//
// Point any inbound-email provider at this function's URL (Cloudflare Email
// Worker, Postmark/Resend/SendGrid inbound webhook, ImprovMX webhook, ...).
// Authenticate with the shared secret: header `x-inbox-secret: <INBOX_WEBHOOK_SECRET>`
// (or ?secret=... for providers that cannot set headers).
//
// Accepts either:
//   * a raw email (Content-Type: message/rfc822 or text/plain) — used by the
//     cPanel pipe script in supabase/cpanel/mail-to-inbox.php; parsed here, or
//   * JSON (common field names from the providers above are mapped):
//       { from, from_name?, to?, subject?, text?, html?, message_id? }
//
// Deploy:
//   supabase secrets set INBOX_WEBHOOK_SECRET=<long random string>
//   supabase functions deploy inbound-email --no-verify-jwt
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import PostalMime from 'npm:postal-mime@2.4.3'

function pick(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

// "Jane Doe <jane@x.com>" -> { name, email }
function parseAddress(raw: string) {
  const m = raw.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/)
  return m ? { name: m[1].trim(), email: m[2].trim() } : { name: '', email: raw.trim() }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const secret = Deno.env.get('INBOX_WEBHOOK_SECRET')
  const given = req.headers.get('x-inbox-secret') ?? new URL(req.url).searchParams.get('secret')
  if (!secret || given !== secret) return new Response('Unauthorized', { status: 401 })

  let body: Record<string, unknown>
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try { body = await req.json() } catch { return new Response('Invalid JSON', { status: 400 }) }
  } else {
    // Raw RFC 822 message
    try {
      const mail = await PostalMime.parse(await req.arrayBuffer())
      body = {
        from: mail.from?.address ? `${mail.from.name ?? ''} <${mail.from.address}>` : '',
        to: mail.to?.[0]?.address ?? '',
        subject: mail.subject ?? '',
        text: mail.text ?? '',
        html: mail.html ?? '',
        message_id: mail.messageId ?? '',
      }
    } catch { return new Response('Could not parse email', { status: 400 }) }
  }

  const from = parseAddress(pick(body, 'from', 'From', 'sender', 'FromFull'))
  if (!from.email) return new Response('Missing sender', { status: 400 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { error } = await supabase.from('inbox_messages').upsert({
    from_name:  pick(body, 'from_name', 'FromName') || from.name || null,
    from_email: from.email,
    to_email:   pick(body, 'to', 'To', 'recipient') || 'info@etaktravels.com',
    subject:    pick(body, 'subject', 'Subject') || '(no subject)',
    body_text:  pick(body, 'text', 'TextBody', 'body', 'plain') || null,
    body_html:  pick(body, 'html', 'HtmlBody') || null,
    message_id: pick(body, 'message_id', 'MessageID', 'messageId') || null,
  }, { onConflict: 'message_id', ignoreDuplicates: true })

  if (error) return new Response(error.message, { status: 500 })
  return new Response('ok')
})
