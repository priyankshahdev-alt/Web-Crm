import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/oldage/img1.jpg", alt: "Elderly Care" },
  { id: 2, src: "/images/oldage/img2.jpg", alt: "Quality Time" },
  { id: 3, src: "/images/oldage/img3.jpg", alt: "Celebrations" },
  { id: 4, src: "/images/oldage/img4.jpg", alt: "Community Support" },
  { id: 5, src: "/images/oldage/img5.jpg", alt: "Golden Years" },
  { id: 6, src: "/images/oldage/img6.jpg", alt: "Dignity And Respect" },
];

const missions = [
  {
    title: "Advocating for the Elderly",
    desc: "In a country with a projected 138 million elderly individuals, AFLF is their voice. We champion their concerns and rights, ensuring they lead secure, joyful, and dignified lives.",
  },
  {
    title: "Supporting Old-Age Homes",
    desc: "We provide essential support in the form of food grains, regular visits, and quality time spent, making their days brighter and more meaningful.",
  },
  {
    title: "Celebrating Life's Moments",
    desc: "We celebrate the special occasions of our elderly friends, like birthdays and festivals, bringing smiles, joy, and a sense of belonging to their lives.",
  },
];

export default function OldAgeHome() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* HERO */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/oldage/oldage.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT SAHARA</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Dignity & Care,<br />For Every Senior</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            We envision a society where our seniors have the right to an active, healthy, and dignified life, regardless of their circumstances.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Ashray Ka Aashram </h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              At <strong className="text-primary">AFLF (Ashray for Life Foundation)</strong>, we are dedicated to a
              cause that transcends age, but centers on the invaluable wisdom and experience
              of our elderly population. We envision a society where our seniors have the
              right to an active, healthy, and dignified life, regardless of their circumstances.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              In a country with a projected 138 million elderly individuals, AFLF is their
              voice. We champion their concerns and rights, working tirelessly to ensure
              that they lead secure, joyful, and dignified lives.
            </p>
            <p className="font-body-lg italic text-primary border-l-4 border-secondary-container pl-6 mb-6">
              "Together, we can ensure that our seniors live their golden years with the
              dignity and respect they deserve."
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img src="/images/oldage/img1.jpg" alt="Elderly care" className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover" />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Our Mission</h2>
            <p className="font-body-lg text-on-surface-variant">
              Dedicated to empowering and uplifting the lives of disadvantaged older persons
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
            <h2 className="font-headline-lg text-primary mb-6">Giving Seniors the Dignity They Deserve</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              For many elderly individuals, old-age homes are their haven. Through Project
              Ashray Ka Aashram , we provide essential support, companionship, and a sense of belonging.
              Our regular visits, food grain distributions, and festive celebrations bring
              warmth and joy to their golden years.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every smile we bring, every celebration we share, every moment of dignity we
              restore — these are the milestones that drive us forward. Together, we can
              ensure that no senior feels forgotten or alone.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">138M+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Elderly Population</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">500+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Seniors Supported</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">50+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Old-Age Homes</div>
            </div>
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
              <div className="font-headline-lg text-secondary-container mb-2">100+</div>
              <div className="font-label-sm text-white/70 uppercase tracking-widest">Celebrations Hosted</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Moments of Joy</h2>
            <p className="font-body-lg text-on-surface-variant">Bringing smiles, joy, and a sense of belonging to our senior friends</p>
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
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help us bring dignity, care, and companionship to more seniors in need.</p>
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
