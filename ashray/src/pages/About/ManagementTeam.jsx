import { useState } from "react";

const teamMembers = [
  { id: 1, name: "Mr. Naresh Bhanushali", role: "President", photo: "/images/team/naresh-bhanushali.jpg" },
  { id: 2, name: "Mr. Mihir Shah", role: "Secretary", photo: "/images/team/mihir-shah.jpg" },
  { id: 4, name: "Mrs. Prachi Dhanawade", role: "Accounts Executive", photo: "/images/team/prachi-dhanawade.jpg" },
  { id: 5, name: "Mr. Deepak Karkera", role: "Team Member", photo: "/images/team/deepak-karkera.jpg" },
  { id: 6, name: "Ms. Deepa Gupta", role: "Team Member", photo: "/images/team/deepa-gupta.jpg" },
  { id: 7, name: "Mrs. Kshitija Jadhav", role: "Team Member", photo: "/images/team/kshitija-jadhav.jpg" },
  { id: 8, name: "Mrs. Varsha Sakhariya", role: "Team Member", photo: "/images/team/varsha-sakhariya.jpg" },
  { id: 9, name: "Mrs. Pooja Pal", role: "Team Member", photo: "/images/team/pooja-pal.jpg" },
  { id: 10, name: "Miss. Hiral Waghela", role: "Team Member", photo: "/images/team/hiral-waghela.jpg" },
];

const initials = (name) => {
  const parts = name.replace(/^(Mr|Mrs|Ms|Miss)\.\s*/, "").split(" ");
  return parts.map((p) => p[0]).join("").slice(0, 2);
};

const stripPrefix = (name) => name.replace(/^(Mr|Mrs|Ms|Miss)\.\s*/, "");

function ManagementTeam() {
  const [imgError, setImgError] = useState({});

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
              groups
            </span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Board of Trustees</span>
          </div>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Management Team</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Meet the dedicated individuals steering Ashray for Life Foundation toward a brighter future.
          </p>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="font-label-md text-primary uppercase tracking-[0.2em]">Board of Trustees</span>
            </div>
            <h2 className="font-headline-lg text-primary mb-6">Board of Trustees / Executive Committee</h2>
            <p className="font-body-lg text-on-surface-variant">
              The following individuals constitute the Board of Trustees and Executive Committee, entrusted with the governance, administration, strategic planning, and smooth functioning of the Trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-surface-container rounded-3xl border border-outline-variant subtle-shadow hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="aspect-square overflow-hidden rounded-t-3xl bg-surface-container-high">
                  {imgError[member.id] ? (
                    <div className="w-full h-full flex items-center justify-center font-headline-xl text-primary">
                      {initials(member.name)}
                    </div>
                  ) : (
                    <img
                      src={member.photo}
                      alt={stripPrefix(member.name)}
                      onError={() => setImgError((prev) => ({ ...prev, [member.id]: true }))}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-8">
                  <h3 className="font-headline-md text-xl text-primary mb-2">{stripPrefix(member.name)}</h3>
                  <span className="font-label-sm text-on-primary-fixed-variant uppercase tracking-widest">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ManagementTeam;
