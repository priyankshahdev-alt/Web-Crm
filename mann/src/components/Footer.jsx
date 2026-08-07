import { Link } from "react-router-dom";
import { useSiteData } from "../api/useSiteData";
import { img } from "../utils/images";

// ============ SOFT MODERN FOOTER ============
export default function Footer() {
  const { data } = useSiteData();
  const contact = data.contact;
  const footer = data.footer;
  const footerPrograms = footer.programs;
  const footerLegal = footer.legal;
  return (
    <footer className="bg-on-surface text-white py-24">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-7">
            <div className="font-display-lg text-4xl sm:text-6xl md:text-8xl mb-10 leading-[0.8] tracking-tighter uppercase font-extrabold">
              MANN CARE
              <br />
              FOUNDATION.
            </div>
            <p className="text-2xl font-body-lg max-w-xl border-l-2 border-primary pl-8 leading-relaxed opacity-80">
              {footer.tagline}
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-10">
              <h4 className="font-label-bold text-[10px] tracking-[0.3em] uppercase text-primary">
                PROGRAMS
              </h4>
              <nav className="flex flex-col gap-6 font-display-lg text-3xl">
                {footerPrograms.map((p) => (
                  <Link key={p.to} to={p.to} className="hover:text-primary transition-all tracking-tight uppercase font-bold">
                    {p.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-col justify-between sm:items-end gap-10">
              <div className="space-y-6 sm:text-right">
                <h4 className="font-label-bold text-[10px] tracking-[0.3em] uppercase text-primary">
                  CONTACT
                </h4>
                <div className="text-sm leading-relaxed opacity-80 space-y-3">
                  <p>{contact.address}</p>
                  <p>
                    {contact.phones.map((t) => (
                      <a key={t} href={`tel:${t.replace(/\s/g, "")}`} className="block hover:text-primary transition-colors">
                        {t}
                      </a>
                    ))}
                  </p>
                  <p>
                    {contact.emails.map((e) => (
                      <a key={e} href={`mailto:${e}`} className="block hover:text-primary transition-colors">
                        {e}
                      </a>
                    ))}
                  </p>
                </div>
              </div>
              <div className="w-32 h-32 bg-white rounded-2xl p-4 rotate-6">
                <img
                  src={img("/gpay-qr.jpeg")}
                  alt="GPay QR"
                  className="w-full h-full object-contain grayscale"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-label-bold text-[10px] tracking-widest uppercase opacity-50">
            {footer.copyright}
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center">
            {footerLegal.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="font-label-bold text-[10px] uppercase tracking-widest hover:text-primary transition-all opacity-50"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
