import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import Icon from "./Icon";

gsap.registerPlugin(ScrollTrigger, Draggable);

// ============================================================
// SEAMLESS SCROLLING GALLERY – GSAP
// An infinite loop of images that flies right-to-left forever.
// - Desktop: the stage pins and scrubs with scroll.
// - Mobile: smooth autoplay + drag + arrows/buttons.
// - Reduced motion: static responsive grid.
// ============================================================
export default function SeamlessGallery({
  items = [],
  autoPlayDelay = 3.2,
  className = "",
}) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef(null);
  const currentRef = useRef(null);
  const fillRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const cardsEl = cardsRef.current;
    if (!section || !stage || !cardsEl || !items.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- BUILD CARDS ----------
    cardsEl.innerHTML = items
      .map(
        (it, i) =>
          `<li class="sg-card">` +
          `<figure class="sg-frame">` +
          `<img src="${it.image || it.src}" alt="${it.caption || it.title || "MANN CARE"}" loading="lazy" draggable="false" />` +
          `<figcaption class="sg-caption">` +
          `<span class="sg-num">${String(i + 1).padStart(2, "0")}</span>` +
          `<span class="sg-title">${it.title || it.caption || "MANN CARE"}</span>` +
          `<span class="sg-tag">${it.tag || "Mann Care Foundation"}</span>` +
          `</figcaption>` +
          `</figure>` +
          `</li>`
      )
      .join("");

    const cards = gsap.utils.toArray(".sg-card", cardsEl);
    const total = items.length;
    const spacing = 0.1; // seconds between cards on the master timeline
    const cycle = spacing * total;

    if (reduceMotion) {
      section.classList.add("sg-reduced");
      return;
    }

    gsap.set(cards, {
      xPercent: 400,
      opacity: 0,
      scale: 0,
      rotateY: 0,
      transformPerspective: 900,
    });

    // The animation for ONE card: enters from the right, pops in, travels left, fades out.
    const animateFunc = (element) => {
      const caption = element.querySelector(".sg-caption");
      const tl = gsap.timeline();
      tl.fromTo(
        element,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power1.in",
          immediateRender: false,
        }
      ).fromTo(
        element,
        { xPercent: 400, rotateY: -22 },
        { xPercent: -400, rotateY: 22, duration: 1, ease: "none", immediateRender: false },
        0
      );
      if (caption) {
        tl.fromTo(
          caption,
          { opacity: 0, yPercent: 18 },
          { opacity: 1, yPercent: 0, duration: 0.3, ease: "power2.out", immediateRender: false },
          0.3
        ).to(caption, { opacity: 0, yPercent: -12, duration: 0.35, ease: "power1.in" }, 0.67);
      }
      return tl;
    };

    const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);

    // Proxy playhead – can go infinitely in either direction, wraps safely onto the loop.
    const playhead = { offset: 0 };
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
    const scrub = gsap.to(playhead, {
      offset: 0,
      onUpdate() {
        seamlessLoop.time(wrapTime(playhead.offset));
        updateHUD(playhead.offset);
      },
      duration: 0.5,
      ease: "power3",
      paused: true,
    });

    function updateHUD(offset) {
      const idx = ((Math.round(offset / spacing) % total) + total) % total;
      if (currentRef.current) currentRef.current.textContent = String(idx + 1).padStart(2, "0");
      const frac = ((offset % cycle) + cycle) % cycle;
      if (fillRef.current) {
        fillRef.current.style.transform = "scaleX(" + (frac / cycle).toFixed(4) + ")";
      }
    }

    let iteration = 0; // increments when we wrap around end<->start
    let trigger = null;

    const progressToScroll = (progress) =>
      gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end);

    const wrap = (iterationDelta, scrollTo) => {
      iteration += iterationDelta;
      if (!trigger) return;
      trigger.scroll(scrollTo);
      trigger.update();
    };

    const snapTime = gsap.utils.snap(spacing);
    function scrollToOffset(offset) {
      const snapped = snapTime(offset);
      if (!trigger) {
        // mobile – no pin, drive the playhead directly
        scrub.vars.offset = snapped;
        scrub.invalidate().restart();
        return;
      }
      const progress = (snapped - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
      const scroll = progressToScroll(progress);
      if (progress >= 1 || progress < 0) return wrap(Math.floor(progress), scroll);
      trigger.scroll(scroll);
    }

    const next = () => scrollToOffset(scrub.vars.offset + spacing);
    const prev = () => scrollToOffset(scrub.vars.offset - spacing);

    // ---------- DESKTOP: PIN + SCROLL-SCRUB (skipped on mobile / reduced motion) ----------
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const onScrollEnd = () => {
        // only snap while this gallery is actually pinned/active
        if (trigger && trigger.isActive) scrollToOffset(scrub.vars.offset);
      };
      ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=3000",
        pin: true,
        anticipatePin: 1,
        onUpdate(self) {
          const scroll = self.scroll();
          if (scroll > self.end - 1) {
            wrap(1, 2);
          } else if (scroll < 1 && self.direction < 0) {
            wrap(-1, self.end - 2);
          } else {
            scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
            scrub.invalidate().restart();
          }
        },
      });

      return () => {
        ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
        if (trigger) trigger.kill();
        trigger = null;
      };
    });

    // ---------- CONTROLS ----------
    prevRef.current?.addEventListener("click", () => { prev(); restartAuto(); });
    nextRef.current?.addEventListener("click", () => { next(); restartAuto(); });

    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); restartAuto(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); restartAuto(); }
    };
    section.setAttribute("tabindex", "-1");
    section.addEventListener("keydown", onKey);

    // ---------- DRAG (mouse + touch) ----------
    const dragInstance = Draggable.create(".sg-drag-proxy", {
      type: "x",
      trigger: cardsEl,
      onPress() {
        stopAuto();
        this.startOffset = scrub.vars.offset;
      },
      onDrag() {
        scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
        scrub.invalidate().restart();
      },
      onDragEnd() {
        scrollToOffset(scrub.vars.offset);
        restartAuto();
      },
    });

    // ---------- AUTOPLAY (pauses on hover / interaction) ----------
    const auto = gsap.delayedCall(autoPlayDelay, next);
    auto.pause();
    function startAuto() { auto.restart(true); }
    function stopAuto() { auto.pause(); }
    function restartAuto() { startAuto(); }

    section.addEventListener("pointerenter", stopAuto);
    section.addEventListener("pointerleave", startAuto);
    section.addEventListener("pointerdown", stopAuto);

    // ---------- KICK OFF ----------
    updateHUD(0);
    startAuto();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      section.removeEventListener("keydown", onKey);
      mm.revert();
      gsap.killTweensOf([scrub, auto]);
      seamlessLoop.kill();
      if (dragInstance) dragInstance.forEach((d) => d.kill());
      section.classList.remove("sg-reduced");
    };
  }, [items, autoPlayDelay]);

  return (
    <div ref={sectionRef} className={`sg-section ${className}`} role="group" aria-label="Scrolling gallery">
      <div ref={stageRef} className="sg-stage">
        <ul ref={cardsRef} className="sg-cards"></ul>

        <div className="sg-hud">
          <div className="sg-counter">
            <b ref={currentRef}>01</b>&nbsp;&nbsp;/&nbsp;<span>{String(items.length).padStart(2, "0")}</span>
          </div>
          <div className="sg-progress">
            <span ref={fillRef}></span>
          </div>
        </div>

        <div className="sg-controls">
          <button ref={prevRef} aria-label="Previous image">
            <Icon name="arrow_back" />
          </button>
          <button ref={nextRef} aria-label="Next image">
            <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
      <div className="sg-drag-proxy"></div>
    </div>
  );
}

// ============================================================
// Builds a master timeline that reuses the same few card
// animations so the playhead can loop forever seamlessly.
// ============================================================
function buildSeamlessLoop(items, spacing, animateFunc) {
  const overlap = Math.ceil(1 / spacing), // extra animations on either side for seamless wrapping
    startTime = items.length * spacing + 0.5,
    loopTime = (items.length + overlap) * spacing + 1,
    rawSequence = gsap.timeline({ paused: true }), // the "real" animations
    seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() {
        // works around a super rare edge case (fixed in GSAP 3.6.1)
        this._time === this._dur && (this._tTime += this._dur - 0.01);
      },
    }),
    l = items.length + overlap * 2;
  let time, i, index;

  // stagger all the animations, including extra ones at the end for the loop
  for (i = 0; i < l; i++) {
    index = i % items.length;
    time = i * spacing;
    rawSequence.add(animateFunc(items[index]), time);
  }

  // scrub the raw sequence's playhead so it wraps forever
  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none",
    })
    .fromTo(rawSequence, { time: overlap * spacing + 1 }, {
      time: startTime,
      duration: startTime - (overlap * spacing + 1),
      immediateRender: false,
      ease: "none",
    });

  return seamlessLoop;
}
