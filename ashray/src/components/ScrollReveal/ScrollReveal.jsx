import { useEffect } from "react";

// Site-wide scroll reveal.
//
// - Fixes pages that use `.reveal-on-scroll` without their own observer
//   (e.g. About), so their content can never stay hidden.
// - Powers `[data-reveal]` elements anywhere, even when react-router
//   swaps the page under us (MutationObserver re-scans the DOM).
// - Respects `prefers-reduced-motion` (elements are simply left visible).
const SELECTOR = ".reveal-on-scroll, .reveal-up, [data-reveal]";

export default function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const seen = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            seen.add(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          observer.observe(el);
        }
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
