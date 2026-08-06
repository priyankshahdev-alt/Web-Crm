import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const Awards = () => {
  const content = usePageContent('awards');

  const pageTitle = content('awards-title', 'heading') ?? 'Awards & Achievements';

  const heroTag = content('awards-hero', 'tag') ?? 'BEING SEVAK CHARITABLE TRUST';
  const heroHeading = content('awards-hero', 'heading') ?? 'Awards &';
  const heroHighlight = content('awards-hero', 'highlight') ?? 'Achievements';
  const heroDescription =
    content('awards-hero', 'description') ??
    'Recognized nationally for outstanding contribution to social welfare, community development, and humanitarian service across India.';
  const heroCard1Value = content('awards-hero', 'card1Value') ?? '17+';
  const heroCard1Label = content('awards-hero', 'card1Label') ?? 'National Awards';
  const heroCard2Value = content('awards-hero', 'card2Value') ?? '1M+';
  const heroCard2Label = content('awards-hero', 'card2Label') ?? 'Lives Impacted';
  const heroImage = content('awards-hero', 'image') ?? '/images/awardsAchive.jpg';

  const awardsTitle = content('awards-list', 'title') ?? 'Our Achievements';
  const awards =
    content('awards-list', 'items') ?? [
      { image: '/images/IIIA AWARD.jpg', alt: 'IIIA Award', name: 'IIIA AWARD' },
      { image: '/images/COVID WARRIOR.jpg', alt: 'Covid Warrior', name: 'COVID WARRIOR' },
      { image: '/images/BUSINESS AWARD 2023.jpg', alt: 'Business Award 2023', name: 'BUSINESS AWARD 2023' },
      { image: '/images/ACHIEVEMENT AWARD.jpg', alt: 'Achievement Award', name: 'ACHIEVEMENT AWARD' },
      { image: '/images/SEVAK STAR AWARD.jpg', alt: 'Sevak Star Award', name: 'SEVAK STAR AWARD' },
      { image: '/images/POPULAR CIVILIAN   AWARD.jpg', alt: 'Popular Civilian Award', name: 'POPULAR CIVILIAN AWARD' },
      { image: '/images/DADA SAHEB.jpg', alt: 'Dada Saheb Phalke Award', name: 'DADA SAHEB PHALKE AWARD' },
      { image: '/images/PRIDE OF INDIA ICON AWARD.jpg', alt: 'Pride of India Icon Award', name: 'PRIDE OF INDIA ICON AWARD' },
      { image: '/images/BUSINESS AWARD 2023 (1).jpg', alt: 'Business Award 2023', name: 'BUSINESS AWARD 2023' },
      { image: '/images/MAHATMA GANDHI RATNA AWARD.jpg', alt: 'Mahatma Gandhi Ratna Award', name: 'MAHATMA GANDHI RATNA AWARD' },
      { image: '/images/CHHATRAPATI SHIVAJI   MAHARAJ GAURAV AWARD 2021.jpg', alt: 'Shivaji Maharaj Gaurav Award', name: 'SHIVAJI MAHARAJ GAURAV AWARD' },
      { image: '/images/BORIVALI BLOOD CENTRE  AWARD.jpg', alt: 'Borivali Blood Centre Award', name: 'BORIVALI BLOOD CENTRE AWARD' },
      { image: '/images/MARATHA LIFE FOUNDATION AWARD.jpg', alt: 'Maratha Life Foundation', name: 'MARATHA LIFE FOUNDATION' },
    ];

  const lettersTitle = content('awards-letters', 'title') ?? 'Appreciation Letters';
  const letters =
    content('awards-letters', 'images') ?? [
      { src: '/images/appre1.jpeg', alt: 'Appreciation 1' },
      { src: '/images/appre2.jpeg', alt: 'Appreciation 2' },
      { src: '/images/appre3.jpeg', alt: 'Appreciation 3' },
      { src: '/images/appre4.jpeg', alt: 'Appreciation 4' },
      { src: '/images/appre5.jpeg', alt: 'Appreciation 5' },
      { src: '/images/appre6.jpeg', alt: 'Appreciation 6' },
      { src: '/images/appre7.jpeg', alt: 'Appreciation 7' },
      { src: '/images/appre8.jpeg', alt: 'Appreciation 8' },
      { src: '/images/appre9.jpeg', alt: 'Appreciation 9' },
      { src: '/images/appre11.jpg', alt: 'Appreciation 11' },
    ];

  const honorsTag = content('awards-honors', 'tag') ?? 'OUR HONORS';
  const honorsHeading = content('awards-honors', 'heading') ?? 'Awards & Recognition';
  const honors =
    content('awards-honors', 'items') ?? [
      { icon: 'fa-trophy', title: 'National Recognition', desc: 'Honored with prestigious awards including Dada Saheb Phalke Award and Mahatma Gandhi Ratna.' },
      { icon: 'fa-star', title: 'Excellence', desc: 'Recognized for outstanding contribution to social welfare and community development.' },
      { icon: 'fa-medal', title: 'World Records', desc: 'Harvard World Record and multiple national accolades for humanitarian work.' },
      { icon: 'fa-award', title: 'Industry Honor', desc: 'IIIA Award, Business Award 2023, and numerous other prestigious recognitions.' },
    ];

  const testimonialsTag = content('awards-testimonials', 'tag') ?? 'TESTIMONIALS';
  const testimonialsHeading = content('awards-testimonials', 'heading') ?? 'Recognized by Leaders';
  const testimonials =
    content('awards-testimonials', 'items') ?? [
      { quote: "BSCT's award-winning work in education and nourishment sets a benchmark for NGOs across India.", name: 'Dr. Amit Sharma', role: 'Award Committee Member' },
      { quote: 'Their Harvard World Record is a testament to the scale and quality of their social impact.', name: 'Prof. Sunita Reddy', role: 'Academic & Researcher' },
      { quote: "Being Sevak's achievements inspire other organizations to strive for excellence in social service.", name: 'Rajiv Kapoor', role: 'Philanthropist' },
    ];

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
    return () => revealEls.forEach(el => revealObserver.unobserve(el));
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light-bg:#f4f7fb;--text-dark:#1a1a2e;--text-mid:#4a5568;--gold:#D4AF37}
        body{font-family:'Open Sans',sans-serif;color:var(--text-dark);background:#fff;scroll-behavior:smooth}
        .section-title{text-align:center;font-size:34px;font-weight:800;margin:55px auto 25px;color:var(--cyan);font-family:'Montserrat',sans-serif;display:block;width:100%;max-width:1400px;padding:0 60px}
        .awards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:25px;padding:20px 60px 70px;max-width:1400px;margin:auto}
        .award-card{background:#fff;border-radius:14px;box-shadow:0 5px 18px rgba(0,0,0,0.1);overflow:hidden;text-align:center;transition:0.3s}
        .award-card:hover{transform:translateY(-6px)}
        .award-card img{width:100%;height:240px;object-fit:contain;padding:15px;background:#fff}
        .award-name{background:#00a3da;color:#fff;padding:14px;font-weight:700;font-size:16px;font-family:'Montserrat',sans-serif;text-align:center}
        .letter-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;padding:20px 60px 80px;max-width:1400px;margin:auto}
        .letter-grid img{width:100%;height:340px;object-fit:contain;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.1);transition:0.3s;background:#fff}
        .letter-grid img:hover{transform:scale(1.03)}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);color:#fff;border-radius:0;margin:20px 0;padding:10px}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:20px;font-weight:800;letter-spacing:2px;color:#fff;margin:0;padding:10px}
        .hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:0;position:relative;overflow:hidden;padding:10px 8%}
        .hero-content{position:relative;z-index:2}
        .hero-content .tag{background:transparent;color:#00a3da;padding:0;border-radius:0;display:inline-block;margin-bottom:25px;font-weight:800;font-size:35px;letter-spacing:1px}
        .hero h1{font-size:20px;line-height:1.1;font-weight:800;margin-bottom:25px;padding:10px;color:var(--navy)}
        .hero h1 span{color:#00a3da}
        .hero p{font-size:18px;line-height:1.9;color:#66788a;margin-bottom:35px}
        .hero-buttons{display:flex;gap:18px;flex-wrap:wrap}
        .hero-buttons .donate-btn{display:inline-block;padding:15px 36px;background:#00a3da;color:#fff;text-decoration:none;border-radius:6px;font-weight:700;transition:0.4s;box-shadow:0 10px 25px rgba(11,77,120,0.25)}
        .hero-buttons .donate-btn:hover{background:#007d94;transform:translateY(-1px)}
        .hero-image{position:relative;z-index:2;display:flex;justify-content:center}
        .hero-image img{width:100%;max-width:500px;border-radius:30px;box-shadow:0 25px 50px rgba(0,0,0,0.15);transition:0.5s ease}
        .hero-image img:hover{transform:scale(1.02)}
        .floating-card{position:absolute;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:18px 24px;border-radius:18px;box-shadow:0 15px 35px rgba(0,0,0,0.12);text-align:center;z-index:3;animation:floatCard 3s ease-in-out infinite alternate}
        .floating-card.card1{top:5%;left:-10px}
        .floating-card.card2{bottom:10%;right:-10px;animation-delay:2s}
        .floating-card h3{font-size:28px;font-weight:800;color:#00a3da}
        .floating-card p{font-size:13px;color:#555;margin:0}
        @keyframes floatCard{0%{transform:translateY(0);}100%{transform:translateY(-15px);}}
        .blur{position:absolute;width:500px;height:500px;border-radius:50%;filter:blur(120px);opacity:0.15;z-index:0;pointer-events:none}
        .blur1{background:#00a3da;top:-100px;left:-100px}
        .blur2{background:#315270;bottom:-100px;right:-100px}
        @media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center;gap:50px}.hero h1{font-size:42px}.hero p{font-size:16px}.hero-buttons{justify-content:center}.hero-image img{max-width:90%}.floating-card.card1{left:5%}.floating-card.card2{right:5%}}
        @media(max-width:550px){.hero h1{font-size:32px}.hero p{font-size:14px}.floating-card{padding:12px 16px}.floating-card h3{font-size:22px}}
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
        @media(max-width:768px){.awards-grid{padding:20px;grid-template-columns:1fr}.letter-grid{padding:20px;grid-template-columns:1fr}.values-grid{grid-template-columns:1fr}.testimonial-grid{grid-template-columns:1fr}}
      `}</style>

      <section className="tax-box"><h1>{pageTitle}</h1></section>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tag">{heroTag}</span>
          <h1>{heroHeading} <span>{heroHighlight}</span></h1>
          <p>{heroDescription}</p>
          <div className="hero-buttons"><a href="#achievements" className="donate-btn">View Awards</a></div>
        </div>
        <div className="hero-image">
          <div className="floating-card card1"><h3>{heroCard1Value}</h3><p>{heroCard1Label}</p></div>
          <div className="floating-card card2"><h3>{heroCard2Value}</h3><p>{heroCard2Label}</p></div>
          <img src={heroImage} alt="Awards"/>
        </div>
        <div className="blur blur1"></div><div className="blur blur2"></div>
      </section>

      <h2 className="section-title reveal" id="achievements">{awardsTitle}</h2>
      <div className="awards-grid reveal">
        {awards.map((award, i) => (
          <div className="award-card" key={i}><img src={award.image} alt={award.alt}/><div className="award-name">{award.name}</div></div>
        ))}
      </div>

      <h2 className="section-title reveal">{lettersTitle}</h2>
      <div className="letter-grid reveal">
        {letters.map((img, i) => <img key={i} src={img.src} alt={img.alt}/>)}
      </div>

      <section className="values-section">
        <div className="values-inner">
          <div className="section-header" style={{textAlign:'center'}}><span style={{color:'var(--cyan)',fontWeight:700,fontSize:'1.5rem',letterSpacing:1,display:'block',marginBottom:8}}>{honorsTag}</span><h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:'2rem',color:'var(--navy)'}}>{honorsHeading}</h2></div>
          <div className="values-grid">
            {honors.map((v, i) => (
              <div className="value-card reveal" key={i}><div className="val-icon"><i className={`fas ${v.icon}`}></i></div><h3>{v.title}</h3><p>{v.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div className="section-header" style={{textAlign:'center'}}><span style={{color:'var(--cyan)',fontWeight:700,fontSize:'1.5rem',letterSpacing:1,display:'block',marginBottom:8}}>{testimonialsTag}</span><h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:'2rem',color:'var(--navy)'}}>{testimonialsHeading}</h2></div>
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

export default Awards;
