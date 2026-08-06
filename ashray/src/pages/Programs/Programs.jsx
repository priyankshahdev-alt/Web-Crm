import { useEffect } from "react";
import { Link } from "react-router-dom";

const programs = [
  {
    id: 1,
    title: "Project Vidhyalay",
    desc: "Breaking the cycle of illiteracy by ensuring every underprivileged child has access to quality education.",
    tag: "Education",
    icon: "school",
    link: "/programs/education",
    image: "/images/education/Educationhome.jpg",
  },
  {
    id: 2,
    title: "Nari Tarang",
    desc: "Empowering women with skills, confidence, and opportunities to lead independent and dignified lives.",
    tag: "Women Empowerment",
    icon: "diversity_3",
    link: "/programs/women-empowerment",
    image: "/images/NariTarang/naariiiii.jpg",
  },
  {
    id: 3,
    title: "Zero Hunger Drive",
    desc: "Fighting hunger by providing nutritious meals and ensuring no one sleeps hungry.",
    tag: "Food & Nutrition",
    icon: "restaurant",
    link: "/programs/zero-hunger-drive",
    image: "/images/ZeroHunger/Hunger.jpg",
  },
  {
    id: 4,
    title: "Project JAL",
    desc: "Ensuring access to clean and safe water for healthier communities and a sustainable future.",
    tag: "Clean Water",
    icon: "water_drop",
    link: "/programs/jal-project",
    image: "/images/jal/jal.jpg",
  },
  {
    id: 5,
    title: "Ashray Ka Aashra",
    desc: "Providing care, education, and hope to orphaned children for a brighter tomorrow.",
    tag: "Orphan Care",
    icon: "family_home",
    link: "/programs/orphanage",
    image: "/images/AKA.jpg",
  },
  {
    id: 6,
    title: "Life-Line",
    desc: "Providing life-saving medical care and critical surgery support to those who cannot afford it.",
    tag: "Medical",
    icon: "medical_services",
    link: "/programs/medical",
    image: "/images/Sahara/Sahara.jpg",
  },
  {
    id: 7,
    title: "Sahara",
    desc: "Supporting elderly individuals with care, dignity, and companionship for a better quality of life.",
    tag: "Elderly Care",
    icon: "elderly",
    link: "/programs/old-age-home",
    image: "/images/oldage/oldage.jpg",
  },
  {
    id: 8,
    title: "Pashupremi",
    desc: "Rescue and welfare programs for animals, ensuring compassion for every living being.",
    tag: "Animal Welfare",
    icon: "pets",
    link: "/programs/pashu-premi",
    image: "/images/Pashu/pashu.jpg",
  },
];

function Programs() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-on-primary-fixed-variant to-primary" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-secondary-fixed opacity-10 blur-3xl" />

        <div className="relative z-10 max-w-container-max mx-auto px-5 md:px-margin-desktop py-24 md:py-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              menu_book
            </span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Our Initiatives</span>
          </div>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Our Programs</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            We work tirelessly to transform lives through education, healthcare, community support, and sustainable development initiatives.
          </p>
        </div>
      </section>

      {/* ===== PROGRAMS GRID ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="font-label-md text-primary uppercase tracking-[0.2em]">Our Initiatives</span>
              </div>
              <h2 className="font-headline-lg text-primary">Programs That Transform Lives</h2>
            </div>
            <p className="font-body-md text-on-surface-variant max-w-md">
              Eight focused initiatives spanning education, health, nutrition, water, and dignity for every generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {programs.map((p) => (
              <Link
                to={p.link}
                key={p.id}
                className="group bg-surface-container rounded-3xl border border-outline-variant subtle-shadow hover:shadow-[0_24px_48px_-16px_rgba(2,16,100,0.15)] hover:border-primary/20 transition-all overflow-hidden reveal-on-scroll"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  <div className="absolute -bottom-6 left-8 w-14 h-14 rounded-2xl bg-primary text-secondary-container flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-3xl">{p.icon}</span>
                  </div>
                </div>
                <div className="p-8 pt-10">
                  <h3 className="font-headline-md text-xl text-primary mb-3 group-hover:text-on-primary-fixed-variant transition-colors">
                    {p.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant mb-6">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-on-primary-fixed-variant bg-primary-fixed px-4 py-2 rounded-full uppercase tracking-widest">
                      {p.tag}
                    </span>
                    <span className="text-primary font-label-md font-bold flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                      Explore
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Programs;
