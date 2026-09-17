/**
 * generate-favicon-png.mjs
 * Creates a 512x512 square PNG favicon from the SVG (embeds as-is)
 * and a small 192x192 version — both square, both Google-indexable.
 *
 * Since we can't resize without canvas, we just copy the SVG as PNG
 * by wrapping it in an HTML-friendly way.
 *
 * For a real PNG conversion, upload og-image.svg to:
 *   https://cloudconvert.com/svg-to-png  (512x512)
 * and save as public/brand/favicon-512.png
 *
 * For now this script documents what's needed.
 */
import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SVG  = path.join(ROOT, 'public', 'brand', 'favicon-circle.svg')
const OUT  = path.join(ROOT, 'public', 'brand', 'favicon-512.svg')

// Write a clean 512x512 version of the SVG for Google
const src = fs.readFileSync(SVG, 'utf8')
const sized = src.replace(
  '<svg xmlns="http://www.w3.org/2000/svg"',
  '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"'
)
fs.writeFileSync(OUT, sized)
console.log('✅  favicon-512.svg written to public/brand/')
console.log('')
console.log('Next steps for Google-indexable PNG favicon:')
console.log('  1. Go to: https://cloudconvert.com/svg-to-png')
console.log('  2. Upload: public/brand/favicon-circle.svg')
console.log('  3. Set output size: 512 x 512')
console.log('  4. Save as: public/brand/favicon-512.png')
console.log('  5. Also convert at 192x192 → public/brand/favicon-192.png')
