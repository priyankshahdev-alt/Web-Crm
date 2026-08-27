import { useEffect, useRef, useState } from 'react';

/**
 * OptimizedImage - serves WebP + AVIF with fallback, responsive srcset, lazy loading, CLS prevention
 * Usage: <OptimizedImage src="/images/aboutus1.jpeg" alt="..." width={800} height={600} />
 *  - Automatically tries /images/optimized/<name>.webp/.avif if exists, falls back to original
 *  - Generates srcset for 480/768/1200 if optimized responsive files exist
 *  - Lazy by default, except priority={true} for hero LCP
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  priority = false, // true = eager + fetchpriority high (for hero)
  sizes = '(max-width: 768px) 100vw, 50vw',
  ...props
}) {
  const imgRef = useRef(null);
  const [inView, setInView] = useState(priority);

  // Intersection Observer for lazy (fallback if browser doesn't support loading="lazy")
  useEffect(() => {
    if (priority || !imgRef.current || typeof window === 'undefined') return;
    if ('loading' in HTMLImageElement.prototype) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px' }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Derive optimized paths: /images/x.jpg -> /images/optimized/x.webp / .avif
  const getOptimized = (original, ext) => {
    if (!original || original.startsWith('http') || original.startsWith('data:')) return null;
    // keep query/hash stripped for optimized lookup, but preserve for original
    const clean = original.split('?')[0].split('#')[0];
    if (!clean.startsWith('/images/') && !clean.startsWith('/BSCT') && !clean.startsWith('/logo')) return null;
    const withoutExt = clean.replace(/\.[^/.]+$/, '');
    // map /images/foo.jpg -> /images/optimized/foo.ext
    // for /images/foo.jpg -> /images/optimized/foo.webp
    const optimizedBase = withoutExt.replace('/images/', '/images/optimized/');
    // handle BSCT and root
    if (clean.startsWith('/BSCT')) return null; // don't optimize PDFs/booklet thumbnails via this
    if (clean.startsWith('/logo')) return null;
    return optimizedBase + ext;
  };

  const webpSrc = getOptimized(src, '.webp');
  const avifSrc = getOptimized(src, '.avif');

  // srcset for responsive - only if width/height known and not priority (hero)
  const srcSetWebp = webpSrc
    ? `${webpSrc.replace('.webp', '-480w.webp')} 480w, ${webpSrc.replace('.webp', '-768w.webp')} 768w, ${webpSrc} 1200w`
    : null;
  const srcSetAvif = avifSrc
    ? `${avifSrc.replace('.avif', '-480w.avif')} 480w, ${avifSrc.replace('.avif', '-768w.avif')} 768w, ${avifSrc} 1200w`
    : null;

  // If not inView yet and not priority, render placeholder to prevent CLS
  const placeholderStyle = !inView && !priority
    ? { background: '#f1f5f9', minHeight: height || 200 }
    : undefined;

  // Use <picture> for AVIF -> WebP -> fallback
  if (webpSrc || avifSrc) {
    return (
      <picture ref={imgRef} style={placeholderStyle}>
        {inView && avifSrc && <source srcSet={srcSetAvif || avifSrc} sizes={sizes} type="image/avif" />}
        {inView && webpSrc && <source srcSet={srcSetWebp || webpSrc} sizes={sizes} type="image/webp" />}
        <img
          src={inView ? src : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
          data-src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={className}
          style={style}
          {...props}
        />
      </picture>
    );
  }

  // Fallback for external or non-optimized
  return (
    <img
      ref={imgRef}
      src={inView ? src : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
      data-src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={{ ...style, ...placeholderStyle }}
      {...props}
    />
  );
}
