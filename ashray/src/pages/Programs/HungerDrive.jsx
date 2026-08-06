import { Link } from "react-router-dom";

const galleryImages = [
  { id: 1, src: "/images/ZeroHunger/Hunger7.jpg", alt: "Food Distribution" },
  { id: 2, src: "/images/ZeroHunger/Hunger3.jpg", alt: "Meal Preparation" },
  { id: 3, src: "/images/ZeroHunger/Hunger4.jpg", alt: "Community Kitchen" },
  { id: 4, src: "/images/ZeroHunger/Hunger5.jpg", alt: "Food Packets" },
  { id: 5, src: "/images/ZeroHunger/Hunger6.jpg", alt: "Volunteers Serving" },
  { id: 6, src: "/images/ZeroHunger/Hunger21.jpg", alt: "Happy Children Eating" },
];

const missions = [
  {
    title: "Monthly Food Kits",
    desc: "We distribute essential food kits containing rice, wheat flour, rava, poha, oil, masala, and more to BPL families and individuals in need across Mumbai's slums.",
  },
  {
    title: "Reaching the Most Vulnerable",
    desc: "Our focus is on senior citizens, Divyang members, visually impaired individuals, homeless people, and those who struggle daily to find a single meal.",
  },
  {
    title: "Ending Hunger Together",
    desc: "Through community support and collective action, we aim to eliminate hunger-related deaths and ensure no one sleeps hungry in Mumbai.",
  },
];

export default function HungerDrive() {
  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/ZeroHunger/Hunger.jpg" alt="Zero Hunger Drive" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-5 md:px-margin-desktop pb-16 md:pb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">PROJECT ZERO HUNGER DRIVE</span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Ending Hunger,<br />One Meal at a Time</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Dedicated to providing essential food to those in dire need — because no one should go to bed hungry.
          </p>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold mb-4 inline-block">WELCOME TO</span>
            <h2 className="font-headline-lg text-primary mb-6">Project Zero Hunger Drive</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              At <strong className="text-primary">AFLF (Ashray for Life Foundation)</strong>, Project "Zero Hunger Drive" is dedicated to
              providing essential food to those who are in dire need, as countless individuals in Mumbai's slums and
              across India go without food, resulting in tragic hunger-related deaths.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Our mission is to combat this issue through monthly food kit distributions. These kits contain items
              such as rice, wheat flour, rava, poha, oil, masala, and more, which are distributed to Below Poverty
              Line (BPL) families, senior citizens, Divyang members, visually impaired individuals, as well as
              those who are homeless and in need in Mumbai.
            </p>
            <p className="font-body-lg italic text-primary border-l-4 border-secondary-container pl-6 mb-6">
              "There are miles to go before we AFLF sleep — because in Mumbai's slums, many people are left hungry.
              We are hungry for change, and together, we can feed the hungry."
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10" />
            <img
              src="/images/ZeroHunger/Hunger1.jpg"
              alt="Food distribution"
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
            <p className="font-body-lg text-on-surface-variant">Through Project Zero Hunger Drive, we are fighting to end hunger and malnutrition</p>
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
            <h2 className="font-headline-lg text-primary mb-6">Fighting Hunger, Restoring Hope</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Through Project Zero Hunger Drive, we have witnessed the transformation of lives. Families who once
              struggled to find a single meal now receive consistent support. Children who went to school hungry
              now have the nutrition they need to learn and grow.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Every food kit distributed, every family supported, every life touched — these are the milestones
              that drive us forward. Together, we are building a community where no one has to suffer from hunger.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">10,000+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Food Kits Distributed</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">5,000+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Families Supported</div>
          </div>
          <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center">
            <div className="font-headline-lg text-secondary-container mb-2">50+</div>
            <div className="font-label-sm text-white/70 uppercase tracking-widest">Slums Reached</div>
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
            <h2 className="font-headline-lg text-primary mb-4">Moments of Hope</h2>
            <p className="font-body-lg text-on-surface-variant">Every meal shared is a step toward a hunger-free world</p>
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
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">Your support can help us feed more families and end hunger in our communities.</p>
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
