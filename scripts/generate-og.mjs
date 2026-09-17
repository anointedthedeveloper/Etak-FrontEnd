/**
 * generate-og.mjs
 * Creates a 1200×630 OG image as SVG in public/brand/og-image.svg
 * and copies it as og-image.jpg placeholder until a real image is provided.
 *
 * Run: node scripts/generate-og.mjs
 */
import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT  = path.join(ROOT, 'public', 'brand', 'og-image.svg')

// Read logo as base64
const logoPath = path.join(ROOT, 'public', 'brand', 'logo.png')
const logoB64  = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
  : ''

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#101B46"/>
      <stop offset="60%"  stop-color="#1a2a6c"/>
      <stop offset="100%" stop-color="#45419A"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#08A9E0"/>
      <stop offset="100%" stop-color="#45419A"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="1050" cy="100" r="300" fill="#08A9E0" fill-opacity="0.07"/>
  <circle cx="150"  cy="530" r="200" fill="#45419A" fill-opacity="0.10"/>

  <!-- Blue accent bar top -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#accent)"/>

  <!-- Logo -->
  ${logoB64 ? `<image href="${logoB64}" x="80" y="80" width="110" height="110"/>` : ''}

  <!-- Brand name -->
  <text x="210" y="125" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="white">Etak Travels</text>
  <text x="210" y="158" font-family="Arial, sans-serif" font-size="16" fill="#93C5FD">&amp; Tours Expert Limited</text>

  <!-- Divider -->
  <rect x="80" y="230" width="60" height="5" rx="2" fill="#08A9E0"/>

  <!-- Headline -->
  <text x="80" y="300" font-family="Georgia, serif" font-size="62" font-weight="bold" fill="white">Your Reliable</text>
  <text x="80" y="375" font-family="Georgia, serif" font-size="62" font-weight="bold" fill="#08A9E0">Travel Bridge</text>
  <text x="80" y="450" font-family="Georgia, serif" font-size="62" font-weight="bold" fill="white">to the World</text>

  <!-- Sub-text -->
  <text x="80" y="510" font-family="Arial, sans-serif" font-size="22" fill="#93C5FD">Flights • Hotels • Tours • Visa • Corporate Travel</text>

  <!-- Domain badge -->
  <rect x="80" y="560" width="260" height="44" rx="22" fill="#08A9E0" fill-opacity="0.25" stroke="#08A9E0" stroke-width="1.5"/>
  <text x="210" y="588" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle">etaktravels.com</text>
</svg>`

fs.writeFileSync(OUT, svg)
console.log(`✅  OG image SVG written to public/brand/og-image.svg`)
console.log(`ℹ️   Rename/copy to og-image.jpg after converting to JPEG for best compatibility.`)
console.log(`    Tool: https://cloudconvert.com/svg-to-jpg  (set 1200×630, quality 85)`)
