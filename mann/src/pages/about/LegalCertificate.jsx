import PageHero from "../../components/PageHero";
import SectionHead from "../../components/SectionHead";
import Icon from "../../components/Icon";
import { img } from "../../utils/images";
import { usePageContent } from "../../hooks/usePageContent";

const fallbackCerts = [
  { icon: "description", title: "PAN Certificate", href: "/pdf/pan-card.pdf" },
  { icon: "handshake", title: "NGO Registration", href: "/pdf/ngo-registration.pdf" },
];

export default function LegalCertificate() {
  const content = usePageContent("legal-certificate");
  const heroTitle = content("page-hero", "heading", "Certificates");
  const hero = {
    desktop: img(content("page-hero", "imageUrl", "/about/hero3.jpeg")),
    mobile: img(content("page-hero", "mobileImageUrl", "/about/mobile-slide3.jpeg")),
  };
  const certs = content("certificates", "items", fallbackCerts) || fallbackCerts;

  return (
    <>
      <PageHero
        desktop={hero.desktop}
        mobile={hero.mobile}
        alt={heroTitle}
        title={heroTitle}
      />

      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[900px] mx-auto text-center">
          <SectionHead
            tag={content("certificates", "tag", "Legal & Compliance Documents")}
            title={content("certificates", "title", "Our Certificates")}
            sub={content("certificates", "sub") || "Transparency, compliance, and accountability are at the core of MANN Care Foundation. Explore our registration and certification documents."}
          />

          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {certs.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)] p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(138,0,72,0.14)] transition-all block text-center group"
              >
                <Icon name={c.icon} className="text-7xl text-primary block mb-5 mx-auto" />
                <h3 className="font-display-lg font-bold text-2xl uppercase text-on-surface tracking-tight mb-4">
                  {c.title}
                </h3>
                <span className="font-label-bold text-sm uppercase tracking-[0.15em] text-primary flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                  View Document
                  <Icon name="arrow_forward" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
