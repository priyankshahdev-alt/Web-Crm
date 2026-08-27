# Being Sevak - Image Optimization Report

Generated: 2026-08-26 | Scanned: `being/src/**/*.jsx` + `being/public`

## Summary

| Metric | Count |
|--------|-------|
| **Total image files on disk (`public/`)** | **373** (290.85 MB) |
| **Unique `/images/` refs in code** | **229** (248 raw matches) |
| **Used - exists on disk & referenced** | **186** |
| **Unused - exists on disk but never referenced** | **187** ( ~120 MB can be removed) |
| **Missing - referenced in code but not on disk (404)** | **43** (21 are folder-like without extension) |
| **Total `<img>` tags** | 122 |
| **With `loading="lazy"`** | 6 (4.9%) |
| **With `width`/`height`** | 0 (≈0%) |
| **Largest files** | `sanitary.JPG` 22.9MB, `bottle.JPG` 22.3MB, `img3.JPG` 20.3MB, `arogya*.png` 8-13MB |

## Detailed Findings

### 1. All Image References
- 248 raw string matches for `/images/` or `https://` image URLs
- 229 unique `/images/...` strings after deduplication (case-insensitive)
- 21 folder-like refs without extension (e.g. `/images/Aatmnirbhar`, `/images/eco`, `/images/where`) - likely dynamic CMS placeholders, cause 404
- Code also contains 2 external image URLs: `https://matwproject.org.uk/.../zakat...png` (x2) and 4 CDN pay icons (`cdn.jsdelivr.net/gh/simple-icons/...paypal/visa/applepay/googlepay.svg`) - not counted in 373 but add 6 HTTP requests

### 2. Used Images (186 - KEEP & OPTIMIZE)
Files that are both referenced in `src/*.jsx` and exist on disk. Examples:
```
/images/aboutus1.jpeg, /images/aboutus2.jpeg, /images/anndan.jpeg, /images/a1.jpeg, /images/a4.jpeg,
/images/aurat1.jpg, /images/b1.png, /images/beach1.png, /images/g11.webp etc.
```
Full list: `being_used.txt` (186 entries)

### 3. Unused / Dead Images (187 - SAFE TO DELETE/MOVE)
Files on disk never referenced in code. **~50% of disk**. Top wasters:
```
/images/sanitary.jpg (22.97 MB), /images/bottle.jpg (22.32 MB), /images/img3.jpg (20.3 MB),
/images/h6.png (5.33 MB), /images/blooddonation.jpg (5.19 MB), /images/projecth2.png (4.07 MB),
/images/medicalemer.png (4.06 MB), /images/supportedu.png (3.47 MB), /images/i9.png (3.27 MB)
/images/02.png - /images/25.png (numbered duplicates), /images/1.jpg - /images/11.png,
/images/celebritynote/* (4 files), /latesUpdates/* (4 files), /BSCT Trust Document/booklet/*.png (10)
/images/aatmnirbhar 1.png, /images/annapurna 2.png, /images/eco main..jpg etc.
```
Full list: `being_unused.txt` (187 entries) - includes many duplicates/old awards photos.
> **Note:** If CMS (`organization.settings`, `content()`) loads images dynamically from DB not hardcoded, treat this as "code-unused" not "site-unused". Verify in production before permanent delete; move to `/images/unused/` first.

### 4. Missing / Broken References (43 - FIX 404s)
Referenced in code but file not found on disk (will 404 on live site):
```
/images/Aatmnirbhar, /images/ACHIEVEMENT, /images/annapurna, /images/Aurat, /images/BORIVALI,
/images/kit, /images/mahatma, /images/popular, /images/tree etc. (21 folder-like)
/images/babycare.png (exists as babycare.jpg), /images/beach2.jpg (exists as beach2.jpeg),
/images/g31.png (exists as g31.webp), /images/g58.png, /images/host.png etc.
```
Full list: `being_missing.txt` (43 entries). Need to fix paths or add files.

### 5. Performance Issues
- **122 `<img>` tags**, only 6 use `loading="lazy"` → all images load eagerly
- **No `width`/`height`** → Cumulative Layout Shift (CLS)
- **No `srcset` / responsive** → mobile loads same 22MB file
- **No modern format** → serving `.jpg/.png` instead of `.webp` (~30% saving) + `.avif` (~50% saving)
- **No compression** → 290 MB total, largest 5 files = 75 MB (25%)
- **No vite imagemin** → `vite.config.js` has only `react()` + `tailwindcss()`

## Recommended Optimization Plan

### A. Folder Structure
```
public/
  images/
    original/   # backup of source (not served, gitignore)
    optimized/  # webp + avif outputs, served
      hero/       # above-fold, eager, high priority
      gallery/    # lazy, srcset 480/768/1200
      logos/      # svg/webp, small
      content/    # other
    unused/     # 187 dead files moved here (review then delete)
  latesUpdates/ # archive or move to unused if not used
  BSCT Trust Document/booklet/ # keep but optimize png → webp
```

### B. Image Processing (quality 75-80)
1. For each **used 186** image:
   - Generate `*.webp` (quality 75-80, effort 4) + `*.avif` (quality 45-50, fallback)
   - Compress original `jpeg/png` with mozjpeg/pngquant 75-80
   - Generate responsive sizes: 480w, 768w, 1200w (for gallery/hero) → `srcset`
   - Keep original as backup in `original/`

2. Tool: `sharp` (node) + `vite-plugin-imagemin` (build-time) + `vite-imagetools` (srcset)
   ```js
   // vite.config.js
   import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
   plugins: [react(), tailwindcss(), ViteImageOptimizer({ jpg: {quality:75}, png:{quality:80}, webp:{quality:75} })]
   ```

### C. Code Updates
- Replace `<img src="/images/x.jpg">` with:
  ```jsx
  <picture>
    <source srcSet="/images/optimized/x.avif" type="image/avif" />
    <source srcSet="/images/optimized/x.webp" type="image/webp" />
    <img src="/images/optimized/x.jpg" loading="lazy" decoding="async"
         width="800" height="600" alt="..." />
  </picture>
  ```
  Or use helper `OptimizedImage` component with `srcset` + `sizes`.
- Add `loading="lazy"` to ALL except 2 hero images (`aboutus1.jpeg`, `anndan.jpeg`) which stay `loading="eager"` + `fetchpriority="high"`
- Add explicit `width`/`height` (read via `sharp` metadata or set 800x600 placeholders to prevent CLS)
- Use `Intersection Observer` for below-fold galleries (already via `loading="lazy"` usually enough)
- Fix 43 broken refs (correct extension or remove)

### D. Future Uploads
- Enforce upload pipeline: admin uploads → auto sharp → store webp/avif + 3 sizes → DB returns optimized URLs
- Limit max upload 2MB, auto compress
- Use `media/` CMS table to serve via CDN with `?w=480&format=webp` query transforms
- Git hook: `pre-commit` reject >500KB images without optimized version

### E. Expected Gains
- **Before:** 373 files 290 MB, 122 eager loads, 22MB largest → Lighthouse ~45-55, LCP >4s
- **After (used only 186 optimized):** ~60-70 MB total (75% reduction), WebP ~30% smaller, AVIF ~50% smaller, lazy + srcset → LCP <1.8s, Bandwidth -70%, CLS 0

---
Next: implement steps B-E.
