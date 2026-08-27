#!/usr/bin/env node
// Optimize used images: generate WebP + AVIF (quality 75-80) + responsive sizes + compress originals
// Usage: node scripts/optimize-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const pub = path.resolve('public');
const srcRoot = path.resolve('src');
const usedFiles = new Set();

// --- Collect used refs from src (broad) ---
function walk(d, exts, out) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, exts, out);
    else if (exts.includes(path.extname(e.name).toLowerCase())) out.push(f);
  }
}
const jsxFiles = [];
walk(srcRoot, ['.jsx', '.js'], jsxFiles);
const re = /['"`]\s*(\/[^'"`\)\s,;\}]+\.(png|jpg|jpeg|webp|svg|gif|avif|bmp))[^'"`]*['"`]/gi;
for (const f of jsxFiles) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(c)) !== null) {
    let v = m[1].split('?')[0].split('#')[0].replace(/%20/g, ' ').trim().toLowerCase();
    usedFiles.add(v);
  }
}
// also include /BSCT paths
const reBSCT = /(\/BSCT[^\s"'`\)]+\.(png|jpg|jpeg|webp|svg|gif|pdf))/gi;
for (const f of jsxFiles) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = reBSCT.exec(c)) !== null) {
    let v = m[1].split('?')[0].replace(/%20/g, ' ').trim().toLowerCase();
    usedFiles.add(v);
  }
}

const pubImages = [];
function walkPub(d, out) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) {
      if (f.includes('optimized') || f.includes('unused') || f.includes('original')) continue;
      walkPub(f, out);
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.bmp'].includes(path.extname(e.name).toLowerCase())) {
      out.push(f);
    }
  }
}
walkPub(path.join(pub, 'images'), pubImages);
// include root and booklet if used
const extraPub = [];
if (fs.existsSync(path.join(pub, 'BSCT Trust Document'))) walkPub(path.join(pub, 'BSCT Trust Document'), extraPub);
if (fs.existsSync(path.join(pub, 'logo11.png'))) extraPub.push(path.join(pub, 'logo11.png'));
if (fs.existsSync(path.join(pub, 'icons.svg'))) extraPub.push(path.join(pub, 'icons.svg'));

const allPubFiles = [...pubImages, ...extraPub];
const toOptimize = allPubFiles.filter(f => {
  const rel = ('/' + path.relative(pub, f).replace(/\\/g, '/')).toLowerCase();
  return usedFiles.has(rel);
});

console.log(`Found ${usedFiles.size} unique refs, ${allPubFiles.length} pub files, optimizing ${toOptimize.length} used images`);

const optimizedDir = path.join(pub, 'images', 'optimized');
const originalDir = path.join(pub, 'images', 'original');
fs.mkdirSync(optimizedDir, { recursive: true });
fs.mkdirSync(originalDir, { recursive: true });

// Responsive sizes for gallery/hero
const SIZES = [480, 768, 1200];

let totalBefore = 0;
let totalWebp = 0;
let totalAvif = 0;
let count = 0;

for (const file of toOptimize) {
  const rel = path.relative(path.join(pub, 'images'), file) || path.relative(pub, file);
  // keep subfolder structure for optimized
  const outSubDir = path.join(optimizedDir, path.dirname(rel));
  fs.mkdirSync(outSubDir, { recursive: true });
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const stat = fs.statSync(file);
  totalBefore += stat.size;

  // backup original if not exists
  const backupPath = path.join(originalDir, rel);
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.copyFileSync(file, backupPath);
  }

  // Skip svg/gif from webp/avif (keep as is, just optimize svg via svgo already)
  if (ext === '.svg' || ext === '.gif') continue;

  try {
    const image = sharp(file);
    const metadata = await image.metadata();

    // Generate WebP (quality 75-80)
    const webpPath = path.join(outSubDir, base + '.webp');
    await sharp(file).webp({ quality: 75, effort: 4 }).toFile(webpPath);
    totalWebp += fs.statSync(webpPath).size;

    // Generate AVIF (quality 50, fallback)
    const avifPath = path.join(outSubDir, base + '.avif');
    await sharp(file).avif({ quality: 50, effort: 4 }).toFile(avifPath);
    totalAvif += fs.statSync(avifPath).size;

    // Responsive srcset for large images (>800px width) - generate 480/768/1200
    if (metadata.width && metadata.width > 800) {
      for (const w of SIZES) {
        if (w >= metadata.width) continue;
        const respWebp = path.join(outSubDir, `${base}-${w}w.webp`);
        const respAvif = path.join(outSubDir, `${base}-${w}w.avif`);
        await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 75 }).toFile(respWebp);
        await sharp(file).resize({ width: w, withoutEnlargement: true }).avif({ quality: 50 }).toFile(respAvif);
      }
    }

    // Compress original in place (mozjpeg/png) if large >500KB - overwrite with compressed jpeg/png at quality 80
    if (stat.size > 500 * 1024 && (ext === '.jpg' || ext === '.jpeg' || ext === '.png')) {
      const tmp = file + '.tmp';
      if (ext === '.png') {
        await sharp(file).png({ quality: 80, compressionLevel: 9, palette: true }).toFile(tmp);
      } else {
        await sharp(file).jpeg({ quality: 75, mozjpeg: true }).toFile(tmp);
      }
      fs.renameSync(tmp, file);
    }

    count++;
    if (count % 20 === 0) console.log(`  ...optimized ${count}/${toOptimize.length}`);
  } catch (e) {
    console.warn(`Failed ${file}: ${e.message}`);
  }
}

console.log(`Done: ${count} images`);
console.log(`  Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
console.log(`  WebP total: ${(totalWebp / 1024 / 1024).toFixed(2)} MB (~${((1 - totalWebp / totalBefore) * 100).toFixed(0)}% saving)`);
console.log(`  AVIF total: ${(totalAvif / 1024 / 1024).toFixed(2)} MB`);
console.log(`Optimized files in ${optimizedDir}`);
console.log(`Original backups in ${originalDir}`);
console.log(`Next: update code to use <OptimizedImage> with <picture> + srcset`);
