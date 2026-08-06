import { useEffect, useRef, useState } from "react";

function parseStat(str) {
  const m = String(str).match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!m) return null;
  return {
    prefix: m[1],
    suffix: m[3],
    value: parseInt(m[2].replace(/,/g, ""), 10),
  };
}

// Rolls a number up from 0 to its target when it scrolls into view.
export default function CountUp({ value, duration = 1.8 }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(value);

  const parsed = parseStat(value);
  const isAnimated = Boolean(parsed);

  useEffect(() => {
    if (!isAnimated || started) return undefined;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const el = ref.current;
    if (!gsap || !ScrollTrigger || !el) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStarted(true);
      setDisplay(value);
      return undefined;
    }

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: parsed.value,
      duration,
      ease: "expo.out",
      onUpdate: () => {
        setDisplay(`${parsed.prefix}${Math.round(obj.v).toLocaleString("en-IN")}${parsed.suffix}`);
      },
      onComplete: () => setDisplay(value),
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => setStarted(true),
      },
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [isAnimated, parsed, started, value, duration]);

  if (!isAnimated) return <span>{value}</span>;

  return <span ref={ref}>{display}</span>;
}
