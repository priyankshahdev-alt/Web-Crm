import { useParams, Link, Navigate } from "react-router-dom";
import { projects } from "../../data/projects";
import PageHero from "../../components/PageHero";
import SectionHead from "../../components/SectionHead";
import Reveal from "../../components/Reveal";
import Icon from "../../components/Icon";
import { usePageContent } from "../../hooks/usePageContent";

const cardCls =
  "bg-white rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)]";

export default function ProjectDetail() {
  const { slug } = useParams();
  const staticProject = projects.find((x) => x.slug === slug?.toLowerCase());
  const content = usePageContent("project-" + slug);

  if (!staticProject) return <Navigate to="/" replace />;

  const p = staticProject;
  const name = content("project-detail", "name", p.name);
  const badge = content("project-detail", "badge", p.badge);
  const subtitle = content("project-detail", "subtitle", p.subtitle);
  const heroImg = content("project-detail", "heroImg", p.heroImg);
  const heroImgMobile = content("project-detail", "heroImgMobile", p.heroImgMobile);
  const cardTitle = content("project-detail", "cardTitle", p.card.title);
  const cardText = content("project-detail", "cardText", p.card.text);
  const aboutHeading = content("project-detail", "aboutHeading", p.aboutHeading);
  const mission = content("project-detail", "mission", p.mission);
  const whyItMatters = content("project-detail", "whyItMatters", p.whyItMatters);
  const servicesHeading = content("project-detail", "servicesHeading", p.servicesHeading);
  const servicesTag = content("project-detail", "servicesTag", p.servicesTag);
  const services = content("project-detail", "services", p.services);
  const beneficiariesHeading = content("project-detail", "beneficiariesHeading", p.beneficiariesHeading);
  const beneficiariesTag = content("project-detail", "beneficiariesTag", p.beneficiariesTag);
  const beneficiaries = content("project-detail", "beneficiaries", p.beneficiaries);
  const impactHeading = content("project-detail", "impactHeading", p.impactHeading);
  const impact = content("project-detail", "impact", p.impact);
  const ctaTitle = content("project-detail", "ctaTitle", p.cta.title);
  const ctaText = content("project-detail", "ctaText", p.cta.text);
  const ctaBtn = content("project-detail", "ctaBtn", p.cta.btn);

  return (
    <>
      <PageHero desktop={heroImg} mobile={heroImgMobile ?? heroImg} alt={name} title={name} />

      {/* HERO */}
      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[900px] mx-auto text-center space-y-8">
          <span className="inline-block px-4 py-1.5 bg-secondary-fixed text-primary font-label-bold text-xs uppercase tracking-widest rounded-full">
            {badge}
          </span>
          <h1 className="font-display-lg font-extrabold text-5xl md:text-8xl text-on-surface leading-[0.9] tracking-tighter uppercase">
            {name}
          </h1>
          <p className="text-2xl md:text-3xl text-on-surface-variant leading-snug">{subtitle}</p>

          <Reveal>
            <div className={`${cardCls} p-6 md:p-8 text-left`}>
              <h2 className="font-display-lg font-extrabold text-3xl md:text-4xl uppercase text-on-surface tracking-tight mb-6">
                {cardTitle}
              </h2>
              <p className="flex items-start gap-4 text-lg md:text-xl text-on-surface-variant leading-relaxed">
                <Icon name="arrow_right_alt" className="text-primary mt-1 shrink-0" />
                {cardText}
              </p>
              <a
                href="#pp-impact"
                className="inline-flex items-center gap-3 mt-10 bg-primary text-white font-label-bold text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-2xl shadow-[0_10px_30px_-5px_rgba(138,0,72,0.4)] hover:bg-primary-container hover:scale-[1.02] transition-all"
              >
                Explore Impact
                <Icon name="arrow_forward" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-10 md:py-16 px-6 lg:px-8 bg-surface-container-low">
        <div className="max-w-[1000px] mx-auto">
          <SectionHead tag="About The Initiative" title={aboutHeading} />
          <div className="grid md:grid-cols-2 gap-10">
            <Reveal>
              <div className={`${cardCls} p-8 hover:-translate-y-2 transition-all h-full`}>
                <Icon name="track_changes" className="text-6xl text-primary block mb-5" />
                <h3 className="font-display-lg font-extrabold text-3xl uppercase text-on-surface tracking-tight mb-4">
                  Our Mission
                </h3>
                <p className="text-lg text-on-surface-variant leading-relaxed">{mission}</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className={`${cardCls} p-8 hover:-translate-y-2 transition-all h-full`}>
                <Icon name="lightbulb" className="text-6xl text-primary block mb-5" />
                <h3 className="font-display-lg font-extrabold text-3xl uppercase text-on-surface tracking-tight mb-4">
                  Why It Matters
                </h3>
                <p className="text-lg text-on-surface-variant leading-relaxed">{whyItMatters}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[1100px] mx-auto">
          <SectionHead tag={servicesTag} title={servicesHeading} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <Reveal key={s.title || i} delay={i * 80}>
                <div className={`${cardCls} p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(138,0,72,0.14)] transition-all h-full text-center`}>
                  <span className="text-5xl block mb-5">{s.icon}</span>
                  <h3 className="font-display-lg font-bold text-2xl uppercase text-on-surface tracking-tight mb-3">
                    {s.title}
                  </h3>
                  <p className="text-base text-on-surface-variant">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIARIES */}
      <section className="py-10 md:py-16 px-6 lg:px-8 bg-surface-container-low">
        <div className="max-w-[1000px] mx-auto">
          <SectionHead tag={beneficiariesTag} title={beneficiariesHeading} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficiaries.map((b, i) => (
              <div
                key={typeof b === "string" ? b : i}
                className="bg-white rounded-2xl border border-primary/5 p-6 font-label-bold text-base uppercase tracking-[0.1em] text-on-surface shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)] text-center"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface" id="pp-impact">
        <div className="max-w-[1100px] mx-auto">
          <SectionHead tag="Impact Vision" title={impactHeading} />
          <div className="grid md:grid-cols-3 gap-8">
            {impact.map((im, i) => (
              <Reveal key={im.title || i} delay={i * 80}>
                <div className={`${cardCls} p-8 h-full`}>
                  <Icon name="trending_up" className="text-6xl text-primary block mb-5" />
                  <h3 className="font-display-lg font-bold text-2xl uppercase text-on-surface tracking-tight mb-3">
                    {im.title}
                  </h3>
                  <p className="text-base text-on-surface-variant leading-relaxed">{im.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display-lg font-extrabold text-5xl md:text-6xl uppercase tracking-tight mb-4">
              {ctaTitle}
            </h2>
            <p className="text-xl text-white/90 max-w-[600px]">{ctaText}</p>
          </div>
          <Link
            to="/get-involved/donate-online"
            className="inline-flex items-center gap-3 bg-white text-primary font-label-bold text-base uppercase tracking-[0.15em] px-8 py-4 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] hover:scale-105 transition-all shrink-0"
          >
            <Icon name="favorite" />
            {ctaBtn}
          </Link>
        </div>
      </section>
    </>
  );
}
