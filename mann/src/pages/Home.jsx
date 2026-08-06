import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import SeamlessGallery from "../components/SeamlessGallery";
import { useSiteData } from "../api/useSiteData";

// ============================================================
// MANN CARE – SOFT MODERN HOME (reference design)
// ============================================================

// ---------- HERO CAROUSEL ----------
function HeroCarousel({ slides }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  const go = (i) => setActive((i + slides.length) % slides.length);

  return (
    <section className="relative h-[90vh] md:h-screen flex flex-col justify-center overflow-hidden bg-surface-dim hero-carousel-container">
      <div
        className="hero-carousel-track h-full"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div className="hero-slide" key={i}>
            <Link to={s.cta} className="w-full h-full relative block" aria-label={s.alt}>
              <img
                src={s.mobile ?? s.desktop}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover md:hidden"
              />
              <img
                src={s.desktop}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                className="hidden md:block w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </Link>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-12 flex justify-center items-center gap-6 z-20">
        <button
          onClick={() => go(active - 1)}
          aria-label="Previous slide"
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <Icon name="arrow_back" className="text-3xl" />
        </button>
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                i === active ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(active + 1)}
          aria-label="Next slide"
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <Icon name="arrow_forward" className="text-3xl" />
        </button>
      </div>
    </section>
  );
}

// ---------- HOME ----------
export default function Home() {
  const { data } = useSiteData();
  const { slides, stats, initiatives, activities, getInvolved, causes, partners, contact } = data;

  const homeSections = [
    <HeroCarousel key="hero" slides={slides} />,

    // ===== NARRATIVE =====
    <section key="narrative" className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-low" id="about">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={slides[0]?.desktop}
                alt="Our Purpose"
                className="w-full h-[400px] md:h-[700px] object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-10">
              <div className="inline-block px-4 py-1.5 bg-secondary-fixed text-primary font-label-bold text-xs uppercase tracking-widest rounded-full">
                OUR PURPOSE
              </div>
              <h2 className="font-display-lg text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter uppercase font-extrabold">
                BEYOND <br />
                <span className="italic text-stroke-primary">SURVIVAL.</span>
              </h2>
              <p className="font-body-lg text-on-surface-variant text-2xl md:text-3xl leading-snug font-medium max-w-lg">
                We don't just provide aid; we build dignity. Radical presence in rural India
                through direct action.
              </p>
              <div className="soft-modern-card max-w-xl">
                <h4 className="font-headline-sm text-2xl mb-4 text-primary uppercase">
                  The Mission
                </h4>
                <p className="text-lg leading-relaxed text-on-surface-variant">
                  Restoring dignity via consistent nutrition, quality education, and accessible
                  healthcare. No excuses, only results.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 md:mt-28">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div
                className={`soft-modern-card text-center p-8! md:p-16! ${
                  i === 1 ? "bg-primary text-white border-none" : ""
                }`}
              >
                <div
                  className={`font-display-lg text-5xl md:text-8xl mb-6 tracking-tighter font-extrabold ${
                    i === 1 ? "text-white" : "text-primary"
                  }`}
                >
                  {s.value}
                </div>
                <div
                  className={`font-label-bold text-sm tracking-[0.25em] uppercase border-t pt-8 ${
                    i === 1
                      ? "text-white/70 border-white/20"
                      : "text-on-surface-variant border-surface-container-highest"
                  }`}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,

    // ===== ABOUT DETAILED =====
    <section key="about-us" className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-high" id="about-us">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 space-y-10">
            <Reveal>
              <div className="flex flex-wrap gap-4">
                <span className="font-label-bold text-xs uppercase bg-primary text-white px-6 py-2.5 rounded-full tracking-widest">
                  Who We Are
                </span>
                <span className="font-label-bold text-xs uppercase bg-white text-primary border border-primary/20 px-6 py-2.5 rounded-full tracking-widest">
                  Trusted NGO
                </span>
              </div>
            </Reveal>
            <Reveal>
              <h2 className="font-display-lg text-4xl md:text-7xl text-on-surface leading-none uppercase tracking-tighter font-extrabold">
                About MANN CARE FOUNDATION
              </h2>
            </Reveal>
            <Reveal>
              <p className="font-body-lg text-2xl md:text-3xl leading-snug text-on-surface-variant max-w-3xl">
                MANN CARE FOUNDATION is a compassionate non-profit committed to transforming
                lives of women and children from underprivileged and marginalized communities.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <Reveal>
                <div className="soft-modern-card">
                  <h4 className="font-headline-sm text-xl mb-4 text-primary uppercase tracking-tight">
                    Our Mission
                  </h4>
                  <p className="font-body-md text-on-surface-variant opacity-90">
                    Addressing fundamental needs — nutritious food, quality education, menstrual
                    hygiene, and self-reliance.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="soft-modern-card">
                  <h4 className="font-headline-sm text-xl mb-4 text-primary uppercase tracking-tight">
                    Our Vision
                  </h4>
                  <p className="font-body-md text-on-surface-variant opacity-90">
                    An inclusive society where every woman is empowered and every child is
                    nourished and educated.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2">
                <img
                  src={slides[2]?.desktop}
                  alt="Community Support"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>,

    // ===== INITIATIVES =====
    <section key="initiatives" className="py-section-padding-mobile md:py-section-padding-desktop bg-white" id="projects">
      <div className="max-w-container-max mx-auto px-8 mb-16 md:mb-24">
        <Reveal>
          <h2 className="font-display-lg text-6xl md:text-9xl text-stroke-primary leading-none tracking-tighter uppercase font-extrabold">
            THE
            <br />
            WORK.
          </h2>
        </Reveal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-container-max mx-auto px-8">
        {initiatives.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 100}>
            <Link
              to={`/projects/${p.slug}`}
              className="group soft-modern-card p-0! overflow-hidden block"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-12">
                <span className="font-label-bold text-xs uppercase tracking-widest text-primary mb-6 block">
                  {p.num} / {p.slug}
                </span>
                <h3 className="font-display-lg text-2xl md:text-4xl mb-6 text-on-surface uppercase font-extrabold">{p.name}</h3>
                <p className="text-xl text-on-surface-variant leading-relaxed">{p.text}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>,

    // ===== IMPACT IN ACTION (scrolling gallery) =====
    <section
      key="impact-action"
      className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-low overflow-hidden"
      id="impact-action"
    >
      <div className="max-w-container-max mx-auto px-8 mb-12 md:mb-16">
        <Reveal>
          <h2 className="font-display-lg text-5xl md:text-9xl text-on-surface uppercase leading-[0.85] tracking-tighter font-extrabold">
            IMPACT IN
            <br />
            <span className="italic text-primary">ACTION.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="font-body-lg text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-snug mt-6">
            Scroll, drag, or use the arrows — every image is a story of hope, dignity, and change
            from our on-ground work.
          </p>
        </Reveal>
      </div>
      <SeamlessGallery items={activities} autoPlayDelay={3.2} />
    </section>,

    // ===== GET INVOLVED =====
    <section key="get-involved" className="py-section-padding-mobile md:py-section-padding-desktop bg-white overflow-hidden marquee-container" id="get-involved-new">
      <div className="max-w-container-max mx-auto px-8">
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-display-lg text-4xl md:text-7xl text-on-surface uppercase leading-none mb-10 tracking-tighter font-extrabold">
              Get Involved
            </h2>
          </Reveal>
          <Reveal>
            <p className="font-body-lg text-2xl text-on-surface-variant leading-snug">
              Every act of kindness has the power to transform lives. Together, we can provide
              food, education, and hope.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getInvolved.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <Link to={c.to} className="soft-modern-card text-center flex flex-col items-center h-full block">
                <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center text-primary mb-8">
                  <Icon name={c.icon} className="text-4xl" />
                </div>
                <h3 className="font-headline-sm text-2xl mb-4 text-on-surface uppercase">
                  {c.title}
                </h3>
                <p className="font-body-md mb-10 text-on-surface-variant">{c.desc}</p>
                <span className="mt-auto font-label-bold text-primary flex items-center gap-3 uppercase tracking-widest text-sm hover:gap-5 transition-all">
                  {c.btn} <Icon name="arrow_forward" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-24 md:mt-32">
          <Reveal>
            <div className="flex flex-col md:flex-row items-baseline justify-between gap-10 mb-16">
              <h2 className="font-display-lg text-4xl md:text-6xl text-on-surface uppercase tracking-tighter font-extrabold">
                OUR <span className="italic text-primary">TRUSTED</span> PARTNERS.
              </h2>
              <p className="font-label-bold text-on-surface-variant opacity-80 uppercase tracking-widest text-xs max-w-xs">
                Driving impact through collective action and strategic collaboration.
              </p>
            </div>
          </Reveal>
          <div className="marquee-track-partners">
            <div className="flex gap-6 md:gap-12 px-6">
              {partners.map((logo, i) => (
                <div
                  key={i}
                  className="soft-modern-card p-4! md:p-8! flex items-center justify-center w-36 md:w-64 h-24 md:h-32 flex-shrink-0"
                >
                  <img
                    src={logo}
                    alt="Partner Logo"
                    className="max-h-10 md:max-h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
                  />
                </div>
              ))}
            </div>
            {/* Clone for loop */}
            <div aria-hidden="true" className="flex gap-6 md:gap-12 px-6">
              {partners.map((logo, i) => (
                <div
                  key={i}
                  className="soft-modern-card p-4! md:p-8! flex items-center justify-center w-36 md:w-64 h-24 md:h-32 flex-shrink-0"
                >
                  <img alt="" src={logo} className="max-h-10 md:max-h-12 w-auto grayscale opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>,

    // ===== CAUSES TO SUPPORT =====
    <section key="causes" className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-low" id="causes-support">
      <div className="max-w-container-max mx-auto px-8">
        <div className="mb-20">
          <Reveal>
            <h2 className="font-display-lg text-5xl md:text-8xl text-stroke-primary leading-none uppercase tracking-tighter font-extrabold">
              CAUSES TO
              <br />
              SUPPORT.
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {causes.map((c) => (
            <Reveal key={c.label}>
              <div className="soft-modern-card text-center p-8! md:p-10!">
                <Icon name={c.icon} className="text-4xl text-primary mb-6 block" />
                <h4 className="font-label-bold text-xs uppercase tracking-widest text-on-surface">
                  {c.label}
                </h4>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,

    // ===== YOUR TURN TO LEAD =====
    <section key="your-turn" className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-high" id="your-turn-to-lead">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-12">
            <Reveal>
              <h2 className="font-display-lg text-6xl md:text-9xl text-on-surface leading-[0.8] uppercase tracking-tighter font-extrabold">
                YOUR TURN
                <br />
                TO LEAD.
              </h2>
            </Reveal>
            <div className="space-y-6">
              <Reveal>
                <Link
                  to="/get-involved/donate-online"
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-8 rounded-3xl bg-primary text-white hover:bg-secondary transition-all group shadow-xl shadow-primary/20"
                >
                  <div className="flex items-center gap-4 md:gap-8 min-w-0">
                    <Icon name="volunteer_activism" className="text-3xl md:text-5xl flex-shrink-0" />
                    <span className="font-display-lg text-xl md:text-4xl uppercase tracking-tight font-bold whitespace-nowrap">
                      Donate
                    </span>
                  </div>
                  <Icon name="arrow_forward" className="text-3xl md:text-4xl flex-shrink-0 group-hover:translate-x-4 transition-transform" />
                </Link>
              </Reveal>
              <Reveal delay={100}>
                <Link
                  to="/get-involved/career"
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-8 rounded-3xl bg-white text-primary border border-primary/10 hover:border-primary/30 transition-all group shadow-lg"
                >
                  <div className="flex items-center gap-4 md:gap-8 min-w-0">
                    <Icon name="diversity_1" className="text-3xl md:text-5xl flex-shrink-0" />
                    <span className="font-display-lg text-xl md:text-4xl uppercase tracking-tight font-bold whitespace-nowrap">
                      Volunteer
                    </span>
                  </div>
                  <Icon name="arrow_forward" className="text-3xl md:text-4xl flex-shrink-0 group-hover:translate-x-4 transition-transform" />
                </Link>
              </Reveal>
            </div>
          </div>
          <Reveal>
            <div className="soft-modern-card p-8! md:p-12! rotate-3 flex flex-col items-center text-center">
              <h3 className="font-display-lg text-3xl text-on-surface mb-8 uppercase tracking-tight font-bold">
                Scan to Donate
              </h3>
              <div className="w-44 h-44 md:w-64 md:h-64 rounded-3xl overflow-hidden bg-surface-container-low border border-primary/5 p-6 md:p-8 mb-8">
                <img
                  src={contact.gpayQr}
                  alt="QR Code"
                  className="w-full h-full object-contain grayscale"
                />
              </div>
              <p className="font-label-bold text-xs text-on-surface-variant uppercase tracking-[0.3em] mb-8">
                Secure Mobile Donation
              </p>
              <div className="flex gap-4">
                <div className="h-10 w-16 bg-surface-container rounded-lg"></div>
                <div className="h-10 w-16 bg-surface-container rounded-lg"></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>,

    // ===== CONTACT =====
    <section key="contact" className="py-section-padding-mobile md:py-section-padding-desktop bg-white" id="contact">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="lg:col-span-5 bg-primary p-12 md:p-20 text-white flex flex-col justify-between">
            <div>
              <h2 className="font-display-lg text-6xl md:text-8xl leading-[0.9] uppercase mb-16 tracking-tighter font-extrabold">
                LET'S
                <br />
                TALK.
              </h2>
              <div className="space-y-12">
                <div className="flex items-start gap-8">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon name="location_on" className="text-3xl" />
                  </div>
                  <div>
                    <h4 className="font-label-bold text-[10px] uppercase tracking-widest mb-2 text-white/60">
                      Address
                    </h4>
                    <p className="text-xl font-bold uppercase leading-tight">
                      {contact.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-8">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon name="call" className="text-3xl" />
                  </div>
                  <div>
                    <h4 className="font-label-bold text-[10px] uppercase tracking-widest mb-2 text-white/60">
                      Phone
                    </h4>
                    <p className="text-xl font-bold uppercase leading-tight">
                      {contact.phones[0]}
                      <br />
                      {contact.phones[1]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 p-12 md:p-20 bg-surface-container-low">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>,
  ];

  return <>{homeSections}</>;
}

// ---------- CONTACT FORM (shared with Get In Touch) ----------
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="soft-modern-card p-12! text-center bg-white">
        <Icon name="check_circle" className="text-8xl text-primary block mb-6 mx-auto" />
        <h3 className="font-display-lg text-4xl uppercase text-primary tracking-tight mb-4">
          Message Sent!
        </h3>
        <p className="text-xl text-on-surface-variant opacity-90">
          Thank you for reaching out. We will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block font-label-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
            Full Name
          </label>
          <input
            className="w-full bg-white rounded-2xl border-none p-6 text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Your Name"
            type="text"
            required
          />
        </div>
        <div className="space-y-3">
          <label className="block font-label-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
            Email Address
          </label>
          <input
            className="w-full bg-white rounded-2xl border-none p-6 text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Email Address"
            type="email"
            required
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="block font-label-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
          Message
        </label>
        <textarea
          className="w-full bg-white rounded-2xl border-none p-6 text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="How can we help?"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-8 rounded-2xl font-label-bold text-xl hover:bg-secondary transition-all uppercase flex items-center justify-center gap-4 tracking-widest shadow-xl shadow-primary/20"
      >
        <Icon name="send" className="text-2xl" />
        SEND MESSAGE
      </button>
    </form>
  );
}
