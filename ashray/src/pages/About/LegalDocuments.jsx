import { useState, useEffect } from "react";

const documents = [
  {
    id: 1,
    title: "Registration Certificate",
    file: "/documents/Registration-certificate-Ashray-for-Life-Foundation.pdf",
    type: "Certificate",
    desc: "Official trust registration under the Indian Trusts Act.",
  },
  {
    id: 2,
    title: "PAN Card",
    file: "/documents/pancard.pdf",
    type: "Tax",
    desc: "Permanent Account Number issued by Income Tax Department.",
  },
  {
    id: 3,
    title: "80G Certificate",
    file: "/documents/80G-CERTIFICATE-1.pdf",
    type: "Tax Exemption",
    desc: "Enables donors to claim 50% tax exemption under Section 80G.",
  },
  {
    id: 4,
    title: "Niti Aayog Registration",
    file: "/documents/ASHRAY-NITI-AAYOG.pdf",
    type: "Government",
    desc: "Registered with NITI Aayog — unique ID for transparency.",
  },
  {
    id: 5,
    title: "12A Certificate",
    file: "/documents/PROVISIONAL-ORDER-OF-12A-1.pdf",
    type: "Tax Exemption",
    desc: "Exempts trust income from taxation under Section 12A.",
  },
];

const iconMap = {
  Certificate: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Tax: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  "Tax Exemption": (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  Government: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
};

const typeColors = {
  Certificate: { bg: "#dce1ff", border: "#4059aa", text: "#264191" },
  Tax: { bg: "#fef3e2", border: "#f5a623", text: "#6f5100" },
  "Tax Exemption": { bg: "#eceef0", border: "#00236f", text: "#00164e" },
  Government: { bg: "#dce1ff", border: "#1e3a8a", text: "#264191" },
};

function LegalDocuments() {
  const [modalDoc, setModalDoc] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (modalDoc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalDoc]);

  useEffect(() => {
    setLoadError(false);
  }, [modalDoc]);

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
              verified
            </span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Legal Compliance</span>
          </div>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Legal Documents</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Official registrations, tax exemptions, and government accreditations of Ashray for Life Foundation.
          </p>
        </div>
      </section>

      {/* ===== DOCUMENTS ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="font-label-md text-primary uppercase tracking-[0.2em]">Transparency</span>
            </div>
            <h2 className="font-headline-lg text-primary mb-6">Certificates & Registrations</h2>
            <p className="font-body-lg text-on-surface-variant">
              All our legal documents are publicly available for transparency. Click any document to view or download.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {documents.map((doc) => {
              const colors = typeColors[doc.type] || typeColors.Certificate;
              return (
                <div
                  key={doc.id}
                  className="group bg-surface-container rounded-3xl border border-outline-variant subtle-shadow hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(2,16,100,0.15)] hover:border-primary/20 transition-all cursor-pointer p-8"
                  onClick={() => setModalDoc(doc)}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {iconMap[doc.type]}
                  </div>
                  <span
                    className="inline-block font-label-sm uppercase tracking-widest px-4 py-2 rounded-full mb-4"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {doc.type}
                  </span>
                  <h3 className="font-headline-md text-xl text-primary mb-3">{doc.title}</h3>
                  <p className="font-body-md text-on-surface-variant mb-6">{doc.desc}</p>
                  <span className="inline-flex items-center gap-2 font-label-md font-bold text-primary transition-transform duration-300 group-hover:translate-x-1">
                    View Document
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== MODAL ===== */}
      {modalDoc && (
        <div
          className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalDoc(null)}
        >
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-4 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: typeColors[modalDoc.type]?.bg || "#dce1ff", color: typeColors[modalDoc.type]?.text || "#1565C0" }}
                >
                  {iconMap[modalDoc.type]}
                </div>
                <div className="min-w-0">
                  <h3 className="font-headline-md text-xl text-primary mb-1 truncate">{modalDoc.title}</h3>
                  <span
                    className="inline-block font-label-sm uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: typeColors[modalDoc.type]?.bg || "#dce1ff", color: typeColors[modalDoc.type]?.text || "#1565C0" }}
                  >
                    {modalDoc.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end sm:flex-shrink-0">
                <a
                  href={modalDoc.file}
                  download
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-label-md font-bold shadow-xl hover:bg-on-primary-fixed-variant transition-all flex-1 sm:flex-none justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>
                <button
                  className="w-11 h-11 rounded-full bg-surface-dim border border-outline-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high hover:text-primary transition-all shrink-0"
                  onClick={() => setModalDoc(null)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white">
              {!loadError ? (
                <iframe
                  src={modalDoc.file}
                  title={modalDoc.title}
                  className="w-full h-[70vh] rounded-b-3xl bg-white"
                  onError={() => setLoadError(true)}
                />
              ) : null}
              <div
                className="w-full h-[70vh] rounded-b-3xl bg-surface-dim flex-col items-center justify-center gap-4 text-center px-6"
                style={{ display: loadError ? "flex" : "none" }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <p className="font-body-lg text-on-surface-variant">Preview not available. Click download to view the document.</p>
                <a
                  href={modalDoc.file}
                  download
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-label-md font-bold shadow-xl hover:bg-on-primary-fixed-variant transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download {modalDoc.title}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LegalDocuments;
