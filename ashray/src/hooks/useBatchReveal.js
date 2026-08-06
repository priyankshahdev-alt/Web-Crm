import { useEffect } from "react";

// Staggered "blur + rise" reveal using ScrollTrigger.batch().
// Different from Mann's plain fade: cards grouped by scroll batch
// rise up from a soft blur into focus with a springy ease.
export default function useBatchReveal(ref, selector = ".app-reveal", options = {}) {
  const {
    start = "top 92%",
    stagger = 0.12,
    duration = 0.9,
    ease = "expo.out",
    once = true,
  } = options;

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const node = ref.current;

    if (!gsap || !ScrollTrigger || !node) return undefined;

    const items = node.querySelectorAll(selector);
    if (items.length === 0) return undefined;

    // Reduced motion: just make everything visible.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { clearProps: "all" });
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.set(items, { autoAlpha: 0, y: 46, scale: 0.96, filter: "blur(8px)" });

    ScrollTrigger.batch(items, {
      start,
      once,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration,
          stagger,
          ease,
          overwrite: true,
        }),
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars && st.vars.trigger && node.contains(st.vars.trigger)) st.kill();
      });
      gsap.set(items, { clearProps: "all" });
    };
  }, [ref, selector, start, stagger, duration, ease, once]);
}
