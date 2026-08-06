import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/NariTarang/img2.jpg", alt: "Women Empowerment" },
  { id: 2, src: "/images/NariTarang/img3.jpg", alt: "Vocational Training" },
  { id: 3, src: "/images/NariTarang/img4.jpg", alt: "Skill Development" },
  { id: 4, src: "/images/NariTarang/img5.jpg", alt: "Women Entrepreneurs" },
  { id: 5, src: "/images/NariTarang/img6.jpg", alt: "Community Support" },
  { id: 6, src: "/images/NariTarang/img1.jpg", alt: "Education For Girls" },
];

const focusAreas = [
  {
    title: "Education for Girls",
    desc: "We believe education is the key to empowerment. Through our initiatives, we provide girls with access to quality education, opening doors to a world of opportunities and knowledge.",
  },
  {
    title: "Self-Defense Training",
    desc: "Safety is paramount. We equip girls and women with self-defense techniques, ensuring they can protect themselves and stand up against any form of threat.",
  },
  {
    title: "Vocational Training",
    desc: "We offer training programs in sewing, beauty, candle making, and small business management. These skills boost self-confidence and create pathways to financial independence.",
  },
  {
    title: "Entrepreneurship",
    desc: "Our training nurtures the entrepreneurial spirit. We provide women with the tools and knowledge to start and manage their small businesses, fostering economic self-sufficiency.",
  },
  {
    title: "Health & Well-being",
    desc: "Empowerment also involves taking care of physical and mental well-being. We raise awareness about women's health issues and provide resources for overall wellness.",
  },
  {
    title: "Join Our Movement",
    desc: "Women's empowerment is a collective effort. You can support AFLF's mission by contributing, volunteering, or spreading awareness. Together, we can light the path to independence.",
  },
];

export default function WomenEmpowerment() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* HERO */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/NariTarang/naariiiii.jpg" alt="Women Empowerment" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT NARI TARANG</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Empowering Women,<br />Transforming Communities</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Enabling women to take charge of their lives, make independent choices, and lead healthier, more fulfilling lives.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Nari Tarang</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              At <strong className="text-primary">AFLF (Ashray for Life Foundation)</strong>, we are dedicated to the cause
              of women's empowerment through Project <strong className="text-primary">"Nari Tarang"</strong> — striving to
              enable women to take charge of their lives, make independent choices, and lead
              healthier, more fulfilling lives.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Empowering women is not just a choice; it's a necessity. We believe that empowered
              women are the cornerstone of a stronger, more equitable society. Through our
              comprehensive initiatives, we light the path to independence and brighter futures
              for women and girls.
            </p>
            <p className="font-body-lg italic text-primary border-l-4 border-secondary-container pl-6 mb-6">
              "Empower women, empower the world. At AFLF, we believe that every woman has the
              power to shape her destiny."
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img src="/images/NariTarang/Q9.jpg" alt="Women Empowerment" className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover" />
          </div>
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Our Focus Areas</h2>
            <p className="font-body-lg text-on-surface-variant">
              Through Project Nari Tarang, we create lasting change for women and girls
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {focusAreas.map((m, i) => (
              <div key={i} className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 hover:-translate-y-1 transition-all">
                <div className="font-headline-lg text-primary/20 font-black mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-headline-md text-xl text-primary mb-3">{m.title}</h3>
                <p className="font-body-md text-on-surface-variant">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="max-w-3xl">
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">OUR IMPACT</span>
            <h2 className="font-headline-lg text-primary mb-6">Transforming Lives, Building Futures</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through Project Nari Tarang, we have witnessed the transformation of countless women.
              Girls who once had no access to education now dream of careers. Women who depended on
              others now run their own businesses. Communities once held back by inequality now
              thrive with empowered women leading the way.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every girl educated, every woman trained, every life empowered — these are the
              milestones that drive us forward. Together, we are building a world where every
              woman has the power to shape her own destiny.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">500+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Women Empowered</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">200+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Girls Educated</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">100+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Businesses Started</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">24/7</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Community Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Moments of Empowerment</h2>
            <p className="font-body-lg text-on-surface-variant">Every story of empowerment inspires a brighter tomorrow</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
            {galleryImages.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-3xl aspect-[4/3] subtle-shadow">
                <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end p-6">
                  <span className="text-white font-label-md font-bold">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="relative bg-primary rounded-3xl px-8 py-16 md:p-20 text-center overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary-container opacity-20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-headline-lg text-white mb-4">Support Our Mission</h2>
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help us empower more women and build a more equitable society.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate" className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-full font-label-md font-bold shadow-xl hover:-translate-y-0.5 transition-all">Donate Now</Link>
                <Link to="/volunteer" className="bg-white/10 text-white border border-white/25 px-10 py-4 rounded-full font-label-md font-bold hover:bg-white hover:text-primary transition-all">Become a Volunteer</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
