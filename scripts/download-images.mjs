/**
 * download-images.mjs
 * Downloads all Unsplash images used in the app into public/images/
 * then rewrites every source file to use the local path.
 *
 * Run: node scripts/download-images.mjs
 */

import fs   from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const OUT_DIR   = path.join(ROOT, 'public', 'images')

// ── Image map: unsplash URL  →  local filename ────────────────────────────
const IMAGE_MAP = {
  // Page headers
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&auto=format&fit=crop': 'headers/flights.jpg',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1400&auto=format&fit=crop': 'headers/tours.jpg',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&auto=format&fit=crop': 'headers/destinations.jpg',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1400&auto=format&fit=crop': 'headers/contact.jpg',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop': 'headers/about.jpg',
  // Sections
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&auto=format&fit=crop': 'sections/cta-bg.jpg',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop':  'sections/why-travel.jpg',
  'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=600&auto=format&fit=crop&crop=center': 'sections/dash-hero-plane.jpg',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&auto=format&fit=crop':  'sections/dash-cta-travel.jpg',
  // Destinations
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop': 'destinations/dubai.jpg',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop': 'destinations/london.jpg',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&auto=format&fit=crop': 'destinations/istanbul.jpg',
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&auto=format&fit=crop': 'destinations/accra.jpg',
  'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=900&auto=format&fit=crop': 'destinations/johannesburg.jpg',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop': 'destinations/paris.jpg',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&auto=format&fit=crop': 'destinations/new-york.jpg',
  'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=900&auto=format&fit=crop': 'destinations/nairobi.jpg',
  // Tours
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop': 'tours/dubai.jpg',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&auto=format&fit=crop': 'tours/istanbul.jpg',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop': 'tours/london.jpg',
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&auto=format&fit=crop': 'tours/accra.jpg',
  // Services
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop': 'services/flight.jpg',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop': 'services/hotel.jpg',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop': 'services/tours.jpg',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop': 'services/consulting.jpg',
  'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800&auto=format&fit=crop': 'services/visa.jpg',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop': 'services/insurance.jpg',
  'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&auto=format&fit=crop':   'services/airport.jpg',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop': 'services/support.jpg',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop': 'services/holiday.jpg',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop': 'services/corporate.jpg',
}
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1400&auto=format&fit=crop': 'header-tours.jpg',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&auto=format&fit=crop': 'header-destinations.jpg',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1400&auto=format&fit=crop': 'header-contact.jpg',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop': 'header-about.jpg',

  // Dashboard
  'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=600&auto=format&fit=crop&crop=center': 'dash-hero-plane.jpg',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&auto=format&fit=crop':            'dash-cta-travel.jpg',

  // FinalCTA section
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&auto=format&fit=crop': 'cta-bg.jpg',

  // WhyChooseEtak
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop': 'why-travel.jpg',

  // Destinations
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop': 'dest-dubai.jpg',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop': 'dest-london.jpg',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&auto=format&fit=crop': 'dest-istanbul.jpg',
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&auto=format&fit=crop': 'dest-accra.jpg',
  'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=900&auto=format&fit=crop': 'dest-johannesburg.jpg',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop': 'dest-paris.jpg',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&auto=format&fit=crop': 'dest-newyork.jpg',
  'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=900&auto=format&fit=crop': 'dest-nairobi.jpg',

  // Tours
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop': 'tour-dubai.jpg',       // same as dest-dubai, reuse
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&auto=format&fit=crop': 'tour-istanbul.jpg',    // same as dest-istanbul
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop': 'tour-london.jpg',      // same as dest-london
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&auto=format&fit=crop': 'tour-accra.jpg',       // same as dest-accra

  // Services
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop': 'svc-flight.jpg',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop': 'svc-hotel.jpg',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop': 'svc-tours.jpg',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop': 'svc-consulting.jpg',
  'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800&auto=format&fit=crop': 'svc-visa.jpg',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop': 'svc-insurance.jpg',
  'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&auto=format&fit=crop':   'svc-airport.jpg',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop': 'svc-support.jpg',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop': 'svc-holiday.jpg',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop': 'svc-corporate.jpg',
}

// Deduplicate: same URL → same filename (tours reuse destination files)
const UNIQUE = {}
for (const [url, filename] of Object.entries(IMAGE_MAP)) {
  UNIQUE[url] = filename
}

// ── Helpers ───────────────────────────────────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { console.log(`  skip  ${path.basename(dest)} (exists)`); resolve(); return }
    const file = fs.createWriteStream(dest)
    https.get(url, res => {
      // Follow redirect
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        download(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); console.log(`  saved ${path.basename(dest)}`) ; resolve() })
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err) })
  })
}

function replaceInFile(filePath, urlToLocal) {
  if (!fs.existsSync(filePath)) return
  let src = fs.readFileSync(filePath, 'utf8')
  let changed = false
  for (const [url, filename] of Object.entries(urlToLocal)) {
    if (src.includes(url)) {
      src = src.split(url).join(`/images/${filename}`)
      changed = true
    }
  }
  if (changed) { fs.writeFileSync(filePath, src); console.log(`  updated ${path.relative(ROOT, filePath)}`) }
}

// ── Main ──────────────────────────────────────────────────────────────────
;(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  console.log('\n⬇  Downloading images...\n')
  for (const [url, filename] of Object.entries(UNIQUE)) {
    await download(url, path.join(OUT_DIR, filename)).catch(e => console.error(`  FAIL ${filename}: ${e.message}`))
  }

  console.log('\n✏  Updating source files...\n')
  const FILES_TO_UPDATE = [
    'src/data/destinations.ts',
    'src/data/tours.ts',
    'src/data/services.ts',
    'src/pages/About.tsx',
    'src/pages/Contact.tsx',
    'src/pages/Destinations.tsx',
    'src/pages/Services.tsx',
    'src/pages/Tours.tsx',
    'src/pages/Dashboard.tsx',
    'src/components/sections/WhyChooseEtak.tsx',
    'src/components/sections/FinalCTA.tsx',
  ].map(f => path.join(ROOT, f))

  for (const f of FILES_TO_UPDATE) replaceInFile(f, UNIQUE)

  console.log('\n✅  Done! Images are in public/images/\n')
})()
