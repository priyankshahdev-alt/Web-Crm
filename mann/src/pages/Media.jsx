import { useState, useEffect } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import { gallerySections } from "../data/projects";
import { img } from "../utils/images";
import { usePageContent } from "../hooks/usePageContent";

export default function Media() {
  const [lightbox, setLightbox] = useState(null);
  const content = usePageContent("media");
  const heroTitle = content("page-hero", "heading", "Media & Updates");
  const hero = {
    desktop: img(content("page-hero", "imageUrl", "/media/b1.JPG")),
    mobile: img(content("page-hero", "mobileImageUrl", "/media/b1.JPG")),
  };
  const raw = content("media-gallery", "categories", null);
  const mediaSections = (raw && raw.length ? raw : gallerySections).map((sec) => ({
    ...sec,
    images: (sec.images || []).map((s) => img(s)),
  }));

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <>
      <PageHero desktop={hero.desktop} mobile={hero.mobile} alt={heroTitle} title={heroTitle} />

      <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface">
        <div className="max-w-[1150px] mx-auto space-y-24">
          {mediaSections.map((sec) => (
            <section key={sec.title}>
              <SectionHead tag={sec.tag} title={sec.title} sub={sec.desc} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sec.images.map((src, i) => (
                  <Reveal key={src} delay={(i % 3) * 80}>
                    <figure
                      className="group relative bg-white rounded-2xl border border-primary/5 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.08)] gallery-item cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(138,0,72,0.14)] transition-all"
                      onClick={() => setLightbox(src)}
                    >
                      <img
                        src={src}
                        alt={`${sec.title} ${i + 1}`}
                        loading="lazy"
                        className="h-72 w-full object-cover rounded-t-2xl grayscale hover:grayscale-0 transition-all duration-500"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-primary text-white font-label-bold text-xs uppercase tracking-[0.2em] px-5 py-3 rounded-b-2xl translate-y-full group-hover:translate-y-0 transition-transform">
                        {sec.title}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-5"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-8 text-white bg-primary rounded-2xl w-14 h-14 flex items-center justify-center hover:scale-110 transition-all"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <Icon name="close" className="text-3xl" />
          </button>
          <img
            src={lightbox}
            alt="Preview"
            className="max-h-[85vh] max-w-full rounded-2xl bg-white p-2"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
