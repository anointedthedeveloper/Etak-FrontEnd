/**
 * Downloads airline partner logos from Wikimedia Commons into public/partners/
 * Run: node scripts/download-partner-logos.mjs
 *
 * Each SVG is fetched from Wikimedia and saved as-is (SVGs render
 * perfectly in <img> tags without needing conversion).
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dest = path.resolve(__dirname, '../public/partners')

if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

const logos = [
  { name: 'airfrance',     url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Air_France_Logo.svg' },
  { name: 'qatar',         url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Qatar_Airways_logo.svg' },
  { name: 'lufthansa',     url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Lufthansa_Logo_2018_crane.svg' },
  { name: 'royalairmaroc', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Logo_Royal_Air_Maroc.svg' },
  { name: 'virgin',        url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Virgin_Atlantic_logo.svg' },
  { name: 'saudia',        url: 'https://upload.wikimedia.org/wikipedia/en/4/48/Logo_of_Saudia.svg' },
  { name: 'airindia',      url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Air_India_2023.svg' },
  { name: 'emirates',      url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Emirates_banner_logo.svg' },
  { name: 'saa',           url: 'https://upload.wikimedia.org/wikipedia/en/7/7c/SAA_logo_%282019%29.svg' },
  { name: 'afriqiyah',     url: 'https://upload.wikimedia.org/wikipedia/en/1/1a/Afriqiyah_Airways_logo.svg' },
  { name: 'arik',          url: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Arik_Air_logo.svg' },
  { name: 'delta',         url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Delta_logo.svg' },
  { name: 'egyptair',      url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Egyptair-Logo-2010.svg' },
  { name: 'ethiopian',     url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Ethiopian_Airlines_Logo.svg' },
]

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath)
    const protocol = url.startsWith('https') ? https : http

    function get(url) {
      protocol.get(url, { headers: { 'User-Agent': 'EtakTravels/1.0' } }, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close()
          get(res.headers.location)
          return
        }
        if (res.statusCode !== 200) {
          file.close()
          fs.unlink(filePath, () => {})
          reject(new Error(`HTTP ${res.statusCode} for ${url}`))
          return
        }
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      }).on('error', err => { file.close(); fs.unlink(filePath, () => {}); reject(err) })
    }

    get(url)
  })
}

console.log(`Downloading ${logos.length} logos to ${dest}\n`)

let ok = 0, fail = 0
for (const { name, url } of logos) {
  const ext = url.endsWith('.svg') ? 'svg' : 'png'
  const filePath = path.join(dest, `${name}.${ext}`)
  process.stdout.write(`  ${name}... `)
  try {
    await download(url, filePath)
    const size = fs.statSync(filePath).size
    console.log(`✓ (${(size / 1024).toFixed(1)} KB)`)
    ok++
  } catch (e) {
    console.log(`✗ ${e.message}`)
    fail++
  }
}

console.log(`\nDone: ${ok} downloaded, ${fail} failed`)
