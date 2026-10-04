$body = '{"email":"admin@etaktravels.com","password":"EtakAdmin2026!"}'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$wc = New-Object System.Net.WebClient
$wc.Headers.Add('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdGx1eGF3bmNwcXZncnZoZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTk2NTYsImV4cCI6MjEwNTA3NTY1Nn0.t0SUBnx_gJe_bbxRHp34UBmPOoYGK0upCovzwKpSJcY')
$wc.Headers.Add('Content-Type', 'application/json')
try {
  $result = $wc.UploadData('https://wotluxawncpqvgrvhdnw.supabase.co/auth/v1/token?grant_type=password', 'POST', $bytes)
  [System.Text.Encoding]::UTF8.GetString($result)
} catch [System.Net.WebException] {
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
