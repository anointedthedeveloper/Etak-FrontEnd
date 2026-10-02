#!/usr/local/bin/php -q
<?php
$url    = 'https://wotluxawncpqvgrvhdnw.supabase.co/functions/v1/inbound-email';
$secret = 'etak-inbox-2025-super-secret-key';

$stdin = fopen('php://stdin', 'r');
$raw   = stream_get_contents($stdin);
fclose($stdin);

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
