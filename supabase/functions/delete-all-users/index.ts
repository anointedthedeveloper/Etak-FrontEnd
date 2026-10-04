import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  // Only callable with the webhook secret
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== Deno.env.get('INBOX_WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // 1. Get all users from auth
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers()
  if (listErr) return new Response(listErr.message, { status: 500 })

  const results: string[] = []

  // 2. Email each user before deleting
  for (const user of users) {
    const email = user.email
    if (!email) continue

    const name = user.user_metadata?.first_name ?? email.split('@')[0]

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Etak Travels</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#101B46 0%,#087EAF 100%);padding:28px 32px;text-align:center;">
            <img src="https://etaktravels.com/brand/logo.png" alt="Etak Travels" width="56" height="56"
              style="border-radius:50%;border:3px solid rgba(255,255,255,0.2);margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" />
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Etak Travels</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">Your trusted travel partner</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;color:#172033;font-size:15px;font-weight:600;">Hi ${name},</p>
            <p style="margin:0 0 12px;color:#172033;font-size:15px;line-height:1.6;">
              We're excited to announce that <strong>Etak Travels is officially launching!</strong> 🎉
            </p>
            <p style="margin:0 0 12px;color:#172033;font-size:15px;line-height:1.6;">
              As part of our official launch, we are resetting all accounts on our platform to ensure a clean, secure start for everyone.
            </p>
            <p style="margin:0 0 12px;color:#172033;font-size:15px;line-height:1.6;">
              <strong>Your account has been removed.</strong> Don't worry — you can create a fresh account at any time by visiting our website. All our services are still available to you.
            </p>
            <p style="margin:0 0 24px;color:#172033;font-size:15px;line-height:1.6;">
              We apologise for any inconvenience and look forward to serving you on the new platform.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 0;">
              <tr>
                <td style="background:#101B46;border-radius:8px;padding:12px 24px;">
                  <a href="https://etaktravels.com/signup" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Create New Account</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
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

    const text = `Hi ${name},\n\nEtak Travels is officially launching! As part of our launch, we are resetting all accounts.\n\nYour account has been removed. You can create a fresh account at https://etaktravels.com/signup\n\nWe apologise for any inconvenience.\n\nBest regards,\nEtak Travels Team\ninfo@etaktravels.com`

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Etak Travels <info@etaktravels.com>',
        to: [email],
        subject: '🎉 Etak Travels is Launching — Important Account Notice',
        html,
        text,
      }),
    })

    results.push(`emailed: ${email}`)
  }

  // 3. Delete all users from auth
  for (const user of users) {
    await supabase.auth.admin.deleteUser(user.id)
    results.push(`deleted: ${user.email}`)
  }

  // 4. Reset admin_credentials must_change_password flag to true
  // (so when admin is recreated they must set a new password)
  await supabase.from('admin_credentials').update({ must_change_password: true }).neq('id', '00000000-0000-0000-0000-000000000000')

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
