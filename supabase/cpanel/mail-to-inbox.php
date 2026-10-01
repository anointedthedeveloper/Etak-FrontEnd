#!/usr/bin/php -q
<?php
// cPanel "pipe to a program" script: sends each email received at
// info@etaktravels.com to the Supabase `inbound-email` function so it shows in
// the admin Inbox. See supabase/README.md for setup.
//
// Edit the two values below. Never exits non-zero, so a failed POST can never
// bounce the sender's mail (the mailbox keeps its own copy via the filter's
// second "Deliver to Inbox" action).

$url    = 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/inbound-email';
$secret = 'PASTE_INBOX_WEBHOOK_SECRET_HERE';

$raw = stream_get_contents(STDIN);
if ($raw === false || trim($raw) === '') exit(0);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $raw,
    CURLOPT_HTTPHEADER     => ['Content-Type: message/rfc822', 'x-inbox-secret: ' . $secret],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 20,
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200) {
    error_log('mail-to-inbox: HTTP ' . $code . ' ' . $resp . "\n", 3, __DIR__ . '/mail-to-inbox.log');
}
exit(0);
