import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';

const CSR = () => {
  const content = usePageContent('csr');

  const pageTitle = content('csr-title', 'heading') ?? 'CSR Partnership';

  const intro =
    content('csr-intro', 'paragraphs') ?? [
      'At Being Sevak Charitable Trust, we believe that meaningful social transformation becomes possible when corporates and NGOs come together with a shared vision for community development.',
      'The partnership between corporates and Non-Government Organizations creates a powerful and sustainable impact. While corporates contribute valuable resources, expertise, and CSR support, NGOs bring deep grassroots understanding, community reach, and effective implementation capabilities. Together, this collaboration helps create long-term and measurable social change.',
      'Being Sevak Charitable Trust has been actively working across various sectors including healthcare, education, women empowerment, skill development, disability inclusion, livelihood generation, and community welfare. Through our dedicated initiatives and strong community network, we continue to serve underprivileged and specially-abled individuals with compassion and commitment.',
      'We maintain the highest standards of transparency, accountability, and ethical practices, making BSCT a trusted partner for organizations looking to create impactful CSR initiatives aligned with sustainable development goals.',
      'We welcome corporates, institutions, and partners to collaborate with us in building an inclusive, empowered, and better society for a all.',
    ];

  const initiativesTag = content('csr-initiatives', 'tag') ?? 'WHAT WE FOCUS ON';
  const initiativesTitle = content('csr-initiatives', 'title') ?? 'Our Initiatives';
  const initiativesSubtitle =
    content('csr-initiatives', 'subtitle') ?? 'These programs strengthen our role as a trusted NGO in India for CSR projects';
  const initiatives =
    content('csr-initiatives', 'items') ?? [
      { iconClass: 'bs-initiative__icon--edu', icon: 'fa-graduation-cap', label: 'Education', desc: 'Empowering children & youth with quality learning opportunities' },
      { iconClass: 'bs-initiative__icon--live', icon: 'fa-briefcase', label: 'Livelihood', desc: 'Building sustainable income sources through skill development' },
      { iconClass: 'bs-initiative__icon--env', icon: 'fa-leaf', label: 'Environment', desc: 'Protecting nature through conservation & green initiatives' },
      { iconClass: 'bs-initiative__icon--sport', icon: 'fa-running', label: 'Sports', desc: 'Fostering teamwork, health & excellence through sports' },
      { iconClass: 'bs-initiative__icon--art', icon: 'fa-palette', label: 'Arts & Culture', desc: 'Preserving heritage & nurturing creative expression' },
      { iconClass: 'bs-initiative__icon--health', icon: 'fa-heartbeat', label: 'Health & Nutrition', desc: 'Ensuring wellness & food security for communities' },
      { iconClass: 'bs-initiative__icon--tech', icon: 'fa-cogs', label: 'Assistive Technology', desc: 'Enabling independence through innovative support tools' },
    ];

  const highlightHeading = content('csr-highlight', 'heading') ?? 'Partner With Us';
  const highlightEmail = content('csr-highlight', 'email') ?? 'being.sevak@gmail.com';
  const highlightPhone = content('csr-highlight', 'phone') ?? '+91 8879035035';
  const highlightTagline = content('csr-highlight', 'tagline') ?? '"Together, We Can Create Lasting Social Impact."';

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Open Sans',sans-serif;background:#f5fcfd;color:#1a1a2e;overflow-x:hidden}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);color:#fff;border-radius:0px;margin:20px 0;padding:10px;box-shadow:0 15px 40px rgba(0,0,0,0.15);position:relative;overflow:hidden;transition:0.4s ease}
        .tax-box::before{content:"";position:absolute;width:200%;height:200%;background:radial-gradient(circle,rgba(255,255,255,0.15),transparent);top:-50%;left:-50%;animation:shine 6s linear infinite}
        @keyframes shine{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;margin:0;position:relative;z-index:2}
        .tax-box:hover{transform:translateY(-5px) scale(1.01);box-shadow:0 25px 60px rgba(0,163,218,0.35)}
        .csr-section{padding:80px 8%;max-width:1200px;margin:0 auto}
        .csr-card{background:#fff;border-radius:20px;padding:50px;box-shadow:0 20px 50px rgba(0,0,0,0.08);margin-bottom:40px;transition:transform 0.4s ease,box-shadow 0.4s ease;animation:fadeUp 0.8s ease;border-left:5px solid #00a3da;position:relative;overflow:hidden}
        .csr-card::before{content:'';position:absolute;top:0;right:0;width:200px;height:200px;background:radial-gradient(circle,rgba(0,163,218,0.06),transparent);border-radius:50%}
        .csr-card:hover{transform:translateY(-8px);box-shadow:0 30px 60px rgba(0,163,218,0.15)}
        .csr-card p{font-size:17px;line-height:1.9;color:#4a5568;margin-bottom:20px;position:relative;z-index:1}
        .csr-card p:last-child{margin-bottom:0}
        .csr-highlight{background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);border-radius:20px;padding:50px;color:#fff;text-align:center;animation:fadeUp 1s ease;position:relative;overflow:hidden}
        .csr-highlight::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='rgba(255,255,255,0.05)' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,138.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E") no-repeat bottom;background-size:cover;opacity:0.2}
        .csr-highlight *{position:relative;z-index:1}
        .csr-highlight h2{font-family:'Montserrat',sans-serif;font-size:36px;font-weight:800;margin-bottom:20px}
        .csr-highlight p{font-size:18px;line-height:1.8;opacity:0.95;margin-bottom:30px}
        .csr-contact{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;margin-top:10px}
        .csr-contact-item{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:600}
        .csr-contact-item i{font-size:24px;width:50px;height:50px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:0.3s}
        .csr-contact-item:hover i{background:rgba(255,255,255,0.3);transform:scale(1.1)}
        .csr-tagline{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:700;font-style:italic;margin-top:20px;opacity:0.9}
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        .bs-initiatives{background:#f4f6f9;padding:70px 20px;font-family:'Segoe UI',Arial,sans-serif}
        .bs-initiatives__inner{max-width:1100px;margin:0 auto}
        .bs-initiatives__head{text-align:center;margin-bottom:50px}
        .bs-initiatives__tag{display:inline-block;font-size:12px;font-weight:700;letter-spacing:3px;color:#00a3da;text-transform:uppercase;margin-bottom:10px}
        .bs-initiatives__title{font-size:2.2rem;font-weight:800;color:#1a1a2e;margin:0 0 12px}
        .bs-initiatives__sub{font-size:1.05rem;color:#666;margin:0}
        .bs-initiatives__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:30px 24px}
        .bs-initiative{background:#fff;border-radius:18px;padding:32px 20px 28px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,0.06);transition:transform 0.35s ease,box-shadow 0.35s ease;cursor:default}
        .bs-initiative:hover{transform:translateY(-8px);box-shadow:0 16px 40px rgba(0,163,218,0.15)}
        .bs-initiative__icon{width:76px;height:76px;border-radius:50%;margin:0 auto 18px;display:flex;align-items:center;justify-content:center;font-size:30px;color:#fff;transition:transform 0.35s ease,box-shadow 0.35s ease}
        .bs-initiative:hover .bs-initiative__icon{transform:scale(1.1);box-shadow:0 8px 24px rgba(0,0,0,0.15)}
        .bs-initiative__icon--edu{background:linear-gradient(135deg,#009BD4,#046FB1)}
        .bs-initiative__icon--live{background:linear-gradient(135deg,#0285C3,#074D97)}
        .bs-initiative__icon--env{background:linear-gradient(135deg,#43a047,#2e7d32)}
        .bs-initiative__icon--sport{background:linear-gradient(135deg,#e53935,#b71c1c)}
        .bs-initiative__icon--art{background:linear-gradient(135deg,#f0b429,#e65100)}
        .bs-initiative__icon--health{background:linear-gradient(135deg,#00a3da,#007d94)}
        .bs-initiative__icon--tech{background:linear-gradient(135deg,#1565c0,#0d47a1)}
        .bs-initiative__label{font-size:1.1rem;font-weight:700;color:#1a1a2e;margin:0 0 8px}
        .bs-initiative__desc{font-size:0.88rem;color:#777;line-height:1.5;margin:0}
        @media(max-width:900px){.bs-initiatives__grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:768px){.tax-box{height:auto;padding:14px 10px}.tax-box h1{font-size:22px}.csr-section{padding:50px 5%}.csr-card{padding:30px 24px}.csr-card p{font-size:15px}.csr-highlight{padding:35px 24px}.csr-highlight h2{font-size:28px}.csr-highlight p{font-size:15px}.csr-contact{flex-direction:column;align-items:center;gap:20px}.csr-contact-item{font-size:16px}.csr-tagline{font-size:18px}.bs-initiatives__title{font-size:1.7rem}}
        @media(max-width:500px){.tax-box h1{font-size:18px}.csr-card{padding:24px 18px}.bs-initiatives__grid{grid-template-columns:1fr}}
      `}</style>

      <section className="tax-box">
        <h1>{pageTitle}</h1>
      </section>

      <section className="csr-section">
        {intro.map((text, i) => (
          <div className="csr-card" key={i}>
            <p>{text}</p>
          </div>
        ))}

        <section className="bs-initiatives">
          <div className="bs-initiatives__inner">
            <header className="bs-initiatives__head">
              <span className="bs-initiatives__tag">{initiativesTag}</span>
              <h2 className="bs-initiatives__title">{initiativesTitle}</h2>
              <p className="bs-initiatives__sub">{initiativesSubtitle}</p>
            </header>
            <div className="bs-initiatives__grid">
              {initiatives.map((item, i) => (
                <div className="bs-initiative" key={i}>
                  <div className={`bs-initiative__icon ${item.iconClass}`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="bs-initiative__label">{item.label}</h3>
                  <p className="bs-initiative__desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="csr-highlight">
          <h2>{highlightHeading}</h2>
          <div className="csr-contact">
            <a href={'mailto:' + highlightEmail} className="csr-contact-item" style={{color:'inherit',textDecoration:'none'}} onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:' + highlightEmail; }}>
              <i className="fas fa-envelope"></i>
              {highlightEmail}
            </a>
            <a href={'tel:' + highlightPhone.replace(/\s+/g, '')} className="csr-contact-item" style={{color:'inherit',textDecoration:'none'}}>
              <i className="fas fa-phone"></i>
              {highlightPhone}
            </a>
          </div>
          <p className="csr-tagline">{highlightTagline}</p>
        </div>
      </section>
    </>
  );
};

export default CSR;
