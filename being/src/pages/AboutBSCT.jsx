import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

const AboutBSCT = () => {
  const { getSetting, getSection } = useSite();
  const storySection = getSection('about', 'story');
  const storyParagraphs = (storySection?.content?.paragraphs || []).filter(
    (p) => p && p.trim(),
  );
  const aboutDesc =
    storyParagraphs.join(' ') || getSetting('site.description', '');
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
        :root {
          --navy: #03163E;
          --mid: #315371;
          --cyan: #00A2D9;
          --cyan-light: #33bce8;
          --green: #2eb85c;
          --gold: #D4AF37;
          --white: #ffffff;
          --light-bg: #f4f7fb;
          --text-dark: #1a1a2e;
          --text-mid: #4a5568;
        }

        .about-page { font-family: 'Open Sans', sans-serif; color: var(--text-dark); scroll-behavior: smooth; }

        .about-page .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; border-radius: 0; margin: 20px 0; padding: 10px;
        }
        .about-page .tax-box h1 {
          font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 800;
          letter-spacing: 2px; color: #fff; margin: 0;
        }

        .about-page .hero {
          min-height: 100vh; display: grid !important; grid-template-columns: 1fr 1fr; align-items: center !important;
          gap: 0; position: relative; overflow: hidden; padding: 10px 8%;
        }
        .about-page .hero-content {
          position: relative; z-index: 2; padding: 0; margin: 35px 0; text-align: left;
        }
        .about-page .hero-content .tag,
        .about-page .hero-content > span {
          background: transparent; color: #00a3da; padding: 0; border-radius: 0;
          display: inline-block; margin: 35px 0 25px 0; font-weight: 800; font-size: 30px; letter-spacing: 1px;
        }
        .about-page .hero h1 { font-size: 62px; line-height: 1.1; margin-bottom: 25px; color: var(--navy); font-weight: 800; }
        .about-page .hero h1 span { color: #00a3da; }
        .about-page .hero p { font-size: 18px; line-height: 1.9; color: #66788a; margin-bottom: 35px; }
        .about-page .hero-buttons { display: flex; gap: 18px; flex-wrap: wrap; justify-content: flex-start; padding: 0; }
        .about-page .hero-buttons .donate-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; transition: 0.4s;
          box-shadow: 0 10px 25px rgba(11, 77, 120, 0.25);
        }
        .about-page .hero-buttons .donate-btn:hover { background: #007d94; transform: translateY(-1px); }
        .about-page .hero-image { position: relative; z-index: 2; display: flex; justify-content: center; }
        .about-page .hero-image img {
          width: 100%; max-width: 500px; border-radius: 30px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15); transition: 0.5s ease;
        }
        .about-page .hero-image img:hover { transform: scale(1.02); }
        .about-page .floating-card {
          position: absolute; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px);
          padding: 18px 24px; border-radius: 18px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
          text-align: center; z-index: 3; animation: floatCard 3s ease-in-out infinite alternate;
        }
        .about-page .floating-card.card1 { top: 5%; left: -10px; --float-rot: -4deg; }
        .about-page .floating-card.card2 { bottom: 10%; right: -10px; animation-delay: 2s; --float-rot: 4deg; }
        .about-page .floating-card h3 { font-size: 28px; font-weight: 800; color: #00a3da; }
        .about-page .floating-card p { font-size: 13px; color: #555; margin: 0; }
        .about-page .blur {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          filter: blur(120px); opacity: 0.15; z-index: 0; pointer-events: none;
        }
        .about-page .blur1 { background: #00a3da; top: -100px; left: -100px; }
        .about-page .blur2 { background: #315270; bottom: -100px; right: -100px; }

        .about-page .about-grid-wrap {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
          max-width: 1200px; margin: 0 auto; padding: 80px 24px;
        }
        .about-page .about-image-col { position: relative; }
        .about-page .about-image-col img {
          width: 100%; height: 480px; object-fit: cover; border-radius: 30px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12); transition: 0.5s ease; display: block;
        }
        .about-page .about-image-col img:hover { transform: scale(1.03); box-shadow: 0 40px 90px rgba(0, 0, 0, 0.2); }
        .about-page .about-image-col::before {
          content: ""; position: absolute; top: 20px; left: 20px; width: 100%; height: 100%;
          border-radius: 30px; background: linear-gradient(135deg, rgba(0, 162, 217, 0.2), transparent);
          filter: blur(12px); z-index: -1;
        }
        .about-page .about-content-col { padding-right: 20px; }
        .about-page .about-content-col .section-label {
          font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 1.75rem;
          color: var(--navy); margin-bottom: 28px; position: relative; display: inline-block;
        }
        .about-page .about-content-col .section-label::after {
          content: ''; display: block; width: 60px; height: 4px; background: var(--gold);
          margin-top: 8px; border-radius: 2px;
        }
        .about-page .about-content-col .section-label-custom { font-size: 1.5rem; margin-bottom: 18px; }
        .about-page .about-content-col .section-label-custom::after { width: 50px; }
        .about-page .about-content-col h2 {
          font-family: 'Montserrat', sans-serif; font-size: 2rem; color: var(--navy);
          margin-bottom: 18px; line-height: 1.2;
        }
        .about-page .about-content-col h2 span { color: var(--cyan); }
        .about-page .about-content-col p {
          font-size: 1rem; line-height: 1.85; color: var(--text-mid); margin-bottom: 16px;
        }

        .about-page .values-section { background: var(--light-bg); padding: 80px 24px; }
        .about-page .values-inner { max-width: 1200px; margin: 0 auto; }
        .about-page .values-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 25px; margin-top: 50px;
        }
        .about-page .value-card {
          background: #fff; padding: 35px 28px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05); text-align: center; position: relative;
          overflow: hidden; cursor: pointer; transition: 0.5s ease;
        }
        .about-page .value-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: var(--cyan); transition: 0.5s ease; z-index: 1;
        }
        .about-page .value-card:hover::before { height: 100%; }
        .about-page .value-card:hover { transform: translateY(-12px); }
        .about-page .value-card > * { position: relative; z-index: 2; transition: 0.4s ease; }
        .about-page .value-card .val-icon { font-size: 2.4rem; color: var(--cyan); margin-bottom: 16px; }
        .about-page .value-card h3 {
          font-family: 'Montserrat', sans-serif; font-size: 1.15rem; color: var(--navy); margin-bottom: 12px;
        }
        .about-page .value-card p { font-size: 0.88rem; line-height: 1.7; color: var(--text-mid); }
        .about-page .value-card:hover .val-icon,
        .about-page .value-card:hover h3,
        .about-page .value-card:hover p { color: #fff; }

        .about-page .stats-section { background: var(--light-bg); padding: 60px 24px; }
        .about-page .stats-grid {
          max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap;
          gap: 30px; justify-content: center;
        }
        .about-page .stat-item {
          display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px;
        }
        .about-page .stat-icon {
          width: 80px; height: 80px; border-radius: 50%; background: var(--navy);
          display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
          color: white; box-shadow: 0 4px 16px rgba(13, 33, 97, 0.25);
        }
        .about-page .stat-num {
          font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 1.4rem; color: var(--green);
        }
        .about-page .stat-label {
          font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 0.82rem;
          color: var(--navy); text-align: center;
        }

        .about-page .testimonials-section { background: #fff; }
        .about-page .testimonials-inner { max-width: 1200px; margin: 0 auto; }
        .about-page .testimonial-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px; margin-top: 50px; align-items: stretch;
        }
        .about-page .testimonial-card {
          background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.07); transition: 0.4s ease; overflow: hidden;
          position: relative; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;
        }
        .about-page .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: var(--cyan); transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .about-page .testimonial-card:hover::before { height: 100%; }
        .about-page .testimonial-card:hover { transform: translateY(-10px); }
        .about-page .testimonial-card > * { position: relative; z-index: 2; }
        .about-page .testimonial-card p {
          line-height: 1.9; color: var(--text-mid); margin-bottom: 20px; font-size: 0.92rem;
        }
        .about-page .testimonial-card h4 {
          font-family: 'Montserrat', sans-serif; color: var(--cyan); font-size: 1rem;
        }
        .about-page .testimonial-card span { font-size: 0.8rem; color: var(--text-mid); }
        .about-page .testimonial-card:hover p,
        .about-page .testimonial-card:hover h4,
        .about-page .testimonial-card:hover span { color: #fff !important; }
        .about-page .testimonial-card .quote-icon {
          font-size: 1.6rem; color: var(--cyan-light); margin-bottom: 12px; opacity: 0.5;
        }
        .about-page .testimonial-card:hover .quote-icon { color: rgba(255, 255, 255, 0.6); }

        .about-page .tax-banner {
          background: linear-gradient(135deg, var(--navy) 0%, #1a3a8f 100%);
          padding: 42px 24px; text-align: center;
        }
        .about-page .tax-banner p {
          font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 1.35rem;
          color: white; max-width: 700px; margin: 0 auto; line-height: 1.5;
        }
        .about-page .tax-banner span { color: var(--gold); }

        .about-page .reveal {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .about-page .reveal.visible { opacity: 1; transform: translateY(0); }

        @keyframes floatCard {
          0% { transform: translateY(0) rotate(var(--float-rot, 0deg)); }
          100% { transform: translateY(-15px) rotate(var(--float-rot, 0deg)); }
        }

        @media(max-width: 991px) {
          .about-page .hero {
            grid-template-columns: 1fr; min-height: auto; padding: 60px 5% 40px;
            gap: 40px; text-align: center; align-items: center !important;
          }
          .about-page .hero-content { padding-left: 0; text-align: center; }
          .about-page .hero h1 { font-size: 42px; }
          .about-page .hero p { font-size: 16px; }
          .about-page .hero-buttons { justify-content: center; }
          .about-page .hero-image img { max-width: 90%; }
          .about-page .floating-card.card1 { left: 5%; }
          .about-page .floating-card.card2 { right: 5%; }
          .about-page .about-grid-wrap {
            grid-template-columns: 1fr; gap: 40px; text-align: center; padding: 60px 24px;
          }
          .about-page .about-content-col { padding-right: 0; }
          .about-page .about-content-col .section-label-custom { margin: 0 auto 18px; }
          .about-page .about-content-col .section-label-custom::after { margin: 8px auto 0; }
          .about-page .about-image-col img { height: 360px; }
          .about-page .values-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media(max-width: 550px) {
          .about-page .hero { padding: 30px 5%; gap: 20px; }
          .about-page .hero h1 { font-size: 28px; }
          .about-page .hero p { font-size: 13px; }
          .about-page .hero-image img { max-width: 100%; border-radius: 16px; }
          .about-page .floating-card { padding: 6px 10px; border-radius: 12px; }
          .about-page .floating-card h3 { font-size: 14px; }
          .about-page .floating-card p { font-size: 10px; }
          .about-page .floating-card.card1 { top: 0; left: 0; border-radius: 0 0 12px 0; }
          .about-page .floating-card.card2 { bottom: 0; right: 0; border-radius: 12px 0 0 0; }
          .about-page .values-section { padding: 40px 14px; }
          .about-page .values-grid { gap: 14px; margin-top: 30px; }
          .about-page .value-card { padding: 20px 16px; border-radius: 18px; }
          .about-page .value-card .val-icon { font-size: 1.6rem; margin-bottom: 10px; }
          .about-page .value-card h3 { font-size: 1rem; }
          .about-page .value-card p { font-size: 0.8rem; }
          .about-page .stats-section { padding: 28px 12px; }
          .about-page .stats-grid { gap: 12px; }
          .about-page .stat-item { gap: 4px; min-width: 80px; }
          .about-page .stat-icon { width: 40px; height: 40px; font-size: 1rem; }
          .about-page .stat-num { font-size: 0.95rem; }
          .about-page .stat-label { font-size: 0.6rem; }
        }

        @media (max-width: 768px) {
          .about-page .values-grid { grid-template-columns: 1fr; }
          .about-page .testimonial-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="about-page">
        {/* TAX BOX HEADER */}
        <section className="tax-box">
          <h1>About BSCT</h1>
        </section>

        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="tag">BEING SEVAK CHARITABLE TRUST</span>
            <h1>
              Serving Society <br />
              With <span>Compassion & Dignity</span>
            </h1>
            <p>
              {aboutDesc ||
                'Being Sevak Charitable Trust is a dedicated non-profit organization working since 2015 with a mission to serve humanity through compassion, care, and inclusive development. Guided by the belief of "Sevak Bano" Become a Servant of Society the organization is committed to create meaningful change in the lives of underprivileged communities, specially-abled individuals, women, and children across India.'}
            </p>
            <div className="hero-buttons">
              <a href="#about" className="donate-btn">Know More</a>
            </div>
          </div>

          <div className="hero-image">
            <div className="floating-card card1">
              <h3>10+</h3>
              <p>Years of Service</p>
            </div>
            <div className="floating-card card2">
              <h3>7</h3>
              <p>Active Missions</p>
            </div>
            <img src="/images/aboutus1.jpeg" alt="BSCT" />
          </div>

          <div className="blur blur1"></div>
          <div className="blur blur2"></div>
        </section>

        {/* ABOUT US 2-COL GRID */}
        <section className="about-grid-wrap reveal" id="about">
          <div className="about-image-col">
            <img src="/images/aboutus2.jpeg" alt="BSCT Community Work" loading="lazy" />
          </div>
          <div className="about-content-col">
            <h2 className="section-label section-label-custom">ABOUT US</h2>
            <h2>Our Mission in <span>Action</span></h2>
            <p>
              To empower underprivileged communities, specially-abled individuals, women, and children through education,
              healthcare, skill development, livelihood support, and social welfare initiatives. Being Sevak Charitable Trust
              is committed Is to create opportunities that promote dignity, independence, equality, and sustainable community
              development.
            </p>
            <h2>Our Vision in <span>Action</span></h2>
            <p>
              To build an inclusive and compassionate society where every individual, regardless of their social or economic
              background, has equal access to education, healthcare, livelihood opportunities, and the right to live with
              dignity, confidence, and self-reliance.
            </p>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="values-section">
          <div className="values-inner">
            <div style={{ textAlign: 'center' }}>
              <span style={{
                color: 'var(--cyan)', fontWeight: 700, fontSize: '1.5rem',
                letterSpacing: '1px', display: 'block', marginBottom: '8px'
              }}>OUR VALUES</span>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', color: 'var(--navy)'
              }}>What Drives Us</h2>
            </div>
            <div className="values-grid">
              {[
                { icon: 'fa-heart', title: 'Accountability', desc: 'We take responsibility for every action and initiative undertaken for community welfare.' },
                { icon: 'fa-hand-holding-heart', title: 'Compassion & Service', desc: 'We are committed to selfless service and to uplift lives with empathy, care, and dignity.' },
                { icon: 'fa-graduation-cap', title: 'Leadership', desc: 'We inspire positive change through dedicated social leadership and community engagement.' },
                { icon: 'fa-globe-asia', title: 'Teamwork', desc: 'We work together with volunteers, partners, and communities to create a greater social impact.' },
                { icon: 'fa-globe-asia', title: 'Innovation', desc: 'We encourage creative and sustainable solutions to address social challenges effectively.' },
              ].map((v, i) => (
                <div key={i} className="value-card reveal">
                  <div className="val-icon"><i className={`fas ${v.icon}`}></i></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-section">
          <div className="stats-grid">
            {[
              { icon: 'fa-book-open', num: '195000+', label: 'Vidhya Kits' },
              { icon: 'fa-bread-slice', num: '180000+', label: 'Mid-Day Meal' },
              { icon: 'fa-boxes-stacked', num: '650000+', label: 'Annapurna Kits' },
              { icon: 'fa-kit-medical', num: '100000+', label: 'Covid-19 Kits' },
              { icon: 'fa-plus-circle', num: '2500+', label: 'Medical Relief' },
              { icon: 'fa-eye', num: '40000+', label: 'Eye Care' },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-icon"><i className={`fas ${s.icon}`}></i></div>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials-section">
          <div className="testimonials-inner">
            <div style={{ textAlign: 'center' }}>
              <span style={{
                color: 'var(--cyan)', fontWeight: 700, fontSize: '1.5rem',
                letterSpacing: '1px', display: 'block', marginBottom: '8px'
              }}>TESTIMONIALS</span>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', color: 'var(--navy)'
              }}>What People Say</h2>
            </div>
            <div className="testimonial-grid">
              {[
                { quote: "Being Sevak has transformed the lives of so many in our community. Their dedication to education and nourishment is truly inspiring.", name: 'Priya Sharma', role: 'Beneficiary, Mission Vidhya' },
                { quote: "The mid-day meal program has ensured that no child in our area goes to school hungry. Grateful for their relentless service.", name: 'Rajesh Patel', role: 'Community Leader, Mumbai' },
                { quote: "As a volunteer, I've witnessed first-hand impact BSCT has on underprivileged families. A truly transparent and dedicated trust.", name: 'Anita Desai', role: 'Volunteer since 2018' },
              ].map((t, i) => (
                <div key={i} className="testimonial-card reveal">
                  <div>
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p>{t.quote}</p>
                  </div>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TAX EXEMPTION BANNER */}
        <section className="tax-banner">
          <p>Get <span>50% Exemption</span> On Your Donation To Us Under <span>Section 80G</span> Of Income Tax Act 1961.</p>
        </section>
      </div>
    </>
  );
};

export default AboutBSCT;
