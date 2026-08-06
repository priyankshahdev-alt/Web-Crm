import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/Ashray/img1.jpg", alt: "Ashray Project" },
  { id: 2, src: "/images/Ashray/img2.jpg", alt: "Ashray Project" },
  { id: 3, src: "/images/Ashray/img3.jpg", alt: "Ashray Project" },
  { id: 4, src: "/images/Ashray/img4.jpg", alt: "Ashray Project" },
  { id: 5, src: "/images/Ashray/img5.jpg", alt: "Ashray Project" },
  { id: 6, src: "/images/Ashray/img6.jpg", alt: "Ashray Project" },
];

const commitments = [
  {
    title: "Free Education",
    desc: "We offer free education to all children in the Ashra shelter, ensuring that financial constraints do not hinder their access to quality learning.",
  },
  {
    title: "School Supplies",
    desc: "We provide school bags and stationery to all the children, equipping them with the tools they need to excel in their studies.",
  },
  {
    title: "Nurturing Environment",
    desc: "Our dedicated team comes together to address the needs of these children, ensuring they receive the care, support, and love they deserve.",
  },
];

export default function Orphanage() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* HERO */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/AKA.jpg" alt="Project Ashra" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT ASHRA</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Empowering Futures,<br />One Child at a Time</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            A haven of free education for underprivileged children — providing shelter, learning, and hope for a brighter tomorrow.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Ashray Ka Aashra</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              The <strong className="text-primary">AFLF (Ashray for Life Foundation)</strong>, also recognized as
              <strong className="text-primary"> "Ashray Ka Aashra from Malad,"</strong> serves as a haven of free
              education for underprivileged children. With a dedicated team, the foundation
              comes together to address the needs of these children, ensuring they receive
              the support they require.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              As a part of their mission, the foundation distributes education kits to these
              young minds, paving the way for a promising and luminous future. We believe in
              the transformative power of education — every child deserves the opportunity to
              learn, grow, and build a brighter future.
            </p>
            <p className="font-body-lg italic text-primary border-l-4 border-secondary-container pl-6 mb-6">
              "We envision a world where every child has the chance to break free from the
              cycle of poverty through education."
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img src="/images/Ashray/img1.jpg" alt="Children at shelter" className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover" />
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Our Commitment</h2>
            <p className="font-body-lg text-on-surface-variant">
              Through Project Ashra, we are dedicated to creating lasting change for every child
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {commitments.map((m, i) => (
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
            <h2 className="font-headline-lg text-primary mb-6">Shaping Brighter Tomorrows</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through Project Ashra, we have witnessed the transformation of young lives.
              Children who once had no access to education now dream of becoming doctors,
              teachers, and engineers. The shelter provides not just education but a nurturing
              home where every child feels valued and loved.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every child who steps into our shelter, every education kit we distribute, every
              life we touch — these are the milestones that drive us forward. Together, we are
              sowing the seeds for a more equitable and hopeful future.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">200+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Children Supported</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">1000+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Education Kits Distributed</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">10+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Years of Service</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">24/7</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Shelter & Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Moments of Joy</h2>
            <p className="font-body-lg text-on-surface-variant">Every smile tells a story of hope and transformation</p>
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
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help us provide education, shelter, and hope to more children in need.</p>
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
