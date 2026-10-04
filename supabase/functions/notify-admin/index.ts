const ADMIN_EMAIL = 'etaktravels15@gmail.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  // Verify webhook secret
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== Deno.env.get('INBOX_WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { record } = await req.json()
  const { name, email, phone, service, message } = record

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Enquiry</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#101B46 0%,#087EAF 100%);padding:28px 32px;text-align:center;">
            <img src="https://etaktravels.com/brand/logo.png" alt="Etak Travels" width="56" height="56"
              style="border-radius:50%;border:3px solid rgba(255,255,255,0.2);margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" />
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">New Customer Enquiry</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">Etak Travels Admin Notification</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#667085;width:130px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#172033;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#667085;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#172033;"><a href="mailto:${email}" style="color:#08A9E0;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#667085;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#172033;">${phone}</td></tr>` : ''}
              ${service ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#667085;">Service</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#172033;text-transform:capitalize;">${service}</td></tr>` : ''}
              <tr><td style="padding:10px 0;font-size:13px;color:#667085;vertical-align:top;">Message</td><td style="padding:10px 0;font-size:14px;color:#172033;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
              <tr>
                <td style="background:#101B46;border-radius:8px;padding:12px 24px;">
                  <a href="https://etaktravels.com/admin/enquiries" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">View in Admin Panel</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e8edf2;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#98A2B3;">Etak Travels · Abuja, FCT, Nigeria · etaktravels.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `New enquiry from ${name}\n\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${service ? `Service: ${service}\n` : ''}\nMessage:\n${message}\n\nView in admin: https://etaktravels.com/admin/enquiries`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Etak Travels <info@etaktravels.com>',
      to: [ADMIN_EMAIL],
      subject: `New Enquiry from ${name}${service ? ` – ${service}` : ''}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
    return new Response(err, { status: 500 })
  }

  return new Response('ok', { headers: corsHeaders })
})
