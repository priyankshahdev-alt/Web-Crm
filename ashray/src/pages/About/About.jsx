import { Link } from 'react-router-dom';
import { useSite } from "../../context/SiteContext";
import { getSection } from "../../lib/site";

const sectors = [
  { name: "Education", icon: "school" },
  { name: "Zero Hunger Drive", icon: "restaurant" },
  { name: "Water Conservation", icon: "water_drop" },
  { name: "Women Empowerment", icon: "diversity_3" },
  { name: "Orphanage", icon: "family_home" },
  { name: "Medical Aid", icon: "medical_services" },
  { name: "Old-Age Homes", icon: "elderly" },
];

const DEFAULT_STORY = {
  tag: "Who We Are",
  heading: "Sampoorn Samaj Seva",
  paragraphs: [
    "Ashray for Life Foundation (AFLF), established in 2022 by Mr. Naresh Bhanushali in Vadodara, Gujarat, is a non-profit organization (NGO) dedicated to making a lasting impact on society. Our foundation focuses on seven key sectors: Education, Zero Hunger Drive, Water Conservation, Women Empowerment, Orphanage, Medical Aid, and Old-Age Homes.",
    "We believe in taking \"Sampoorn Samaj Seva\" — holistic social service — and aim to bring meaningful change across all sections of society, from children to the elderly. The Foundation proudly operates with 100% transparency, ensuring that every donation and resource is utilized efficiently and ethically for maximum societal benefit.",
  ],
};

const DEFAULT_MISSION = {
  title: "Our Mission",
  description:
    "To create a Just, Equitable and Humane Society through holistic and sustainable interventions in the seven key sectors of social development.",
};
const DEFAULT_VISION = {
  title: "Our Vision",
  description:
    "To build a self-reliant society where every individual, regardless of their socio-economic status, has access to basic necessities and opportunities for a dignified life.",
};

function About() {
  const { site } = useSite();

  const storyC = getSection(site, "story", "about")?.content ?? {};
  const missionVisionC = getSection(site, "mission-vision", "about")?.content ?? {};

  const storyHeading = storyC.heading || DEFAULT_STORY.heading;
  const storyParagraphs =
    Array.isArray(storyC.paragraphs) && storyC.paragraphs.length > 0
      ? storyC.paragraphs
      : DEFAULT_STORY.paragraphs;

  const mission =
    (typeof missionVisionC.mission === "object" && missionVisionC.mission) || {};
  const vision =
    (typeof missionVisionC.vision === "object" && missionVisionC.vision) || {};
  const missionTitle = mission.title || DEFAULT_MISSION.title;
  const missionDescription = mission.description || DEFAULT_MISSION.description;
  const visionTitle = vision.title || DEFAULT_VISION.title;
  const visionDescription = vision.description || DEFAULT_VISION.description;

  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-on-primary-fixed-variant to-primary" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-secondary-fixed opacity-10 blur-3xl" />

        <div className="relative z-10 max-w-container-max mx-auto px-5 md:px-margin-desktop py-24 md:py-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              groups
            </span>
            <span className="font-label-sm uppercase tracking-widest font-bold">About Us</span>
          </div>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Who We Are</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Ashray for Life Foundation (AFLF) — dedicated to holistic social service through seven key sectors of development.
          </p>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal-on-scroll">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="font-label-md text-primary uppercase tracking-[0.2em]">{storyC.tag || "Our Story"}</span>
            </div>
            <h2 className="font-headline-lg text-primary mb-8">{storyHeading}</h2>
            {storyParagraphs.map((para, i) => (
              <p
                key={i}
                className={`font-body-lg text-on-surface-variant leading-relaxed ${i === 0 ? "mb-6" : ""}`}
              >
                {para}
              </p>
            ))}
          </div>
          <div className="relative reveal-on-scroll">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img
              src="/images/banner1.jpg"
              alt="Ashray community"
              className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
            />
            <div className="absolute -bottom-8 -left-8 bg-primary text-white p-8 rounded-3xl shadow-2xl">
              <span className="font-headline-lg text-secondary-container block">2022</span>
              <span className="font-label-sm uppercase tracking-widest opacity-80">Established</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTORS ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
            <h2 className="font-headline-lg text-primary mb-4">Our Seven Pillars</h2>
            <p className="font-body-lg text-on-surface-variant">Focusing our efforts where they are needed the most</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 reveal-on-scroll">
            {sectors.map((s, i) => (
              <div
                key={i}
                className="group bg-surface-container rounded-2xl border border-outline-variant subtle-shadow hover:border-primary/20 hover:-translate-y-1 transition-all p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-secondary-container transition-colors">
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <h3 className="font-headline-md text-label-md text-on-surface-variant font-semibold">{s.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary-container opacity-15 blur-3xl" />
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-10 md:p-12 reveal-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container/20 text-secondary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">track_changes</span>
              </div>
              <h2 className="font-headline-lg text-white mb-4">{missionTitle}</h2>
              <p className="font-body-lg text-white/85 leading-relaxed">
                {missionDescription}
              </p>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-10 md:p-12 md:translate-y-8 reveal-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/20 text-secondary-fixed flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">visibility</span>
              </div>
              <h2 className="font-headline-lg text-white mb-4">{visionTitle}</h2>
              <p className="font-body-lg text-white/85 leading-relaxed">
                {visionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 reveal-on-scroll">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
              <img
                src="/images/team/naresh-bhanushali.jpg"
                alt="Mr. Naresh Bhanushali"
                className="rounded-3xl shadow-2xl w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 reveal-on-scroll">
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">Founder</span>
            <h2 className="font-headline-lg text-primary mb-6">Mr. Naresh Bhanushali</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Shri Naresh Bhanushali, the founder of Ashray for Life Foundation (AFLF), is a passionate
              social worker from Vadodara, Gujarat. His vision is to create a self-sustaining and inclusive
              support system for the most vulnerable members of society.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-10 leading-relaxed">
              Under his leadership, AFLF has grown from a vision into a movement that touches lives across
              all seven sectors of social impact. He is supported by a dedicated team of trustees and
              professionals who ensure the foundation's mission is carried forward effectively.
            </p>
            <Link
              to="/about/management-team"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-full font-label-md font-bold shadow-xl hover:bg-on-primary-fixed-variant hover:-translate-y-0.5 transition-all"
            >
              Meet Our Team
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
