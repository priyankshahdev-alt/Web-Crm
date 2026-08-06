import { useEffect, useState, useRef } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const TrustDocuments = () => {
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfDocs, setPdfDocs] = useState([]);
  const [pdfIdx, setPdfIdx] = useState(0);
  const modalRef = useRef(null);

  const content = usePageContent('trust-documents');

  const pageTitle = content('td-title', 'heading') ?? 'Trust Documents';

  const heroTag = content('td-hero', 'tag') ?? 'BEING SEVAK CHARITABLE TRUST';
  const heroHeading = content('td-hero', 'heading') ?? 'Trust';
  const heroHighlight = content('td-hero', 'highlight') ?? 'Documents';
  const heroDescription =
    content('td-hero', 'description') ??
    'View important legal certificates, registrations, compliance documents, and annual activity reports of Being Sevak Charitable Trust.';
  const heroCard1Value = content('td-hero', 'card1Value') ?? '18+';
  const heroCard1Label = content('td-hero', 'card1Label') ?? 'Registered Documents';
  const heroCard2Value = content('td-hero', 'card2Value') ?? '80G';
  const heroCard2Label = content('td-hero', 'card2Label') ?? 'Tax Exemption';
  const heroImage = content('td-hero', 'image') ?? '/images/trustdocumentspng.png';

  const bookletTitle = content('td-booklets', 'title') ?? 'Activity Report Year Wise';
  const bookletData =
    content('td-booklets', 'items') ?? [
      { year: '2016', img: '/BSCT Trust Document/booklet/2016.png', pdf: '/BSCT Trust Document/activity report/BSCT Activity Report 2016.pdf' },
      { year: '2017', img: '/BSCT Trust Document/booklet/2017.png', pdf: '/BSCT Trust Document/activity report/Activity-Report-2017 UPDATED.pdf' },
      { year: '2018', img: '/BSCT Trust Document/booklet/2018.png', pdf: '/BSCT Trust Document/activity report/Activity-Report-2018 UPDATED.pdf' },
      { year: '2019', img: '/BSCT Trust Document/booklet/2019.png', pdf: '' },
      { year: '2020', img: '/BSCT Trust Document/booklet/2020.png', pdf: '' },
      { year: '2021', img: '/BSCT Trust Document/booklet/2021.png', pdf: '/BSCT Trust Document/activity report/Activity Report 2021.pdf' },
      { year: '2022', img: '/BSCT Trust Document/booklet/2022.png', pdf: '/BSCT Trust Document/activity report/Activity Report 2022.pdf' },
      { year: '2023', img: '/BSCT Trust Document/booklet/2023.png', pdf: '/BSCT Trust Document/activity report/Activity Report 2023.pdf' },
      { year: '2024', img: '/BSCT Trust Document/booklet/2024.png', pdf: '/BSCT Trust Document/activity report/Activity Report Jan 2024 To Dec 2024).pdf' },
      { year: '2025', img: '/BSCT Trust Document/booklet/2025.png', pdf: '' },
    ];

  const portalTitle = content('td-portal', 'title') ?? 'Trust Documents & Reports';
  const portalSubtitle = content('td-portal', 'subtitle') ?? 'Transparency, Accountability & Impact — Building Trust Through Every Action.';
  const tab1Label = content('td-portal', 'tab1Label') ?? 'Trust Documents';
  const tab2Label = content('td-portal', 'tab2Label') ?? 'BSCT Audit Reports';
  const legalDocs =
    content('td-legal', 'items') ?? [
      { title: 'Registration Certificate', desc: 'Legal Compliance Document', icon: 'fas fa-file-contract', pdf: '/BSCT Trust Document/documents/regeistrationCertificate.pdf' },
      { title: 'PAN Card', desc: 'Tax Identification Document', icon: 'fas fa-id-card', pdf: '/BSCT Trust Document/documents/PanCard.pdf' },
      { title: '80G Certificate (New)', desc: 'Tax Exemption Certificate', icon: 'fas fa-certificate', pdf: '/BSCT Trust Document/documents/Being Sevak 80G Form New Certificate.pdf' },
      { title: '80G Certificate (Old)', desc: 'Tax Exemption Certificate', icon: 'fas fa-certificate', pdf: '/BSCT Trust Document/documents/80G Certificate (Old).pdf' },
      { title: '12A Certificate (New)', desc: 'Trust Registration Exemption', icon: 'fas fa-file-invoice', pdf: '/BSCT Trust Document/documents/12A Certificate (New).pdf' },
      { title: 'CSR Certificate', desc: 'Corporate Social Responsibility Compliance', icon: 'fas fa-hand-holding-heart', pdf: '/BSCT Trust Document/documents/CSR Funds Certificate.PDF' },
      { title: 'NITI Aayog Registration', desc: 'Government Registry', icon: 'fas fa-building', pdf: '/BSCT Trust Document/documents/NITI Aayog Registration.pdf' },
    ];
  const auditDocs =
    content('td-audit', 'items') ?? [
      { title: 'BSCT Audit Report 2016-2017', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2016-2017.pdf' },
      { title: 'BSCT Audit Report 2017-2018', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2017-2018.pdf' },
      { title: 'BSCT Audit Report 2018-2019', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2018-2019.pdf' },
      { title: 'BSCT Audit Report 2019-2020', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2019-2020.pdf' },
      { title: 'BSCT Audit Report 2020-2021', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2020-2021 .pdf' },
      { title: 'BSCT Audit Report 2021-2022', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2021 2022.pdf' },
      { title: 'BSCT Audit Report 2022-2023', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2022- 2023.pdf' },
      { title: 'BSCT Audit Report 2024', desc: 'Annual Audit Report', icon: 'fas fa-calendar-alt', pdf: '/BSCT Trust Document/BSCT Audit Report/Being Sevak Audit Report BSCT 2024.pdf' },
    ];

  const complianceTag = content('td-compliance', 'tag') ?? 'OUR COMPLIANCE';
  const complianceHeading = content('td-compliance', 'heading') ?? 'Certified & Transparent';
  const complianceDescription =
    content('td-compliance', 'description') ??
    'Ensuring full regulatory compliance and transparent operations across all our activities.';
  const complianceValues =
    content('td-compliance', 'items') ?? [
      { icon: 'fa-file-shield', title: 'Registered Trust', desc: 'Registered under Bombay Trust Act 2015 with Registration No. E-31948.' },
      { icon: 'fa-certificate', title: '80G Certified', desc: 'Donors get 50% tax exemption under Section 80G of Income Tax Act.' },
      { icon: 'fa-scale-balanced', title: 'Full Compliance', desc: 'All statutory compliances including 12A, PAN, and CSR certifications.' },
      { icon: 'fa-calendar-check', title: 'Annual Reports', desc: 'Transparent activity reports published yearly since inception.' },
    ];

  const testimonialsTag = content('td-testimonials', 'tag') ?? 'TESTIMONIALS';
  const testimonialsHeading = content('td-testimonials', 'heading') ?? 'Verified by Experts';
  const testimonialsDescription =
    content('td-testimonials', 'description') ??
    "What professionals and auditors say about BSCT's compliance and documentation standards.";
  const testimonials =
    content('td-testimonials', 'items') ?? [
      { quote: 'Their documentation and compliance standards are impeccable. A model NGO in terms of transparency.', name: 'CA Sunil Mehta', role: 'Tax Consultant' },
      { quote: 'Having audited their books for 5 years, I can vouch for their financial discipline and proper record-keeping.', name: 'Ravi Agarwal', role: 'Chartered Accountant' },
      { quote: "BSCT's compliance with all regulatory requirements makes them a trusted partner for donors and corporations alike.", name: 'Neha Singh', role: 'CSR Auditor' },
    ];

  const openPdfModal = (idx, docs) => {
    if (!docs[idx]) return;
    setPdfDocs(docs);
    setPdfIdx(idx);
    setPdfOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePdfModal = () => {
    setPdfOpen(false);
    document.body.style.overflow = '';
  };

  const prevPdf = () => {
    setPdfIdx(prev => (prev === 0 ? pdfDocs.length - 1 : prev - 1));
  };

  const nextPdf = () => {
    setPdfIdx(prev => (prev === pdfDocs.length - 1 ? 0 : prev + 1));
  };

  const downloadPdf = () => {
    if (!pdfDocs[pdfIdx]) return;
    const link = document.createElement('a');
    link.href = pdfDocs[pdfIdx].pdf;
    link.download = pdfDocs[pdfIdx].name.replace(/\s+/g, '_') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    document.querySelectorAll('.doc-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.doc-cards').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
      });
    });

    const handleKeyDown = (e) => {
      if (!document.querySelector('.pdf-modal.open')) return;
      if (e.key === 'Escape') closePdfModal();
      if (e.key === 'ArrowLeft') prevPdf();
      if (e.key === 'ArrowRight') nextPdf();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      revealEls.forEach(el => revealObserver.unobserve(el));
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--gold:#D4AF37;--white:#ffffff;--light:#f4f7fb;--text:#333;--text-mid:#4a5568;--light-bg:#f4f7fb}
        body{font-family:'Open Sans',sans-serif;background:#f6fbff;color:var(--text)}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);color:#fff;border-radius:0;margin:20px 0;padding:10px}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;margin:0}
        .hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:0;position:relative;overflow:hidden;padding:10px 8%}
        .hero-content{position:relative;z-index:2;overflow:hidden}
        .hero-content .tag{background:transparent;color:#00a3da;padding:0;border-radius:0;display:inline-block;margin-bottom:25px;font-weight:800;font-size:30px;letter-spacing:1px}
        .hero h1{font-size:62px;line-height:1.1;margin-bottom:25px;color:var(--navy)}
        .hero h1 span{color:#00a3da}
        .hero p{font-size:18px;line-height:1.9;color:#66788a;margin-bottom:35px}
        .hero-buttons{display:flex;gap:18px;flex-wrap:wrap}
        .hero-buttons .donate-btn{display:inline-block;padding:15px 36px;background:#00a3da;color:#fff;text-decoration:none;border-radius:6px;font-weight:700;transition:0.4s;box-shadow:0 10px 25px rgba(11,77,120,0.25)}
        .hero-buttons .donate-btn:hover{background:#007d94;transform:translateY(-1px)}
        .hero-image{position:relative;z-index:2;display:flex;justify-content:center}
        .hero-image img{width:100%;max-width:700px;border-radius:30px;box-shadow:0 25px 50px rgba(0,0,0,0.15);transition:0.5s ease}
        .hero-image img:hover{transform:scale(1.02)}
        .floating-card{position:absolute;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:18px 24px;border-radius:18px;box-shadow:0 15px 35px rgba(0,0,0,0.12);text-align:center;z-index:3;animation:floatCard 3s ease-in-out infinite alternate}
        .floating-card.card1{top:5%;left:-10px;--float-rot:-4deg}
        .floating-card.card2{bottom:10%;right:-10px;animation-delay:2s;--float-rot:4deg}
        .floating-card h3{font-size:28px;font-weight:800;color:#00a3da}
        .floating-card p{font-size:13px;color:#555;margin:0}
        @keyframes floatCard{0%{transform:translateY(0) rotate(var(--float-rot,0deg));}100%{transform:translateY(-15px) rotate(var(--float-rot,0deg));}}
        .blur{position:absolute;width:500px;height:500px;border-radius:50%;filter:blur(120px);opacity:0.15;z-index:0;pointer-events:none}
        .blur1{background:#00a3da;top:-100px;left:-100px}
        .blur2{background:#315270;bottom:-100px;right:-100px}
        @media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center}.hero h1{font-size:42px}.hero p{font-size:16px}.hero-buttons{justify-content:center}.hero-image img{max-width:90%}.floating-card.card1{left:5%}.floating-card.card2{right:5%}}
        @media(max-width:550px){.hero h1{font-size:28px}.hero p{font-size:13px}.hero-image img{max-width:100%;border-radius:16px}.floating-card{padding:6px 10px;border-radius:12px}.floating-card h3{font-size:14px}.floating-card p{font-size:10px}.floating-card.card1{top:0;left:0;border-radius:0 0 12px 0}.floating-card.card2{bottom:0;right:0;border-radius:12px 0 0 0}.blur{display:none}}
        .doc-portal{padding:60px 6%;background:#f4f7fb}
        .doc-portal-inner{max-width:1100px;margin:0 auto}
        .doc-portal-title{text-align:center;margin-bottom:40px}
        .doc-portal-title h2{font-family:'Montserrat',sans-serif;font-size:36px;font-weight:800;color:var(--navy);margin-bottom:8px}
        .doc-portal-title p{font-size:16px;color:#66788a}
        .doc-tabs{display:flex;gap:4px;margin-bottom:40px;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);border-radius:12px;padding:4px;overflow-x:auto}
        .doc-tab{flex:1;padding:14px 20px;text-align:center;border:none;cursor:pointer;font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;color:rgba(255,255,255,0.7);background:transparent;border-radius:10px;transition:0.3s ease;white-space:nowrap;letter-spacing:0.5px}
        .doc-tab:hover{color:#fff;background:rgba(255,255,255,0.1)}
        .doc-tab.active{color:#003b73;background:#fff;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
        .doc-tab i{margin-right:8px}
        .doc-cards{display:none}
        .doc-cards.active{display:block}
        #booklet{display:block}
        .doc-card{display:flex;align-items:center;gap:18px;background:#fff;border-radius:14px;padding:18px 24px;margin-bottom:14px;box-shadow:0 4px 16px rgba(0,0,0,0.06);transition:0.3s ease;cursor:pointer}
        .doc-card:hover{transform:translateX(6px);box-shadow:0 8px 28px rgba(0,0,0,0.12)}
        .doc-card-icon{width:50px;height:50px;min-width:50px;background:linear-gradient(135deg,#00a3da,#0072a0);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px}
        .doc-card-body{flex:1}
        .doc-card-body h4{font-family:'Montserrat',sans-serif;font-size:16px;font-weight:700;color:var(--navy);margin-bottom:4px}
        .doc-card-body p{font-size:13px;color:#66788a;margin:0}
        .doc-card-arrow{width:40px;height:40px;min-width:40px;background:#f0f4f8;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#00a3da;font-size:18px;transition:0.3s ease}
        .doc-card:hover .doc-card-arrow{transform:translateX(6px);background:#00a3da;color:#fff}
        .booklet-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
        .booklet-item{position:relative;overflow:hidden;cursor:pointer;border-radius:6px;border:2px solid #00a3da}
        .booklet-item img{width:100%;display:block;transition:transform 0.5s ease}
        .booklet-item:hover img{transform:scale(1.06)}
        .booklet-overlay{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.7));padding:40px 20px 16px;pointer-events:none}
        .booklet-overlay .year{font-family:'Montserrat',sans-serif;font-weight:700;font-size:22px;color:#fff;letter-spacing:2px}
        .booklet-overlay .status{font-size:11px;color:rgba(255,255,255,0.6);font-style:italic;margin-top:2px}
        @media(max-width:900px){.booklet-grid{grid-template-columns:repeat(2,1fr);gap:20px}}
        @media(max-width:768px){.doc-portal{padding:36px 4%}.doc-tabs{flex-direction:column;gap:2px;border-radius:10px}.doc-tab{font-size:12px;padding:12px}.doc-card{padding:12px 14px}.doc-card-icon{width:40px;height:40px}.doc-card-body h4{font-size:13px}.doc-card-body p{font-size:12px}.doc-card-arrow{width:30px;height:30px}.doc-portal-title h2{font-size:28px}.booklet-grid{gap:14px}}
        .values-section{background:var(--light-bg);padding:80px 24px}
        .values-inner{max-width:1200px;margin:0 auto}
        .values-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;margin-top:50px}
        .value-card{background:#fff;padding:35px 28px;border-radius:28px;box-shadow:0 20px 40px rgba(0,0,0,0.05);text-align:center;position:relative;overflow:hidden;cursor:pointer;transition:0.5s ease}
        .value-card::before{content:'';position:absolute;left:0;bottom:0;width:100%;height:0%;background:var(--cyan);transition:0.5s ease;z-index:1}
        .value-card:hover::before{height:100%}
        .value-card:hover{transform:translateY(-12px)}
        .value-card>*{position:relative;z-index:2;transition:0.4s ease}
        .value-card .val-icon{font-size:2.4rem;color:var(--cyan);margin-bottom:16px}
        .value-card h3{font-family:'Montserrat',sans-serif;font-size:1.15rem;color:var(--navy);margin-bottom:12px}
        .value-card p{font-size:0.88rem;line-height:1.7;color:var(--text-mid)}
        .value-card:hover .val-icon,.value-card:hover h3,.value-card:hover p{color:#fff}
        .testimonials-section{padding:80px 24px;background:#fff}
        .testimonials-inner{max-width:1200px;margin:0 auto}
        .testimonial-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px;margin-top:50px;align-items:stretch}
        .testimonial-card{background:#fff;padding:30px;border-radius:28px;box-shadow:0 20px 40px rgba(0,0,0,0.07);transition:0.4s ease;overflow:hidden;position:relative;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between}
        .testimonial-card::before{content:'';position:absolute;left:0;bottom:0;width:100%;height:0%;background:var(--cyan);transition:0.4s ease;z-index:1;border-radius:28px}
        .testimonial-card:hover::before{height:100%}
        .testimonial-card:hover{transform:translateY(-10px)}
        .testimonial-card>*{position:relative;z-index:2}
        .testimonial-card p{line-height:1.9;color:var(--text-mid);margin-bottom:20px;font-size:0.92rem}
        .testimonial-card h4{font-family:'Montserrat',sans-serif;color:var(--cyan);font-size:1rem}
        .testimonial-card span{font-size:0.8rem;color:var(--text-mid)}
        .testimonial-card:hover p,.testimonial-card:hover h4,.testimonial-card:hover span{color:#fff !important}
        .testimonial-card .quote-icon{font-size:1.6rem;color:var(--cyan-light);margin-bottom:12px;opacity:0.5}
        .testimonial-card:hover .quote-icon{color:rgba(255,255,255,0.6)}
        .reveal{opacity:0;transform:translateY(40px);transition:opacity 0.7s ease,transform 0.7s ease}
        .reveal.visible{opacity:1;transform:translateY(0);width:fit-content}
        .pdf-modal{display:none;position:fixed;inset:0;z-index:10000;align-items:center;justify-content:center}
        .pdf-modal.open{display:flex}
        .pdf-modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.7)}
        .pdf-modal-content{position:relative;width:90%;max-width:900px;height:85vh;background:#fff;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:2}
        .pdf-modal-header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:#f8f9fa;border-bottom:1px solid #e0e0e0}
        .pdf-modal-header h3{font-family:'Montserrat',sans-serif;font-size:16px;color:#125299;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pdf-modal-actions{display:flex;gap:8px}
        .pdf-modal-btn{width:38px;height:38px;border-radius:50%;border:none;background:#eef2f7;color:#125299;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.2s ease}
        .pdf-modal-btn:hover{background:#00a3da;color:#fff}
        .pdf-modal-btn.download-btn{background:#00a3da;color:#fff}
        .pdf-modal-btn.download-btn:hover{background:#007d94}
        .pdf-modal-body{flex:1;position:relative}
        .pdf-modal-body iframe{width:100%;height:100%;border:none}
        @media(max-width:768px){.pdf-modal-content{width:95%;height:75vh}.pdf-modal-btn{width:32px;height:32px;font-size:14px}}
        @media(max-width:768px){.values-grid{grid-template-columns:1fr}.testimonial-grid{grid-template-columns:1fr}}
      `}</style>

      <section className="tax-box"><h1>{pageTitle}</h1></section>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tag">{heroTag}</span>
          <h1>{heroHeading} <span>{heroHighlight}</span></h1>
          <p>{heroDescription}</p>
          <div className="hero-buttons"><a href="#documents" className="donate-btn">View Documents</a></div>
          <div className="blur blur1"></div><div className="blur blur2"></div>
        </div>
        <div className="hero-image">
          <div className="floating-card card1"><h3>{heroCard1Value}</h3><p>{heroCard1Label}</p></div>
          <div className="floating-card card2"><h3>{heroCard2Value}</h3><p>{heroCard2Label}</p></div>
          <img src={heroImage} alt="Trust Documents" />
        </div>
      </section>

      <section className="doc-portal" id="documents">
        <div className="doc-portal-inner">
          <div className="doc-portal-title"><h2>{bookletTitle}</h2></div>
          <div className="doc-cards" id="booklet">
            <div className="booklet-grid">
              {bookletData.map((item) => (
                <div
                  key={item.year}
                  className="booklet-item"
                  onClick={() => {
                    if (!item.pdf) return;
                    const docs = bookletData.filter(b => b.pdf).map(b => ({ pdf: b.pdf, name: 'Activity Report ' + b.year }));
                    const idx = docs.findIndex(d => d.pdf === item.pdf);
                    if (idx !== -1) openPdfModal(idx, docs);
                  }}
                >
                  <img src={item.img} alt={item.year} loading="lazy" />
                  <div className="booklet-overlay">
                    <div className="year">{item.year}</div>
                    {!item.pdf && <div className="status">PDF coming soon</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="doc-portal-title"><h2>{portalTitle}</h2><p>{portalSubtitle}</p></div>
          <div className="doc-tabs">
            <button className="doc-tab active" data-tab="legal-docs"><i className="fas fa-file-shield"></i> {tab1Label}</button>
            <button className="doc-tab" data-tab="audit-reports"><i className="fas fa-clipboard-check"></i> {tab2Label}</button>
          </div>
          <div className="doc-cards active" id="legal-docs">
            {legalDocs.map((doc) => (
              <div key={doc.title} className="doc-card" onClick={() => {
                const docs = legalDocs.map(d => ({ pdf: d.pdf, name: d.title }));
                const idx = docs.findIndex(d => d.pdf === doc.pdf);
                if (idx !== -1) openPdfModal(idx, docs);
              }}>
                <div className="doc-card-icon"><i className={doc.icon}></i></div>
                <div className="doc-card-body"><h4>{doc.title}</h4><p>{doc.desc}</p></div>
                <div className="doc-card-arrow"><i className="fas fa-arrow-right"></i></div>
              </div>
            ))}
          </div>
          <div className="doc-cards" id="audit-reports">
            {auditDocs.map((doc) => (
              <div key={doc.title} className="doc-card" onClick={() => {
                const docs = auditDocs.map(d => ({ pdf: d.pdf, name: d.title }));
                const idx = docs.findIndex(d => d.pdf === doc.pdf);
                if (idx !== -1) openPdfModal(idx, docs);
              }}>
                <div className="doc-card-icon"><i className={doc.icon}></i></div>
                <div className="doc-card-body"><h4>{doc.title}</h4><p>{doc.desc}</p></div>
                <div className="doc-card-arrow"><i className="fas fa-arrow-right"></i></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={`pdf-modal${pdfOpen ? ' open' : ''}`} ref={modalRef}>
        <div className="pdf-modal-overlay" onClick={closePdfModal}></div>
        <div className="pdf-modal-content">
          <div className="pdf-modal-header">
            <h3>{pdfDocs[pdfIdx]?.name || 'Document'}</h3>
            <div className="pdf-modal-actions">
              <button className="pdf-modal-btn download-btn" title="Download" onClick={downloadPdf}><i className="fas fa-download"></i></button>
              <button className="pdf-modal-btn" title="Previous" onClick={prevPdf}><i className="fas fa-chevron-left"></i></button>
              <button className="pdf-modal-btn" title="Next" onClick={nextPdf}><i className="fas fa-chevron-right"></i></button>
              <button className="pdf-modal-btn" title="Close" onClick={closePdfModal}><i className="fas fa-times"></i></button>
            </div>
          </div>
          <div className="pdf-modal-body">
            <iframe src={pdfOpen && pdfDocs[pdfIdx] ? pdfDocs[pdfIdx].pdf : ''} title="PDF Viewer"></iframe>
          </div>
        </div>
      </div>

      <section className="values-section">
        <div className="values-inner">
          <div className="section-title"><span className="section-label">{complianceTag}</span><h2>{complianceHeading}</h2><p>{complianceDescription}</p></div>
          <div className="values-grid">
            {complianceValues.map((v, i) => (
              <div className="value-card reveal" key={i}><div className="val-icon"><i className={`fas ${v.icon}`}></i></div><h3>{v.title}</h3><p>{v.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div className="section-title"><span className="section-label">{testimonialsTag}</span><h2>{testimonialsHeading}</h2><p>{testimonialsDescription}</p></div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card reveal" key={i}><div className="quote-icon"><i className="fas fa-quote-left"></i></div><p>{t.quote}</p><div><h4>{t.name}</h4><span>{t.role}</span></div></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TrustDocuments;
