import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/Sahara/img1.jpg", alt: "Medical care" },
  { id: 2, src: "/images/Sahara/img2.jpg", alt: "Surgery support" },
  { id: 3, src: "/images/Sahara/img3.jpg", alt: "Hospital care" },
  // { id: 4, src: "/images/Sahara/img4.jpg", alt: "Child healthcare" },
  // { id: 5, src: "/images/Sahara/img5.jpg", alt: "Medical treatment" },
  // { id: 6, src: "/images/Sahara/img6.jpg", alt: "Hope and healing" },
];

const missions = [
  {
    title: "Promoting Independence",
    desc: "We empower disabled and specially-abled individuals by providing resources that help them live independently and with dignity.",
  },
  {
    title: "Mobility & Accessibility Support",
    desc: "Through wheelchairs and tricycles, we enhance mobility, enabling beneficiaries to participate actively in daily life and society.",
  },
  {
    title: "Sustainable Livelihood Opportunities",
    desc: "By providing sewing machines, flour mills, and skill support, we help individuals generate income and build a self-reliant future.",
  },
];

export default function Medical() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/Sahara/Sahara.jpg" alt="Project Life-Line" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT LIFE-LINE</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Saving Lives,<br />One Surgery at a Time</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Every heartbeat counts. Project Lifeline is our unwavering commitment to providing
            a lifeline of hope to the poorest and most vulnerable among us.
          </p>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Sahara</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              At <strong className="text-primary">AFLF (Ashray For Life Foundation)</strong>, we believe that every
              individual deserves the opportunity to live with dignity, independence, and
              self-confidence. <strong className="text-primary">Project SAHARA</strong> is dedicated to empowering
              disabled and specially-abled individuals by providing essential resources that
              help them lead self-reliant and fulfilling lives.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through this initiative, we provide livelihood and mobility support such as
              sewing machines, flour mills, and wheelchairs. These resources
              enable beneficiaries to earn a sustainable income, improve their mobility, and
              actively participate in society with greater confidence and independence.
            </p>
            <p className="font-body-lg italic text-primary border-l-4 border-secondary-container pl-6 mb-6">
              "Empowering abilities, restoring dignity, and creating pathways to
              independence for a brighter tomorrow."
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img
              src="/images/Sahara/img4.jpg"
              alt="Medical care"
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
            <p className="font-body-lg text-on-surface-variant">Enabling independence and dignity for disabled and specially-abled individuals.</p>
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
            <h2 className="font-headline-lg text-primary mb-6">Transforming Lives Through Independence</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through Project SAHARA, disabled and specially-abled individuals have gained
              greater mobility, confidence, and opportunities for self-reliance. Access to
              livelihood resources has helped beneficiaries support themselves and their
              families with dignity.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every wheelchair delivered, every tricycle provided, and every livelihood tool
              distributed represents a step toward empowerment. Together, we are building a
              more inclusive society where abilities are strengthened and lives are transformed.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">500+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Lives Empowered</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">100+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Mobility Aids Provided</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">200+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Livelihood Tools Distributed</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">24/7</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Families Supported</div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Moments of Healing</h2>
            <p className="font-body-lg text-on-surface-variant">Every life saved is a testament to the power of compassion</p>
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
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help empower disabled and specially-abled individuals with mobility, livelihood opportunities, and a life of dignity..</p>
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
