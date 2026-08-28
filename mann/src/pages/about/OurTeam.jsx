import PageHero from "../../components/PageHero";
import SectionHead from "../../components/SectionHead";
import Reveal from "../../components/Reveal";
import { team } from "../../data/projects";
import { img } from "../../utils/images";
import { usePageContent } from "../../hooks/usePageContent";

const fallbackMembers = team.map((m) => ({ image: m.img, name: m.name, role: m.role }));

export default function OurTeam() {
  const content = usePageContent("our-team");
  const heroTitle = content("page-hero", "heading", "Our Team");
  const hero = {
    desktop: img(content("page-hero", "imageUrl", "/about/hero2.jpeg")),
    mobile: img(content("page-hero", "mobileImageUrl", "/about/mobile-slide2.jpeg")),
  };
  const members = content("team-members", "members", fallbackMembers) || fallbackMembers;

  return (
    <>
      <PageHero
        desktop={hero.desktop}
        mobile={hero.mobile}
        alt={heroTitle}
        title={heroTitle}
      />

      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface" id="team">
        <div className="max-w-[1150px] mx-auto">
          <SectionHead
            tag={content("team-heading", "tag", "The People Behind The Mission")}
            title={content("team-heading", "title", "Our Team")}
            sub={content("team-heading", "sub") || "Compassionate leaders working relentlessly to empower women, children, and communities."}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {members.map((m, i) => (
              <Reveal key={m.name || i} delay={i * 80} className="w-full max-w-sm">
                <div className="bg-white rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(138,0,72,0.14)] transition-all">
                  <img src={img(m.image)} alt={m.name} className="w-full h-80 object-cover" />
                  <div className="p-7 text-center">
                    <h3 className="font-display-lg font-bold text-2xl uppercase text-on-surface tracking-tight">
                      {m.name}
                    </h3>
                    <p className="font-label-bold text-xs tracking-[0.2em] text-primary mt-3 bg-secondary-fixed inline-block px-4 py-1.5 rounded-full">
                      {m.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
