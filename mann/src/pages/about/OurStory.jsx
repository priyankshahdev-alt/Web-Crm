import { Link } from "react-router-dom";
import PageHero from "../../components/PageHero";
import SectionHead from "../../components/SectionHead";
import Reveal from "../../components/Reveal";
import Icon from "../../components/Icon";
import { img } from "../../utils/images";
import { usePageContent } from "../../hooks/usePageContent";

const fallbackValues = [
  { icon: "restaurant", title: "Nutrition", desc: "Ensuring no woman or child is deprived of nutritious food." },
  { icon: "school", title: "Education", desc: "Creating equal learning opportunities for every child." },
  { icon: "medical_services", title: "Health & Hygiene", desc: "Promoting preventive healthcare and healthy living practices." },
  { icon: "female", title: "Women Empowerment", desc: "Building confidence, skills, independence, and leadership." },
];

const cardCls =
  "bg-white rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)]";

export default function OurStory() {
  const content = usePageContent("our-story");
  const hero = {
    title: content("page-hero", "heading", "Our Story"),
    desktop: content("page-hero", "imageUrl") && img(content("page-hero", "imageUrl")),
    mobile: content("page-hero", "mobileImageUrl") && img(content("page-hero", "mobileImageUrl")),
  };
  const heroImgFallback = { desktop: img("/about/hero1.jpeg"), mobile: img("/about/mobile-slide1.jpeg") };
  const values = content("values", "items", fallbackValues);
  const storyParagraphs = content("story", "paragraphs", [
    "MANN Care Foundation believes that true social progress begins with the well-being of women and children. A healthy woman nurtures a strong family, and an educated child shapes a brighter future.",
    "Guided by this belief, the Foundation was established to address essential yet often overlooked needs such as nutrition, education, menstrual hygiene, healthcare awareness, and women empowerment.",
    "Through compassionate action and community-driven solutions, MANN Care Foundation works to create meaningful and lasting change in the lives of underserved individuals and families.",
  ]);
  const vision = content("mission-vision", "vision", {
    title: "Our Vision",
    description: "To build an inclusive society where every woman and child has access to opportunities, resources, health, education, and dignity.",
  });
  const mission = content("mission-vision", "mission", {
    title: "Our Mission",
    description: "To empower women and children through sustainable programs focused on nutrition, education, health, hygiene, and self-reliance.",
  });

  return (
    <>
      <PageHero
        desktop={hero.desktop || heroImgFallback.desktop}
        mobile={hero.mobile || heroImgFallback.mobile}
        alt={hero.title || "Our Story"}
        title={hero.title || "Our Story"}
      />

      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[900px] mx-auto text-center space-y-6">
          <SectionHead
            tag={content("home-intro", "tag", "Empowering Women & Children")}
            title={content("home-intro", "title", "Transforming Communities")}
            align="center"
          />
          <p className="text-2xl md:text-3xl text-on-surface-variant leading-snug">
            {content("home-intro", "tagline") || "Building a future where every woman lives with dignity and every child has the opportunity to learn, grow, and thrive."}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16 px-6 lg:px-8 bg-surface-container-low">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className={`${cardCls} p-6 md:p-10`}>
              <h2 className="font-display-lg font-extrabold text-4xl md:text-5xl uppercase text-on-surface tracking-tight mb-8 text-center">
                {content("story", "heading", "How It All Began")}
              </h2>
              <div className="space-y-8">
                {storyParagraphs.map((p, i) => (
                  <p key={i} className="flex items-start gap-5 text-xl text-on-surface-variant leading-relaxed">
                    <Icon name="arrow_right_alt" className="text-primary mt-1 shrink-0" />
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface-container-high">
        <div className="max-w-[1000px] mx-auto">
          <SectionHead tag="Guiding Principles" title="Vision & Mission" />
          <div className="grid md:grid-cols-2 gap-10">
            <Reveal>
              <div className={`${cardCls} p-8 text-center h-full`}>
                <Icon name="public" className="text-7xl text-primary block mb-6 mx-auto" />
                <h3 className="font-display-lg font-extrabold text-3xl uppercase text-on-surface tracking-tight mb-4">{vision.title}</h3>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  {vision.description}
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className={`${cardCls} p-8 text-center h-full`}>
                <Icon name="favorite" className="text-7xl text-primary block mb-6 mx-auto" />
                <h3 className="font-display-lg font-extrabold text-3xl uppercase text-on-surface tracking-tight mb-4">{mission.title}</h3>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  {mission.description}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[1100px] mx-auto">
          <SectionHead tag="What Drives Us" title="Our Core Focus Areas" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className={`${cardCls} p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(138,0,72,0.14)] transition-all h-full text-center`}>
                  <Icon name={v.icon} className="text-6xl text-primary block mb-5 mx-auto" />
                  <h3 className="font-display-lg font-bold text-2xl uppercase text-on-surface tracking-tight mb-3">
                    {v.title}
                  </h3>
                  <p className="text-base text-on-surface-variant">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display-lg font-extrabold text-5xl md:text-6xl uppercase tracking-tight mb-4">
              {content("cta", "heading", "Be A Part Of The Change")}
            </h2>
            <p className="text-xl text-white/90 max-w-[600px]">
              {content("cta", "paragraph") || "Together, we can build healthier families, stronger communities, and brighter futures for women and children."}
            </p>
          </div>
          <Link
            to={content("cta", "buttonUrl", "/get-involved/donate-online")}
            className="bg-white text-primary font-label-bold text-base uppercase tracking-[0.15em] px-8 py-4 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] hover:scale-105 transition-all shrink-0"
          >
            {content("cta", "buttonLabel", "Support Our Mission")}
          </Link>
        </div>
      </section>
    </>
  );
}
