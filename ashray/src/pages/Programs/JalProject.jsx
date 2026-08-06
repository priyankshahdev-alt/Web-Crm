import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/jal/imgjal1.jpg", alt: "Clean Drinking Water" },
  { id: 2, src: "/images/jal/imgjal2.jpg", alt: "Water Purification" },
  { id: 3, src: "/images/jal/img3.jpg", alt: "Community Water Access" },
  { id: 4, src: "/images/jal/img4.jpg", alt: "Water Facility Installation" },
  { id: 5, src: "/images/jal/img5.jpg", alt: "Clean Water Distribution" },
  { id: 6, src: "/images/jal/imgjal6.jpg", alt: "Children Drinking Clean Water" },
];

const missions = [
  {
    title: "Clean Water Facilities",
    desc: "Installing clean water facilities, purifiers, and distribution points in areas where the need is most acute across Mumbai, New Mumbai, and Thane.",
  },
  {
    title: "Reaching the Needy",
    desc: "Focusing on underprivileged communities who face the daily struggle of accessing safe and clean water sources, affecting their health and well-being.",
  },
  {
    title: "Sustainable Impact",
    desc: "Working tirelessly to ensure that no one in our community has to go without clean, fresh drinking water — because clean water is the foundation of life.",
  },
];

export default function JalProject() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/jal/jal.jpg" alt="Project Jal" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT JAL</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Clean Water,<br />A Fundamental Right</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Dedicated to providing clean drinking water to underprivileged communities — because clean water is a fundamental human right.
          </p>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Jal</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              In a world where clean drinking water is a basic necessity, the{" "}
              <strong className="text-primary">AFLF (Ashray for Life Foundation)</strong> is committed to making a
              difference through our dedicated project, <strong className="text-primary">"Jal."</strong>
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Clean drinking water is not a luxury; it's a fundamental human right. Yet, many
              underprivileged communities in Mumbai, New Mumbai, and Thane face the daily struggle
              of accessing safe and clean water sources. This challenge not only affects their
              health but also their overall well-being.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through <strong className="text-primary">AFLF Project Jal</strong>, we are committed to installing clean water
              facilities, purifiers, and distribution points in areas where the need is most acute.
              We work tirelessly to ensure that no one in our community has to go without clean,
              fresh drinking water.
            </p>
            <p className="font-body-lg italic text-primary border-l-4 border-secondary-container pl-6 mb-6">
              "Clean water is the foundation of life, and together, we can make a significant impact."
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img
              src="/images/jal/imgjal1.jpg"
              alt="Clean Water"
              className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Our Mission</h2>
            <p className="font-body-lg text-on-surface-variant">Through Project Jal, we are fighting to ensure clean water access for all</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {missions.map((m, i) => (
              <div key={i} className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 hover:-translate-y-1 transition-all">
                <div className="font-headline-lg text-primary/20 font-black mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-headline-md text-xl text-primary mb-3">{m.title}</h3>
                <p className="font-body-md text-on-surface-variant">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMPACT ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="max-w-3xl">
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">OUR IMPACT</span>
            <h2 className="font-headline-lg text-primary mb-6">Bringing Clean Water, Restoring Hope</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through Project Jal, we have witnessed the transformation of communities. Families who
              once struggled to access clean drinking water now have reliable sources of safe water.
              Children who fell ill from waterborne diseases now have the foundation for good health.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every water facility installed, every purifier distributed, every life touched — these
              are the milestones that drive us forward. Together, we are building communities where
              clean water flows freely to every corner.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">50+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Water Facilities Installed</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">10,000+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">People Served</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">25+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Communities Reached</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">24/7</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Community Service</div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Moments of Impact</h2>
            <p className="font-body-lg text-on-surface-variant">Every drop of clean water brings hope and health</p>
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

      {/* ===== CTA ===== */}
      <section className="pb-20 md:pb-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="relative bg-primary rounded-3xl px-8 py-16 md:p-20 text-center overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary-container opacity-20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-headline-lg text-white mb-4">Support Our Mission</h2>
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help us bring clean water to more communities and save lives.</p>
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
