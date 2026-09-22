/**
 * zip-dist.mjs
 * Zips the /dist folder into dist.zip after a build.
 * Uses only Node.js built-ins — no extra dependencies needed.
 *
 * Run standalone:  node scripts/zip-dist.mjs
 * Called via npm:  "build": "tsc -b && vite build && node scripts/zip-dist.mjs"
 */

import fs   from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const DIST_DIR  = path.join(ROOT, 'dist')
const OUT_ZIP   = path.join(ROOT, 'dist.zip')

// ── Minimal ZIP writer (no dependencies) ─────────────────────────────────

function dosDate(d) {
  return ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
}
function dosTime(d) {
  return (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2)
}

function writeUint16LE(buf, offset, val) { buf.writeUInt16LE(val, offset) }
function writeUint32LE(buf, offset, val) { buf.writeUInt32LE(val >>> 0, offset) }

function crc32(buf) {
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
      t[i] = c
    }
    return t
  })())
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function buildZip(entries) {
  // entries: [{ name, data }]
  const parts   = []
  const central = []
  let offset    = 0

  for (const { name, data } of entries) {
    const nameBytes  = Buffer.from(name, 'utf8')
    const compressed = zlib.deflateRawSync(data, { level: 6 })
    const crc        = crc32(data)
    const now        = new Date()

    // Local file header
    const lhSize = 30 + nameBytes.length
    const lh     = Buffer.alloc(lhSize)
    writeUint32LE(lh, 0,  0x04034b50)  // signature
    writeUint16LE(lh, 4,  20)           // version needed
    writeUint16LE(lh, 6,  0x0800)       // flags (UTF-8)
    writeUint16LE(lh, 8,  8)            // deflate
    writeUint16LE(lh, 10, dosTime(now))
    writeUint16LE(lh, 12, dosDate(now))
    writeUint32LE(lh, 14, crc)
    writeUint32LE(lh, 18, compressed.length)
    writeUint32LE(lh, 22, data.length)
    writeUint16LE(lh, 26, nameBytes.length)
    writeUint16LE(lh, 28, 0)
    nameBytes.copy(lh, 30)

    // Central directory entry
    const cdSize = 46 + nameBytes.length
    const cd     = Buffer.alloc(cdSize)
    writeUint32LE(cd, 0,  0x02014b50)
    writeUint16LE(cd, 4,  20)
    writeUint16LE(cd, 6,  20)
    writeUint16LE(cd, 8,  0x0800)
    writeUint16LE(cd, 10, 8)
    writeUint16LE(cd, 12, dosTime(now))
    writeUint16LE(cd, 14, dosDate(now))
    writeUint32LE(cd, 16, crc)
    writeUint32LE(cd, 20, compressed.length)
    writeUint32LE(cd, 24, data.length)
    writeUint16LE(cd, 28, nameBytes.length)
    writeUint16LE(cd, 30, 0)
    writeUint16LE(cd, 32, 0)
    writeUint16LE(cd, 34, 0)
    writeUint16LE(cd, 36, 0)
    writeUint32LE(cd, 38, 0)
    writeUint32LE(cd, 42, offset)
    nameBytes.copy(cd, 46)

    parts.push(lh, compressed)
    central.push(cd)
    offset += lhSize + compressed.length
  }

  const centralBuf   = Buffer.concat(central)
  const centralStart = offset

  // End of central directory
  const eocd = Buffer.alloc(22)
  writeUint32LE(eocd, 0,  0x06054b50)
  writeUint16LE(eocd, 4,  0)
  writeUint16LE(eocd, 6,  0)
  writeUint16LE(eocd, 8,  central.length)
  writeUint16LE(eocd, 10, central.length)
  writeUint32LE(eocd, 12, centralBuf.length)
  writeUint32LE(eocd, 16, centralStart)
  writeUint16LE(eocd, 20, 0)

  return Buffer.concat([...parts, centralBuf, eocd])
}

// ── Walk dist folder ──────────────────────────────────────────────────────

function walk(dir, base = '') {
  const entries = []
  for (const name of fs.readdirSync(dir)) {
    const full    = path.join(dir, name)
    const relName = base ? `${base}/${name}` : name
    if (fs.statSync(full).isDirectory()) {
      entries.push(...walk(full, relName))
    } else {
      entries.push({ name: relName, data: fs.readFileSync(full) })
    }
  }
  return entries
}

// ── Main ──────────────────────────────────────────────────────────────────

if (!fs.existsSync(DIST_DIR)) {
  console.error('❌  /dist not found — run the build first.')
  process.exit(1)
}

console.log('Zipping dist...')
const entries = walk(DIST_DIR)
const zip     = buildZip(entries)
fs.writeFileSync(OUT_ZIP, zip)

const kb = (zip.length / 1024).toFixed(1)
console.log(`dist.zip created (${kb} KB, ${entries.length} files)`)
