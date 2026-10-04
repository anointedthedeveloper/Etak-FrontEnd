import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function htmlTemplate(toName: string, bodyText: string, unsubUrl: string): string {
  const greeting = toName ? `Hi ${toName.split(' ')[0]},` : 'Hello,'
  const lines = bodyText.split('\n').map(l => l.trim() ? `<p style="margin:0 0 12px 0;color:#172033;font-size:15px;line-height:1.6;">${l}</p>` : '<br>').join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Etak Travels</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#101B46 0%,#087EAF 100%);padding:28px 32px;text-align:center;">
            <img src="https://etaktravels.com/brand/logo.png" alt="Etak Travels" width="56" height="56"
              style="border-radius:50%;border:3px solid rgba(255,255,255,0.2);margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" />
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.3px;">Etak Travels</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">Your trusted travel partner</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 20px 0;color:#172033;font-size:15px;font-weight:600;">${greeting}</p>
            ${lines}
            <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
              <tr>
                <td style="background:#101B46;border-radius:8px;padding:12px 24px;">
                  <a href="https://etaktravels.com" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Visit Our Website</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:0 32px 24px;">
            <table cellpadding="0" cellspacing="0" style="border-top:1px solid #e8edf2;padding-top:20px;width:100%;">
              <tr>
                <td>
                  <p style="margin:0;color:#172033;font-size:14px;font-weight:600;">Best regards,</p>
                  <p style="margin:2px 0 0;color:#08A9E0;font-size:14px;font-weight:700;">Etak Travels Team</p>
                  <p style="margin:4px 0 0;font-size:12px;color:#667085;">
                    <a href="mailto:info@etaktravels.com" style="color:#667085;text-decoration:none;">info@etaktravels.com</a>
                    &nbsp;·&nbsp;
                    <a href="https://etaktravels.com" style="color:#667085;text-decoration:none;">etaktravels.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e8edf2;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 8px;font-size:11px;color:#98A2B3;">
              You received this email because you contacted Etak Travels.<br>
              Etak Travels · Abuja, FCT, Nigeria
            </p>
            <p style="margin:0;font-size:11px;">
              <a href="${unsubUrl}" style="color:#667085;text-decoration:underline;">Unsubscribe</a>
              &nbsp;·&nbsp;
              <a href="https://etaktravels.com/privacy-policy" style="color:#667085;text-decoration:underline;">Privacy Policy</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function plainTemplate(toName: string, bodyText: string, unsubUrl: string): string {
  const greeting = toName ? `Hi ${toName.split(' ')[0]},` : 'Hello,'
  return `${greeting}

${bodyText}

---
Best regards,
Etak Travels Team
info@etaktravels.com
https://etaktravels.com

You received this email because you contacted Etak Travels.
To unsubscribe: ${unsubUrl}`
}

const corsHeaders2 = corsHeaders

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders2 })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders2 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401, headers: corsHeaders2 })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return new Response('Unauthorized', { status: 401, headers: corsHeaders2 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403, headers: corsHeaders2 })

  const { to, to_name, subject, body, message_id } = await req.json()
  if (!to || !subject || !body) return new Response('Missing fields', { status: 400, headers: corsHeaders2 })

  const unsubUrl = `https://etaktravels.com/unsubscribe?email=${encodeURIComponent(to)}`

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
      text: plainTemplate(to_name ?? '', body, unsubUrl),
      html: htmlTemplate(to_name ?? '', body, unsubUrl),
      headers: {
        'List-Unsubscribe': `<${unsubUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Entity-Ref-ID': crypto.randomUUID(),
        ...(message_id ? { 'In-Reply-To': message_id, 'References': message_id } : {}),
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return new Response(err, { status: 500, headers: corsHeaders2 })
  }

  await supabase.from('sent_replies').insert({
    to_email: to,
    to_name: to_name ?? null,
    subject,
    body_text: body,
    in_reply_to: message_id ?? null,
  })

  return new Response('ok', { headers: corsHeaders2 })
})
