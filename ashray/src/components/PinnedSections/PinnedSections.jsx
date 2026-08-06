import { useRef, useEffect, Children } from "react";
import "./PinnedSections.css";

// ============================================================
// PINNED SLIDES (Mann style) – full-screen sections pinned with
// ScrollTrigger. Each section pins as it fills the viewport.
// Sections taller than the viewport "fake scroll" internally first,
// then the whole panel shrinks & fades as the next section slides in.
// The last section is left in normal flow so the page ends naturally.
// ============================================================

function isReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PinnedSections({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return undefined;
    if (isReducedMotion()) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return undefined;

    const panels = gsap.utils.toArray(".pinned-section", root);
    if (!panels.length) return undefined;

    panels.forEach((panel) => {
      const inner = panel.querySelector(".pinned-inner");
      if (!inner) return;

      const panelHeight = inner.offsetHeight;
      const windowHeight = window.innerHeight;
      const difference = panelHeight - windowHeight;

      const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

      if (fakeScrollRatio) {
        panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "bottom bottom",
          end: () => (fakeScrollRatio ? `+=${inner.offsetHeight}` : "bottom top"),
          pinSpacing: false,
          pin: true,
          scrub: true,
        },
      });

      if (fakeScrollRatio) {
        tl.to(inner, {
          yPercent: -100,
          y: windowHeight,
          duration: 1 / (1 - fakeScrollRatio) - 1,
          ease: "none",
        });
      }
      tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(
        panel,
        { opacity: 0, duration: 0.1 }
      );
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const timer = window.setTimeout(refresh, 500);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  if (isReducedMotion()) return <>{children}</>;

  const total = Children.count(children);
  return (
    <div ref={rootRef} className="pinned-sections">
      {Children.map(children, (child, i) => {
        if (i === total - 1) {
          return (
            <div key={i} className="pinned-last">
              {child}
            </div>
          );
        }
        return (
          <section key={i} className="pinned-section" data-index={i}>
            <div className="pinned-inner">{child}</div>
          </section>
        );
      })}
    </div>
  );
}
