/**
 * generate-favicon.mjs
 * Creates a minimal valid favicon.ico (16x16 blue square) in public/
 * Modern browsers use the SVG; this .ico is for IE, OS bookmarks, etc.
 *
 * Run: node scripts/generate-favicon.mjs
 */
import fs   from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT  = path.join(ROOT, 'public', 'favicon.ico')

// ── Build a 16×16 PNG in memory ──────────────────────────────────────────
const W = 32, H = 32
const R = 8   // border radius (unused in raw PNG, but we draw a rounded square)

// Brand blue #08A9E0 → RGB 8, 169, 224
function buildPNG(w, h) {
  // RGBA pixel data: brand-blue background, white "E" letter
  const pixels = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      // Simple "E" shape (pixel art)
      const cx = Math.floor(x / (w / 16))
      const cy = Math.floor(y / (h / 16))
      const isE = (
        (cx === 2 && cy >= 2 && cy <= 13) ||          // vertical bar
        (cy === 2  && cx >= 2 && cx <= 9) ||           // top
        (cy === 7  && cx >= 2 && cx <= 8) ||           // middle
        (cy === 13 && cx >= 2 && cx <= 9)              // bottom
      )
      pixels[i]   = isE ? 255 : 8    // R
      pixels[i+1] = isE ? 255 : 169  // G
      pixels[i+2] = isE ? 255 : 224  // B
      pixels[i+3] = 255              // A
    }
  }

  // Build PNG chunks
  function crc32(buf, start = 0, end = buf.length) {
    const table = (() => {
      const t = new Uint32Array(256)
      for (let i = 0; i < 256; i++) {
        let c = i
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
        t[i] = c
      }
      return t
    })()
    let crc = 0xFFFFFFFF
    for (let i = start; i < end; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
    return (crc ^ 0xFFFFFFFF) >>> 0
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii')
    const len  = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const crcBuf = Buffer.concat([typeBytes, data])
    const crcVal = Buffer.alloc(4); crcVal.writeUInt32BE(crc32(crcBuf))
    return Buffer.concat([len, typeBytes, data, crcVal])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr.writeUInt8(8, 8)   // bit depth
  ihdr.writeUInt8(2, 9)   // color type: RGB (no alpha for simplicity)
  ihdr.writeUInt8(0, 10); ihdr.writeUInt8(0, 11); ihdr.writeUInt8(0, 12)

  // IDAT — raw pixel rows (filter byte 0 + RGB data)
  const raw = Buffer.alloc(h * (1 + w * 3))
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 3)] = 0 // filter none
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4
      const di = y * (1 + w * 3) + 1 + x * 3
      raw[di]   = pixels[si]
      raw[di+1] = pixels[si+1]
      raw[di+2] = pixels[si+2]
    }
  }
  const idat = zlib.deflateSync(raw)

  return Buffer.concat([
    Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]), // PNG sig
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const png = buildPNG(W, H)

// ── Wrap in ICO container ─────────────────────────────────────────────────
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)  // ICO
header.writeUInt16LE(1, 4)  // 1 image

const dir = Buffer.alloc(16)
dir.writeUInt8(W > 255 ? 0 : W, 0)
dir.writeUInt8(H > 255 ? 0 : H, 1)
dir.writeUInt8(0, 2)
dir.writeUInt8(0, 3)
dir.writeUInt16LE(1, 4)
dir.writeUInt16LE(32, 6)
dir.writeUInt32LE(png.length, 8)
dir.writeUInt32LE(22, 12)  // 6 + 16

fs.writeFileSync(OUT, Buffer.concat([header, dir, png]))
console.log(`✅  favicon.ico written (${(png.length / 1024).toFixed(1)} KB PNG inside ICO)`)
