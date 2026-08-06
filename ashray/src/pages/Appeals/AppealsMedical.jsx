import { Link } from "react-router-dom";

const cases = [
  {
    name: "Master Arsh Akash Shah",
    cost: "₹20,00,000",
    desc: "Critical cardiac surgery required urgently for survival.",
  },
  {
    name: "Miss Joanna Rokde",
    cost: "₹6,50,000",
    desc: "Requires specialized medical treatment and hospitalization.",
  },
  {
    name: "Master Jayvardhan Bhosale",
    cost: "₹19,50,000",
    desc: "Life-saving surgery needed for severe health condition.",
  },
  {
    name: "Master Abhay Amar Singh",
    cost: "₹2,00,000",
    desc: "Urgent treatment support required for recovery.",
  },
];

const MedicalSupport = () => {
  return (
    <div className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-on-primary-fixed-variant to-primary" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-secondary-fixed opacity-10 blur-3xl" />

        <div className="relative z-10 max-w-container-max mx-auto px-5 md:px-margin-desktop py-24 md:py-32">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md font-bold uppercase tracking-widest">
            Medical Support
          </span>
          <h1 className="font-headline-xl text-white mt-8 mb-6">
            Project LIFE-LINE – Saving Lives
          </h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Every heartbeat matters. Through Project LIFE-LINE, we support
            children and individuals who need urgent, life-saving medical care
            but cannot afford it.
          </p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-1 bg-primary rounded-full" />
            <span className="font-label-md text-primary uppercase tracking-[0.2em]">
              About Us
            </span>
          </div>
          <h2 className="font-headline-lg text-primary mb-8">
            About Project LIFE-LINE
          </h2>
          <p className="font-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
            Ashray for Life Foundation (AFLF) is committed to ensuring that no
            life is lost due to lack of medical funds. We step in for critical
            surgeries, emergency treatments, and hospitalization support for
            underprivileged families.
          </p>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Our Mission</h2>
            <p className="font-body-lg text-on-surface-variant">
              Fighting for every heartbeat through urgent, life-saving care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8">
              <h3 className="font-headline-md text-xl text-primary mb-3">
                Saving Children’s Lives
              </h3>
              <p className="font-body-md text-on-surface-variant">
                Providing urgent surgeries and treatments for children suffering
                from life-threatening conditions.
              </p>
            </div>
            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8">
              <h3 className="font-headline-md text-xl text-primary mb-3">
                Critical Care Support
              </h3>
              <p className="font-body-md text-on-surface-variant">
                Helping families who cannot afford expensive medical procedures
                and hospitalization.
              </p>
            </div>
            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8">
              <h3 className="font-headline-md text-xl text-primary mb-3">
                Compassion in Action
              </h3>
              <p className="font-body-md text-on-surface-variant">
                Building a community-driven support system to save lives through
                collective donations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== APPEALS ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-1 bg-primary rounded-full" />
            <span className="font-label-md text-primary uppercase tracking-[0.2em]">
              Donate Now
            </span>
          </div>
          <h2 className="font-headline-lg text-primary mb-16">
            Active Medical Appeals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {cases.map((item, index) => (
              <div
                key={index}
                className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8"
              >
                <h3 className="font-headline-md text-xl text-primary mb-3">
                  {item.name}
                </h3>
                <span className="inline-block font-label-md font-bold text-on-primary-fixed-variant bg-secondary-container/15 px-4 py-2 rounded-full mb-4">
                  Treatment Cost: {item.cost}
                </span>
                <p className="font-body-md text-on-surface-variant mb-8">
                  {item.desc}
                </p>
                <Link
                  to="/donate"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-label-md font-bold shadow-lg hover:bg-on-primary-fixed-variant transition-all"
                >
                  Donate Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalSupport;
