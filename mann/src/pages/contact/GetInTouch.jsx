import PageHero from "../../components/PageHero";
import Reveal from "../../components/Reveal";
import SectionHead from "../../components/SectionHead";
import Icon from "../../components/Icon";
import { ContactForm } from "../Home";
import { img } from "../../utils/images";
import { usePageContent } from "../../hooks/usePageContent";

const fallbackCards = [
  { icon: "business", title: "Registered Office", lines: ["1708, One World, S.V. Road", "Near N.M. High School", "Malad West, Mumbai – 400064"] },
  { icon: "call", title: "Contact", lines: ["Phone: +91 7039006300", "Email: manncarefoundation@gmail.com"] },
  { icon: "share", title: "Social Media", lines: ["Instagram: @Mann.Care.Foundation", "Facebook: Mann Care Foundation", "LinkedIn: Mann Care Foundation"] },
];

const cardCls =
  "bg-white rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)]";

export default function GetInTouch() {
  const content = usePageContent("get-in-touch");
  const heroTitle = content("page-hero", "heading", "Get In Touch");
  const hero = {
    desktop: img(content("page-hero", "imageUrl", "/contact/hero1.jpeg")),
    mobile: img(content("page-hero", "mobileImageUrl", "/contact/mobile-slide1.jpeg")),
  };

  const rawItems = content("contact-info", "items", null);
  const cards = (rawItems && rawItems.length
    ? rawItems.map((it) => ({
        icon: it.icon,
        title: it.title,
        lines: typeof it.value === "string" ? it.value.split("\n") : [it.value],
      }))
    : fallbackCards).slice(0, 3);

  const about = {
    tag: content("about-text", "tag", "Our Promise"),
    heading: content("about-text", "heading", "About Us"),
    paragraphs: content("about-text", "paragraphs") || [
      "Mann Care Foundation is committed to empowering underprivileged and marginalized individuals through education, healthcare, livelihood support, skill development, and community welfare initiatives.",
      "Our mission is to create opportunities, restore dignity, and build a more inclusive and compassionate society.",
    ],
  };

  const mapEmbed = content("map", "embedUrl", "https://www.google.com/maps?q=Malad%20West%20Mumbai&output=embed");
  const formHeading = content("form", "heading", "Contact Us");
  const formTag = content("form", "subheading", "Get In Touch");

  return (
    <>
      <PageHero desktop={hero.desktop} mobile={hero.mobile} alt={heroTitle} title={heroTitle} />

      {/* Contact cards */}
      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[1100px] mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((c, i) => (
            <Reveal key={c.title || i} delay={i * 80}>
              <div className={`${cardCls} p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(138,0,72,0.14)] transition-all h-full text-center`}>
                <Icon name={c.icon} className="text-6xl text-primary block mb-4 mx-auto" />
                <h3 className="font-display-lg font-bold text-2xl uppercase text-on-surface tracking-tight mb-3">
                  {c.title}
                </h3>
                {(c.lines || []).map((l, j) => (
                  <p key={j} className="text-base text-on-surface-variant">{l}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-10 md:py-16 px-6 lg:px-8 bg-surface-container-low">
        <div className="max-w-[850px] mx-auto text-center">
          <SectionHead tag={about.tag} title={about.heading} align="center" />
          {about.paragraphs.map((p, i) => (
            <p key={i} className="text-xl text-on-surface-variant leading-relaxed mb-4">{p}</p>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[1000px] mx-auto">
          <SectionHead tag="Find Us" title={content("map", "heading", "Our Location")} align="center" />
          <div className="rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)] overflow-hidden bg-white p-2">
            <iframe
              title="Mann Care Foundation Location"
              src={mapEmbed}
              className="w-full h-[380px] border-0 rounded-xl"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-10 md:py-16 px-6 lg:px-8 bg-surface-container-low" id="contact">
        <div className="max-w-[1200px] mx-auto">
          <SectionHead tag={formTag} title={formHeading} align="center" />

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Reveal className="space-y-6">
              <div className={`${cardCls} p-6 flex gap-5`}>
                <Icon name="location_on" className="text-4xl text-primary shrink-0" />
                <div>
                  <strong className="block mb-1 text-lg text-on-surface">Address</strong>
                  <p className="text-base text-on-surface-variant">
                    Office No. 1708, One World, S.V.Road, Near N. M. High School, Malad (West),
                    Mumbai – 400064
                  </p>
                </div>
              </div>
              <div className={`${cardCls} p-6 flex gap-5`}>
                <Icon name="call" className="text-4xl text-primary shrink-0" />
                <div>
                  <strong className="block mb-1 text-lg text-on-surface">Phone</strong>
                  <p className="text-base text-on-surface-variant">
                    <a href="tel:+917039006300" className="text-primary hover:underline underline-offset-4">+91 70390 06300</a>
                    <br />
                    <a href="tel:+917039006400" className="text-primary hover:underline underline-offset-4">+91 70390 06400</a>
                  </p>
                </div>
              </div>
              <div className={`${cardCls} p-6 flex gap-5`}>
                <Icon name="mail" className="text-4xl text-primary shrink-0" />
                <div>
                  <strong className="block mb-1 text-lg text-on-surface">Email</strong>
                  <p className="text-base text-on-surface-variant">
                    <a href="mailto:manncarefoundation@gmail.com" className="text-primary hover:underline underline-offset-4">
                      manncarefoundation@gmail.com
                    </a>
                    <br />
                    <a href="mailto:info.manncarefoundation@gmail.com" className="text-primary hover:underline underline-offset-4">
                      info.manncarefoundation@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className={`${cardCls} p-8 md:p-12`}>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
