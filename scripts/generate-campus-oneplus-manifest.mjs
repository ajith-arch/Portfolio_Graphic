/**
 * Regenerate assets/campus-store-oneplus/manifest.json
 * Add image filenames to each section's `items` array, or drop files in section subfolders.
 *
 *   node scripts/generate-campus-oneplus-manifest.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'assets', 'campus-store-oneplus');
const mediaRe = /\.(webp|png|jpe?g|gif|webm|mp4|avif)$/i;

const SECTIONS = [
  { id: 'product-branding', title: 'Product Branding', dir: 'product-branding' },
  { id: 'packaging-design', title: 'Packaging Design', dir: 'packaging-design' },
  { id: 'campus-merchandising', title: 'Campus Store Merchandising', dir: 'campus-merchandising' },
  { id: 'pdp-visual-design', title: 'PDP Visual Design', dir: 'pdp-visual-design' },
  { id: 'promotional-graphics', title: 'Promotional Graphics', dir: 'promotional-graphics' },
  { id: 'wearables-storytelling', title: 'Wearables Storytelling', dir: 'wearables-storytelling' },
];

function listMedia(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => mediaRe.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => ({ file: `${path.basename(dir)}/${file}`.replace(/^campus-store-oneplus\//, '') }));
}

const sections = SECTIONS.map(({ id, title, dir }) => {
  const sub = path.join(root, dir);
  const items = listMedia(sub).map(({ file }) => ({ file: `${dir}/${path.basename(file)}` }));
  return { id, title, items };
});

const manifest = {
  version: 1,
  base: '../assets/campus-store-oneplus/',
  generated: new Date().toISOString(),
  sections,
};

fs.mkdirSync(root, { recursive: true });
fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Wrote', path.join(root, 'manifest.json'));
