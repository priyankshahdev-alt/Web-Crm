import { useState } from "react";
import PageHero from "../../components/PageHero";
import SectionHead from "../../components/SectionHead";
import Icon from "../../components/Icon";
import { img } from "../../utils/images";
import { usePageContent } from "../../hooks/usePageContent";

const fallbackPoints = [
  { icon: "🌸", title: "Purpose Driven Work", desc: "Make a real difference through projects that transform lives." },
  { icon: "📚", title: "Growth & Learning", desc: "Gain valuable experience while working on impactful initiatives." },
  { icon: "🤝", title: "Collaborative Culture", desc: "Work alongside passionate people who care about social change." },
  { icon: "❤️", title: "Meaningful Impact", desc: "Your work directly contributes to stronger communities." },
];

export default function Career() {
  const [submitted, setSubmitted] = useState(false);
  const content = usePageContent("career");
  const heroTitle = content("page-hero", "heading", "Careers");
  const hero = {
    desktop: img(content("page-hero", "imageUrl", "/get-involved/hero4.jpeg")),
    mobile: img(content("page-hero", "mobileImageUrl", "/get-involved/mobile-slide4.jpeg")),
  };
  const points = content("career-points", "items", fallbackPoints) || fallbackPoints;
  const inputCls =
    "w-full rounded-2xl border border-primary/10 bg-surface-container-low p-5 text-lg text-on-surface outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50";

  return (
    <>
      <PageHero desktop={hero.desktop} mobile={hero.mobile} alt={heroTitle} title={heroTitle} />

      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[900px] mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-secondary-fixed text-primary font-label-bold text-xs uppercase tracking-widest rounded-full mb-6">
            {content("career-hero", "tag", "Join Our Team")}
          </span>
          <h1 className="font-display-lg font-extrabold text-6xl md:text-8xl text-on-surface leading-[0.9] tracking-tighter uppercase mb-6">
            {content("career-hero", "title", "Turn Your Passion Into Impact")}
          </h1>
          <p className="text-2xl md:text-3xl text-on-surface-variant">
            {content("career-hero", "paragraph") || "Join MANN CARE FOUNDATION and become part of a mission dedicated to empowering women, educating children, promoting health, and creating lasting change in communities across India."}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16 px-6 lg:px-8 bg-surface-container-low">
        <div className="max-w-[1150px] mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <SectionHead tag={content("career-points", "tag", "Careers at MANN CARE FOUNDATION")} title={content("career-points", "heading", "Build a Career That Creates Impact")} align="left" />
            <p className="text-xl text-on-surface-variant mb-6">
              {content("career-points", "paragraph") || "At MANN CARE FOUNDATION, every role contributes to creating meaningful change in the lives of women, children, and communities in need. Join a team that works with compassion, purpose, and dedication to build a better tomorrow."}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {points.map((pt) => (
                <div key={pt.title} className="bg-white rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)] p-6 hover:-translate-y-2 transition-all">
                  <span className="text-3xl block mb-3">{pt.icon}</span>
                  <h3 className="font-label-bold text-base uppercase tracking-[0.08em] text-on-surface mb-2">
                    {pt.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant">{pt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)] p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-10">
                <Icon name="check_circle" className="text-7xl text-primary mb-4" />
                <h2 className="font-display-lg font-extrabold text-4xl uppercase text-on-surface tracking-tight mb-2">
                  Application Sent!
                </h2>
                <p className="text-lg text-on-surface-variant">
                  Thank you for applying. We will contact you soon.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display-lg font-extrabold text-4xl uppercase text-on-surface tracking-tight mb-2">
                  {content("career-points", "formTitle", "Apply Now")}
                </h2>
                <p className="text-lg text-on-surface-variant mb-5">
                  {content("career-points", "formHint") || "Take the first step towards a meaningful career."}
                </p>
                <div className="space-y-5">
                  <input type="text" placeholder="Your Full Name" className={inputCls} required />
                  <input type="email" placeholder="Email Address" className={inputCls} required />
                  <input type="tel" placeholder="Phone Number" className={inputCls} required />
                  <textarea rows={5} placeholder="Tell us about yourself" className={inputCls}></textarea>
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="w-full rounded-2xl bg-primary text-white py-5 font-label-bold text-lg uppercase tracking-widest transition-all hover:bg-primary-container hover:scale-[1.01] shadow-[0_10px_30px_-5px_rgba(138,0,72,0.4)]"
                  >
                    {content("career-points", "buttonLabel", "Send Application")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
