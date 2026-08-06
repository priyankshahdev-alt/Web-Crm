import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/Pashu/img1.jpg", alt: "Stray Animal Care" },
  { id: 2, src: "/images/Pashu/img2.jpg", alt: "Animal Rescue" },
  { id: 3, src: "/images/Pashu/img3.jpg", alt: "Veterinary Care" },
  { id: 4, src: "/images/Pashu/img4.jpg", alt: "Animal Compassion" },
  { id: 5, src: "/images/Pashu/img5.jpg", alt: "Pet Care" },
  { id: 6, src: "/images/Pashu/img6.jpg", alt: "Shelter Support" },
];

const missions = [
  {
    title: "Caring for Stray Animals",
    desc: "Thousands of stray animals struggle daily for food, shelter, and survival. AFLF provides nutritious food, clean drinking water, and essential care to help them live healthier and safer lives.",
  },
  {
    title: "Promoting Animal Health & Welfare",
    desc: "We support the well-being of animals through medical assistance, vaccination drives, rescue efforts, and treatment for injured or sick animals, ensuring they receive the care they deserve.",
  },
  {
    title: "Creating Safe Spaces",
    desc: "Our goal is to help provide safe environments and temporary shelters for abandoned and vulnerable animals, protecting them from harsh weather conditions and other dangers.",
  },
  {
    title: "Spreading Awareness & Compassion",
    desc: "Through community engagement and awareness campaigns, we encourage people to treat animals with empathy, promote responsible pet care, and support animal welfare initiatives.",
  },
  {
    title: "Building a Humane Society",
    desc: "We believe that kindness towards animals reflects the values of a compassionate community. By fostering respect for all living beings, we aim to create lasting positive change.",
  },
];

export default function PashuPremi() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* HERO */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/Pashu/pashu.jpg" alt="Project Pashu Premi" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT PASHU PREMI</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Compassion for<br />Every Living Being</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Every animal deserves love, safety, nourishment, and compassionate care. Together, we create a more humane society.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Pashu Premi</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              At <strong className="text-primary">AFLF (Ashray for Life Foundation)</strong>, we are dedicated to
              protecting, caring for, and improving the lives of stray and vulnerable animals.
              Project Pashu Premi is our heartfelt initiative to ensure every living being
              receives the love, safety, and compassion they deserve.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Thousands of stray animals struggle daily for food, shelter, and survival.
              Through this initiative, AFLF provides nutritious food, clean drinking water,
              medical assistance, and essential care to help animals live healthier and
              safer lives.
            </p>
            <p className="font-body-lg italic text-primary border-l-4 border-secondary-container pl-6 mb-6">
              "Kindness towards animals reflects the values of a compassionate community.
              Together, let's protect, nurture, and celebrate every life."
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img src="/images/Pashu/img1.jpg" alt="Stray animal care" className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover" />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Our Mission</h2>
            <p className="font-body-lg text-on-surface-variant">
              Dedicated to creating a safer and more compassionate world for animals
            </p>
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

      {/* IMPACT */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="max-w-3xl">
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">OUR IMPACT</span>
            <h2 className="font-headline-lg text-primary mb-6">Building a More Humane World</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every animal rescued, fed, and cared for is a victory for compassion. Through
              Project Pashu Premi, we have brought hope to countless stray and vulnerable
              animals, providing them with nourishment, medical care, and a safe haven.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Each life saved, each injury treated, each full belly — these are the milestones
              that drive us forward. Your support helps us create a world where no animal is
              left behind or forgotten.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">2000+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Animals Fed</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">500+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Rescues</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">50+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Vaccination Drives</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">1000+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Medical Treatments</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Moments of Compassion</h2>
            <p className="font-body-lg text-on-surface-variant">Every life matters — celebrating the animals we've helped together</p>
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
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help us protect, nurture, and care for more animals in need.</p>
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
