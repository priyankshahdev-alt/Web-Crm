import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const Management = () => {
  const content = usePageContent('management');

  const pageTitle = content('management-title', 'heading') ?? 'Our Management';

  const founderName = content('management-founder', 'name') ?? 'Priyank Shah';
  const founderRole = content('management-founder', 'role') ?? 'Founder Chairman â€“ BEING SEVAK CHARITABLE TRUST';
  const founderImage = content('management-founder', 'image') ?? '/images/managesir.png';
  const founderLeft =
    content('management-founder', 'left') ?? [
      { icon: 'ðŸ…', text: 'Being Sevak Charitable Trust (BSCT) is driven by a vision of creating meaningful social impact through healthcare, education, environmental sustainability, women empowerment, and community welfare initiatives across India.' },
      { icon: 'â', text: 'Our mission is to serve humanity with compassion, dignity, and purpose, ensuring that no individual is left behind.' },
    ];
  const founderRight =
    content('management-founder', 'right') ?? [
      { icon: 'ðŸ‘ï¸', text: 'Guided by compassion and social responsibility, BSCT envisions an inclusive future where every individual can thrive with dignity, equal opportunities, and access to essential resources.' },
      { icon: 'ðŸ†', text: 'Through impactful projects in healthcare, education, women empowerment, environmental conservation, and humanitarian assistance, Being Sevak Charitable Trust continues to drive meaningful change and inspire communities nationwide.' },
    ];

  const teamHeading = content('management-team', 'heading') ?? 'Management Team';
  const teamSubtitle =
    content('management-team', 'subtitle') ??
    'Meet the dedicated leaders of Being Sevak Charitable Trust who are passionately working towards social welfare, empowerment, and inclusive growth for society.';
  const team =
    content('management-team', 'members') ?? [
      { image: '/images/priyank shah.jpeg', name: 'Priyank Shah', role: 'Founder & Chairperson' },
      { image: '/images/swethashah.jpeg', name: 'Shweta Shah', role: 'President' },
      { image: '/images/riddhi.jpg', name: 'Riddhi Patel', role: 'Treasurer' },
      { image: '/images/Mahendrapal.jpeg', name: 'Mahendra Pal', role: 'Core Team Member' },
      { image: '/images/ashutoshpawar.jpeg', name: 'Ashutosh Pawar', role: 'Core Team Member' },
      { image: '/images/vaishalisawant.jpeg', name: 'Vaishali Sawant', role: 'Core Team Member' },
      { image: '/images/SakshiSingh.jpeg', name: 'Sakshi Singh', role: 'Core Team Member' },
    ];

  const leadershipTag = content('management-leadership', 'tag') ?? 'OUR LEADERSHIP';
  const leadershipHeading = content('management-leadership', 'heading') ?? 'Meet Our Guiding Force';
  const leadership =
    content('management-leadership', 'items') ?? [
      { icon: 'fa-users', title: 'Visionary Leadership', desc: 'Guided by experienced trustees with decades of social welfare expertise.' },
      { icon: 'fa-handshake', title: 'Integrity', desc: 'Transparent governance and ethical practices in all our operations.' },
      { icon: 'fa-lightbulb', title: 'Innovation', desc: 'Modern approaches to age-old social challenges for maximum impact.' },
      { icon: 'fa-heart', title: 'Dedication', desc: 'Passionate team committed to uplifting communities across India.' },
    ];

  const testimonialsTag = content('management-testimonials', 'tag') ?? 'TESTIMONIALS';
  const testimonialsHeading = content('management-testimonials', 'heading') ?? 'What Partners Say';
  const testimonials =
    content('management-testimonials', 'items') ?? [
      { quote: 'Under the leadership of Priyank Shah and Shweta Shah, BSCT has grown into a trusted organization serving thousands across India.', name: 'Rahul Verma', role: 'NGO Partner' },
      { quote: "The management team's transparency and dedication inspire confidence in every donor and volunteer.", name: 'Dr. Meera Kulkarni', role: 'Social Worker' },
      { quote: 'What sets BSCT apart is the genuine compassion its leaders bring to every initiative.', name: 'Vikram Joshi', role: 'Corporate Sponsor' },
    ];

  useEffect(() => {
    const items = document.querySelectorAll(".animate-up, .animate-zoom");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    items.forEach(function (item) { observer.observe(item); });

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
    return () => {
      items.forEach(i => observer.unobserve(i));
      revealEls.forEach(el => revealObserver.unobserve(el));
    };
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light-bg:#f4f7fb;--text-dark:#1a1a2e;--text-mid:#4a5568;--gold:#D4AF37}
        body{font-family:'Open Sans',sans-serif;color:var(--text-dark)}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);color:#fff;border-radius:0;margin:20px 0;padding:10px}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;margin:0}
        .leadership-section{max-width:1200px;margin:0 auto;padding:30px 28px}
        .section-title{font-family:'Montserrat',sans-serif;font-weight:900;font-size:2.2rem;color:var(--cyan);text-align:center;margin-bottom:12px}
        .section-subtitle{text-align:center;font-size:0.95rem;color:var(--text-mid);margin-bottom:56px;line-height:1.7;max-width:600px;margin-left:auto;margin-right:auto}
        .section-subtitle::after{content:'';display:block;width:60px;height:4px;background:var(--cyan);margin:18px auto 0;border-radius:2px}
        .team-circles{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:40px 30px;margin-top:10px}
        .team-member{text-align:center;transition:transform 0.4s ease}
        .team-member:hover{transform:translateY(-8px)}
        .team-member-img{width:160px;height:160px;border-radius:50%;object-fit:cover;border:5px solid var(--cyan);box-shadow:0 10px 30px rgba(0,163,218,0.25);transition:box-shadow 0.4s ease,transform 0.4s ease;margin:0 auto 18px;display:block;background:#eef6fb}
        .team-member:hover .team-member-img{box-shadow:0 16px 45px rgba(0,163,218,0.4);transform:scale(1.05)}
        .team-member-name{font-family:'Montserrat',sans-serif;font-weight:800;font-size:1.1rem;color:var(--navy);margin-bottom:4px}
        .team-member-role{font-family:'Montserrat',sans-serif;font-weight:600;font-size:0.82rem;color:var(--cyan);text-transform:uppercase;letter-spacing:0.5px}
        .team-member-divider{width:40px;height:3px;background:var(--cyan);margin:10px auto 0;border-radius:2px}
        @media(max-width:768px){.team-circles{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:30px 20px}.team-member-img{width:120px;height:120px}.team-member-name{font-size:1rem}}
        .founder-section{max-width:1140px;margin:0 auto;padding:60px 20px;text-align:center;font-family:Arial,sans-serif;overflow:hidden}
        .founder-heading{display:flex;align-items:center;justify-content:center;gap:15px;margin-bottom:10px}
        .heading-line{width:50px;height:3px;background-color:#00a3da;display:inline-block}
        .founder-heading h2{font-size:26px;color:#222;margin:0;font-weight:bold}
        .founder-subtitle{font-size:18px;color:#444;margin-bottom:50px}
        .founder-grid{display:flex;justify-content:space-between;align-items:center;gap:20px}
        .founder-col{flex:1;display:flex;flex-direction:column;gap:60px}
        .founder-item{text-align:center}
        .founder-icon{width:70px;height:70px;margin:0 auto 18px;display:flex;align-items:center;justify-content:center;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.12);font-size:30px;color:#00a3da}
        .founder-item p{font-size:15px;line-height:1.6;color:#555;margin:0}
        .founder-image{flex:1;text-align:center}
        .founder-image img{max-width:100%;height:auto}
        .animate-up{opacity:0;transform:translateY(60px);transition:opacity 0.8s ease,transform 0.8s ease}
        .animate-zoom{opacity:0;transform:scale(0.6);transition:opacity 1s ease,transform 1s ease}
        .animate-up.show{opacity:1;transform:translateY(0)}
        .animate-zoom.show{opacity:1;transform:scale(1)}
        @media(max-width:768px){.founder-grid{flex-direction:column}.founder-col{gap:40px}}
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
        .reveal.visible{opacity:1;transform:translateY(0)}
        @media(max-width:768px){.values-grid{grid-template-columns:1fr}.testimonial-grid{grid-template-columns:1fr}}
      `}</style>

      <section className="tax-box"><h1>{pageTitle}</h1></section>

      <section className="founder-section">
        <div className="founder-heading"><span className="heading-line"></span><h2>{founderName}</h2></div>
        <p className="founder-subtitle">{founderRole}</p>
        <div className="founder-grid">
          <div className="founder-col left">
            {founderLeft.map((item, i) => (
              <div className="founder-item animate-up" key={i}><div className="founder-icon">{item.icon}</div><p>{item.text}</p></div>
            ))}
          </div>
          <div className="founder-image animate-zoom"><img src={founderImage} alt={founderName} loading="lazy" decoding="async" width="800" height="600" /></div>
          <div className="founder-col right">
            {founderRight.map((item, i) => (
              <div className="founder-item animate-up" key={i}><div className="founder-icon">{item.icon}</div><p>{item.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="leadership-section">
        <h2 className="section-title">{teamHeading}</h2>
        <p className="section-subtitle">{teamSubtitle}</p>
        <div className="team-circles">
          {team.map((m, i) => (
            <div className="team-member" key={i}><img src={m.image} alt={m.name} className="team-member-img" loading="lazy" decoding="async" width="800" height="600" /><div className="team-member-name">{m.name}</div><div className="team-member-role">{m.role}</div><div className="team-member-divider"></div></div>
          ))}
        </div>
      </section>

      <section className="values-section">
        <div className="values-inner">
          <div className="section-header" style={{textAlign:'center'}}>
            <span style={{color:'var(--cyan)',fontWeight:700,fontSize:'1.5rem',letterSpacing:1,display:'block',marginBottom:8}}>{leadershipTag}</span>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:'2rem',color:'var(--navy)'}}>{leadershipHeading}</h2>
          </div>
          <div className="values-grid">
            {leadership.map((v, i) => (
              <div className="value-card reveal" key={i}><div className="val-icon"><i className={`fas ${v.icon}`}></i></div><h3>{v.title}</h3><p>{v.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div className="section-header" style={{textAlign:'center'}}>
            <span style={{color:'var(--cyan)',fontWeight:700,fontSize:'1.5rem',letterSpacing:1,display:'block',marginBottom:8}}>{testimonialsTag}</span>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:'2rem',color:'var(--navy)'}}>{testimonialsHeading}</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card reveal" key={i}><div><div className="quote-icon"><i className="fas fa-quote-left"></i></div><p>{t.quote}</p></div><div><h4>{t.name}</h4><span>{t.role}</span></div></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Management;

