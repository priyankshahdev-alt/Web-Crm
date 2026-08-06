import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/education/Education2.jpg", alt: "Education Support" },
  { id: 2, src: "/images/education/Education3.jpg", alt: "Children Learning" },
  { id: 3, src: "/images/education/Education4.jpg", alt: "School Activities" },
  { id: 4, src: "/images/education/Education5.jpg", alt: "Educational Materials" },
  { id: 5, src: "/images/education/Education6.jpg", alt: "Classroom Support" },
  { id: 6, src: "/images/education/Education78.jpg", alt: "Students Learning" },
];

const missions = [
  {
    title: "Eliminating Child Labor",
    desc: "No child should ever have to work to survive. Through Project Vidhyalay, we work tirelessly to eradicate child labor, providing young souls with the gift of education.",
  },
  {
    title: "Access to Basic Education",
    desc: "Illiteracy and poverty have kept countless children from accessing even basic education. Project Vidhyalay bridges this gap, offering a pathway to learning and empowerment.",
  },
  {
    title: "Empowering Women",
    desc: "We empower daily wage workers and school dropout women with basic education, giving them the ability to read, write, and sign their names, opening doors to a brighter future.",
  },
];

export default function Education() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/education/Educationhome.jpg" alt="Education for All" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT VIDHYALAY</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Education for All,<br />Hope for Every Child</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Breaking the cycle of illiteracy and poverty by ensuring every underprivileged child has access to quality education.
          </p>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Vidhyalay</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              At <strong className="text-primary">AFLF (Ashray for Life Foundation)</strong>, we are committed to breaking the cycle
              of illiteracy and poverty by ensuring that every underprivileged child, every slum dweller,
              and every orphaned child has the opportunity to receive a quality education.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Project Vidhyalay is our flagship initiative, dedicated to the cause of{" "}
              <strong className="text-primary">"Education for All."</strong> We believe that education is not just a fundamental
              right — it is the most powerful tool to transform lives, families, and entire communities.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img
              src="/images/education/Education1.jpg"
              alt="Students Learning"
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
            <p className="font-body-lg text-on-surface-variant">Through Project Vidhyalay, we are dedicated to creating lasting change</p>
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
            <h2 className="font-headline-lg text-primary mb-6">Transforming Lives Through Education</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through Project Vidhyalay, we have witnessed the transformation of lives. We've seen
              children trade their work tools for books, slum communities embrace education as a
              beacon of hope, and women gaining the confidence to pursue better opportunities for
              themselves and their families.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every child who steps into our classrooms, every woman who learns to read and write,
              every family that breaks free from poverty — these are the milestones that drive us
              forward. Education is the key that unlocks a world of possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">500+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Children Educated</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">200+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Women Empowered</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">50+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Communities Reached</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">100%</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Dedicated to Change</div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Moments of Learning</h2>
            <p className="font-body-lg text-on-surface-variant">Every picture tells a story of hope and transformation</p>
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
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help us educate more children and transform more lives through learning.</p>
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
