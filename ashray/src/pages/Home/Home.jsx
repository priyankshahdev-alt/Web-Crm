import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import CountUp from "../../components/Common/CountUp";
import useBatchReveal from "../../hooks/useBatchReveal";
import { useSite } from "../../context/SiteContext";
import { getSection, getSetting } from "../../lib/site";
import "./Home.css";

// ============================================================
// ASHRAY HOME – editorial hero + motion
// Hero carousel: full-bleed photo, arch subject cutout,
// oversized campaign headline, tactile 3D CTA, arrows + dots.
// Below the fold: staggered blur+rise batch reveals, count-up
// stats and a parallax hero — smoother than pinned fake-scroll.
// Content is DB-driven via site sections, with the original
// hardcoded values as fallbacks so the site renders identically
// before any edits are made in the Website Editor.
// ============================================================

const DEFAULT_HERO_SLIDES = [
  {
    id: "dignity",
    eyebrow: "Empowering Lives Since 2022",
    title: "Restoring Dignity,",
    accent: "One Life at a Time.",
    sub: "Ashray for Life Foundation is dedicated to providing compassionate care, nutritious meals, and essential support to elderly citizens, disabled individuals, and underprivileged children in our community.",
    cta: { label: "Donate Now", to: "/donate" },
    cta2: { label: "See Our Impact", to: "/gallery" },
    bg: "/images/Ashray/img2.jpg",
    subject: "/images/Ashray/img1.jpg",
    subjectAlt: "Ashray for Life community",
    subjectPosition: "center 45%",
    panelLabel: "Ashray for Life",
    panelTitle: "NOURISH. CARE. PROTECT.",
  },
  {
    id: "sahara",
    eyebrow: "Sahara · Elderly Care",
    title: "Caring For Our Elders,",
    accent: "With Love & Dignity.",
    sub: "Supporting elderly individuals with care, dignity, and companionship for a better quality of life.",
    cta: { label: "Explore Sahara", to: "/programs/old-age-home" },
    cta2: { label: "Donate Now", to: "/donate" },
    bg: "/images/Sahara/Sahara.jpg",
    subject: "/images/Sahara/img1.jpg",
    subjectAlt: "Sahara elderly care program",
    subjectPosition: "center 30%",
    panelLabel: "Project Sahara",
    panelTitle: "CARE. LOVE. DIGNITY.",
  },
  {
    id: "vidhyalay",
    eyebrow: "Project Vidhyalay · Education",
    title: "Educating Every Child,",
    accent: "Building Tomorrow Today.",
    sub: "Breaking the cycle of illiteracy by ensuring every underprivileged child has access to quality education.",
    cta: { label: "Explore Vidhyalay", to: "/programs/education" },
    cta2: { label: "See Our Impact", to: "/gallery" },
    bg: "/images/education/Educationhome.jpg",
    subject: "/images/education/img2.JPG",
    subjectAlt: "Project Vidhyalay education program",
    subjectPosition: "center 32%",
    panelLabel: "Project Vidhyalay",
    panelTitle: "EDUCATE. EMPOWER. ELEVATE.",
  },
];

const DEFAULT_STATS = [
  { icon: "group", value: "10,000+", label: "Lives Impacted" },
  { icon: "volunteer_activism", value: "15+", label: "Active Projects" },
  { icon: "currency_rupee", value: "₹50L+", label: "Funds Raised" },
  { icon: "event_available", value: "2+ Years", label: "of Service" },
];

const DEFAULT_PROJECTS = [
  {
    title: "Nutritious Meals",
    tag: "Nutrition",
    description:
      "Providing healthy daily meals to elderly citizens in need, ensuring they receive the sustenance and care they deserve.",
    image: "/images/oldage/img1.jpg",
    to: "/programs/old-age-home",
    position: "0% 50%",
  },
  {
    title: "Healthcare Support",
    tag: "Healthcare",
    description:
      "Specialized checkups and medical aid for disabled individuals, improving their quality of life and well-being.",
    image: "/images/medical/img4.jpg",
    to: "/programs/medical",
    position: "50% 50%",
  },
  {
    title: "Empowering Education",
    tag: "Education",
    description:
      "Supporting the dreams of underprivileged children with resources, tuition, and essential school supplies.",
    image: "/images/education/Educationhome.jpg",
    to: "/programs/education",
    position: "100% 50%",
  },
];

const DEFAULT_IMPACT_IMAGES = [
  "/images/Ashray/img2.jpg",
  "/images/Sahara/Sahara.jpg",
  "/images/education/Educationhome.jpg",
  "/images/medical/img4.jpg",
  "/images/oldage/img1.jpg",
  "/images/Ashray/img1.jpg",
  "/images/gallery/vidhyalay1.jpg",
  "/images/gallery/nari1.jpg",
  "/images/gallery/hunger1.jpg",
  "/images/gallery/jal1.jpg",
  "/images/gallery/pashu1.jpg",
  "/images/gallery/img5.jpg",
];

const DEFAULT_CTA = {
  heading:
    "Your contribution provides meals, shelter, and care. Join us in making a difference today.",
  buttonLabel: "Donate Now",
  buttonUrl: "/donate",
};

const fillStyle = { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" };

const heroBadges = ["Regd. No. E-37237", "80G Certified", "10,000+ Lives Impacted"];

function normalizeHeroSlides(section) {
  const slides = section?.content?.slides;
  if (!Array.isArray(slides) || slides.length === 0) return DEFAULT_HERO_SLIDES;
  const mapped = slides.map((s) => ({
    id: s.id || s.title || s.altText || "slide",
    eyebrow: s.eyebrow || "",
    title: s.title || "",
    accent: s.accent || "",
    sub: s.subtitle || "",
    cta: { label: s.ctaLabel || "Donate Now", to: s.ctaUrl || "/donate" },
    cta2:
      s.cta2Label && s.cta2Url
        ? { label: s.cta2Label, to: s.cta2Url }
        : null,
    bg: s.imageUrl || "",
    subject: s.subjectImageUrl || "",
    subjectAlt: s.subjectAlt || s.altText || "",
    subjectPosition: s.subjectPosition || "center 45%",
    panelLabel: s.panelLabel || "",
    panelTitle: s.panelTitle || "",
  }));
  return mapped.filter((s) => s.bg && s.title).length > 0
    ? mapped.filter((s) => s.bg && s.title)
    : DEFAULT_HERO_SLIDES;
}

function normalizeStats(section) {
  const items = section?.content?.items;
  if (!Array.isArray(items) || items.length === 0) return DEFAULT_STATS;
  return items.map((it, i) => ({
    icon: it.icon || DEFAULT_STATS[i % DEFAULT_STATS.length].icon || "group",
    value: it.value,
    label: it.label,
  }));
}

function normalizeProjects(section) {
  const list = section?.content?.projects;
  if (Array.isArray(list) && list.length > 0) {
    const mapped = list
      .map((p) => ({
        title: p.title,
        tag: p.tag || "",
        description: p.description || p.summary || "",
        image: p.image || p.imageUrl || "",
        to: p.url || p.to || "/programs",
        position: p.position || "50% 50%",
      }))
      .filter((p) => p.title && p.image);
    if (mapped.length > 0) return mapped;
  }
  return DEFAULT_PROJECTS;
}

function normalizeMarqueeImages(section) {
  const images = section?.content?.images;
  if (Array.isArray(images) && images.length > 0) {
    const filtered = images.filter((img) => typeof img === "string" && img.trim());
    if (filtered.length > 0) return filtered;
  }
  return DEFAULT_IMPACT_IMAGES;
}

// ---------- HERO CAROUSEL ----------
function HeroCarousel({ slides = DEFAULT_HERO_SLIDES }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [active, slides.length]);

  const go = (i) => setActive((i + slides.length) % slides.length);

  useEffect(() => {
    const gsap = window.gsap;
    const SplitText = window.SplitText;
    if (!gsap || !SplitText) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    gsap.registerPlugin(SplitText);

    const title = document.querySelector(".ashray-hero__slide.is-active .ashray-hero__title");
    if (!title) return undefined;

    let cancelled = false;
    let anim = null;

    const split = SplitText.create(title, {
      type: "words,lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        if (cancelled) return;
        anim = gsap.from(self.lines, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "expo.out",
        });
      },
    });

    return () => {
      cancelled = true;
      if (anim) anim.kill();
      if (split) split.revert();
    };
  }, [active]);

  // Cinematic entrance only (crossfade handled in CSS).
  useEffect(() => {
    const gsap = window.gsap;
    const SplitText = window.SplitText;
    if (!gsap || !SplitText) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    gsap.registerPlugin(SplitText);

    const title = document.querySelector(".ashray-hero__slide.is-active .ashray-hero__title");
    if (!title) return undefined;

    let cancelled = false;
    let anim = null;

    const split = SplitText.create(title, {
      type: "words,lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        if (cancelled) return;
        anim = gsap.from(self.lines, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "expo.out",
        });
      },
    });

    return () => {
      cancelled = true;
      if (anim) anim.kill();
      if (split) split.revert();
    };
  }, [active]);

  return (
    <section className="ashray-hero" aria-label="Highlights carousel">
      <div className="ashray-hero__track">
        {slides.map((s, i) => (
          <div className={`ashray-hero__slide ${i === active ? "is-active" : ""}`} key={s.id}>
            <div className="ashray-hero__bg">
              <img src={s.bg} alt={s.subjectAlt || s.title} loading={i === 0 ? "eager" : "lazy"} />
            </div>
            <div className="ashray-hero__shade" />

            <div className="ashray-hero__inner">
              <div className="ashray-hero__content">
                <span className="ashray-hero__eyebrow ashray-hero__anim">{s.eyebrow}</span>
                <h1 className="ashray-hero__title split">
                  {s.title}
                  <span className="ashray-hero__title-accent">{s.accent}</span>
                </h1>
                <p className="ashray-hero__sub ashray-hero__anim ashray-hero__anim-3">{s.sub}</p>
                <div className="ashray-hero__ctas ashray-hero__anim ashray-hero__anim-4">
                  <Link to={s.cta.to} className="btn-3d">
                    {s.cta.label}
                    <span className="material-symbols-outlined btn-3d__icon">favorite</span>
                  </Link>
                  {s.cta2 && (
                    <Link to={s.cta2.to} className="ashray-hero__ghost">
                      {s.cta2.label}
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  )}
                </div>
                <ul className="ashray-hero__badges ashray-hero__anim ashray-hero__anim-5">
                  {heroBadges.map((b) => (
                    <li key={b}>
                      <span className="material-symbols-outlined ashray-hero__badge-check">check_circle</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ashray-hero__panel">
                <h2 className="ashray-hero__panel-name">{s.panelLabel}</h2>
                <p className="ashray-hero__panel-tagline">{s.panelTitle}</p>
                <div className="ashray-hero__panel-logo">
                  <img
                    src="/images/Ashray Foundation logo.png"
                    alt="Ashray for Life Foundation"
                    loading="lazy"
                  />
                  <span className="ashray-hero__panel-logo-text">
                    <strong>Regd.No.E-37237</strong>
                    <span>Ashray</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ashray-hero__controls">
        <button className="ashray-hero__arrow" onClick={() => go(active - 1)} aria-label="Previous slide">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="ashray-hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`ashray-hero__dot ${i === active ? "is-active" : ""}`}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="ashray-hero__arrow" onClick={() => go(active + 1)} aria-label="Next slide">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  );
}

// ---------- HOME ----------
function Home() {
  const mainRef = useRef(null);
  const { site } = useSite();

  const heroSlides = normalizeHeroSlides(getSection(site, "hero-slider"));
  const stats = normalizeStats(getSection(site, "stats"));
  const projects = normalizeProjects(getSection(site, "projects-grid"));
  const impactImages = normalizeMarqueeImages(getSection(site, "gallery"));
  const ctaSection = getSection(site, "cta")?.content ?? DEFAULT_CTA;
  const ctaHeading =
    getSetting(site, "cta.heading", ctaSection.heading) || DEFAULT_CTA.heading;
  const ctaLabel = ctaSection.buttonLabel || DEFAULT_CTA.buttonLabel;
  const ctaUrl = ctaSection.buttonUrl || DEFAULT_CTA.buttonUrl;

  useBatchReveal(mainRef, ".app-reveal");

  return (
    <div ref={mainRef} className="bg-surface text-on-surface font-body-md antialiased">
      <HeroCarousel slides={heroSlides} />

      {/* ===== IMPACT STATS ===== */}
      <section className="bg-surface-container-low py-16">
        <div className="px-gutter max-w-container-max mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="app-reveal flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 hover:-translate-y-1 transition-transform h-full"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <span
                  className="material-symbols-outlined text-4xl text-secondary-container mb-4"
                  style={fillStyle}
                >
                  {stat.icon}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary-container mb-2">
                  <CountUp value={stat.value} />
                </h3>
                <p className="font-label-bold text-label-bold text-on-surface-variant uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR PROJECTS ===== */}
      <section className="py-section-gap px-gutter max-w-container-max mx-auto">
        <div className="app-reveal text-center mb-12">
          <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest mb-2 block">
            Our Initiatives
          </span>
          <h2 className="font-headline-md text-[32px] leading-10 text-primary-container">
            Our Projects
          </h2>
          <div className="w-16 h-1 bg-secondary-container mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.title}
              to={project.to}
              className="app-reveal bg-surface-container-lowest rounded-[1.5rem] overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-outline-variant/20 flex flex-col group h-full"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={project.image}
                  style={{ objectPosition: project.position }}
                />
                <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-container shadow-sm">
                  {project.tag}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-headline-sm text-headline-sm text-primary-container mb-3">
                  {project.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                  {project.description}
                </p>
                <span className="font-button-text text-button-text text-primary-container hover:text-secondary-container inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== IMPACT IN ACTION (auto-scroll marquee) ===== */}
      <section className="py-20 px-gutter bg-surface-container-low overflow-hidden marquee-container">
        <div className="max-w-container-max mx-auto mb-12">
          <div className="app-reveal text-center">
            <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest block">
              Our Impact
            </span>
            <h2 className="font-headline-md text-[32px] md:text-5xl md:leading-tight text-primary-container mt-2">
              IMPACT IN <span className="italic text-secondary-container">ACTION.</span>
            </h2>
          </div>
        </div>
        <div className="marquee-track-left">
          <div className="flex gap-8 px-4">
            {impactImages.map((img, i) => (
              <div key={i} className="impact-card">
                <img src={img} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="flex gap-8 px-4">
            {impactImages.map((img, i) => (
              <div key={`dup-${i}`} className="impact-card">
                <img src={img} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-gutter mx-auto max-w-container-max mb-12">
        <div className="app-reveal relative overflow-hidden rounded-[2rem] p-8 sm:p-12 md:p-20 text-center shadow-xl border border-white/10 bg-gradient-to-br from-[#00236f] via-[#12307f] to-[#1e3a8a]">
          <div
            className="absolute inset-0 opacity-20"
            aria-hidden="true"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1.5px, transparent 1.5px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div
            className="absolute -top-28 -right-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <span className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 ring-1 ring-white/25 mb-8">
              <span
                className="absolute inset-2 rounded-full bg-secondary-container/30 blur-md"
                aria-hidden="true"
              />
              <span
                className="material-symbols-outlined text-secondary-container text-5xl relative"
                style={fillStyle}
              >
                volunteer_activism
              </span>
            </span>
            <h2 className="text-display-lg-mobile md:text-[32px] md:leading-10 text-on-primary mb-6">
              {ctaHeading}
            </h2>
            <Link to={ctaUrl} className="btn-3d btn-3d--gold mt-4">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
