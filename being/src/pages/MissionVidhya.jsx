import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const MissionVidhya = () => {
  const iframeRef = useRef(null);

  const content = usePageContent('mission-vidhya');

  const taxTitle = content('mission-vidhya-tax', 'title') ?? 'Mission Vidhya';

  const heroTag = content('mission-vidhya-hero', 'tag') ?? 'Education For Every Child';
  const heroHighlight = content('mission-vidhya-hero', 'headingHighlight') ?? 'Vidhya';
  const heroHeadingText = content('mission-vidhya-hero', 'headingText') ?? 'Programme';
  const heroText =
    content('mission-vidhya-hero', 'description') ??
    'Being Sevak Charitable Trust presents Project Vidhya â€“ Fight Against Illiteracy, an initiative dedicated to empowering disabled and underprivileged children through education and personal development.';
  const heroImage = content('mission-vidhya-hero', 'image') ?? '/images/v1.jpg';
  const heroStats =
    content('vidhya-hero-stats', 'items') ?? [
      { value: '12K+', label: 'Students Helped' },
      { value: '150+', label: 'Education Drives' },
    ];

  const aboutTag = content('vidhya-about', 'tag') ?? 'About Programme';
  const aboutHeading = content('vidhya-about', 'heading') ?? 'Building Future Through';
  const aboutHighlight = content('vidhya-about', 'headingHighlight') ?? 'Education';
  const aboutText =
    content('vidhya-about', 'text') ??
    'Our mission is to empower children from financially weak backgrounds by providing quality education support. From notebooks and school kits to awareness programmes and mentorship â€” we aim to create equal opportunities for every child.';
  const aboutImage = content('vidhya-about', 'image') ?? '/images/v2.jpg';
  const aboutFeatures =
    content('vidhya-about', 'features') ?? [
      { icon: 'ðŸ“–', title: 'School Kits', description: 'Educational support material for children.' },
      { icon: 'ðŸŽ“', title: 'Learning Support', description: 'Helping children continue quality education.' },
    ];

  const impactTag = content('vidhya-impact', 'tag') ?? 'Our Impact';
  const impactHeading = content('vidhya-impact', 'heading') ?? 'Changing Lives Through Learning';
  const impactItems =
    content('vidhya-impact', 'items') ?? [
      { value: '10,000+', label: 'Educational Kits Distributed' },
      { value: '50+', label: 'Communities Reached' },
      { value: '500+', label: 'Volunteers Connected' },
      { value: '100%', label: 'Transparent Support' },
    ];

  const galleryTag = content('vidhya-gallery', 'tag') ?? 'Gallery';
  const galleryHeading = content('vidhya-gallery', 'heading') ?? 'Moments Of Hope & Education';
  const galleryImages =
    content('vidhya-gallery', 'images') ?? [
      { src: '/images/V3.jpg', big: false },
      { src: '/images/v4.png', big: true },
      { src: '/images/V5.jpg', big: false },
      { src: '/images/v6.jpg', big: false },
      { src: '/images/v7.jpeg', big: false },
    ];

  const donationTag = content('vidhya-donation', 'tag') ?? 'Support A Child';
  const donationUrl = content('vidhya-donation', 'donationUrl') ?? '/donations/donation-inline-vidhya.html';
  const donationTitle = content('vidhya-donation', 'title') ?? 'Help Us Continue This Educational Mission';
  const donationText =
    content('vidhya-donation', 'description') ??
    'Your donation helps children receive books, school kits and access to learning opportunities.';

  const testimonialHeading = content('vidhya-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('vidhya-testimonials', 'items') ?? [
      { quote: '"Being Sevak is doing incredible work for visually impaired and needy families. Proud to support this mission."', name: 'Riya Sharma' },
      { quote: '"Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity."', name: 'Rahul Mehta' },
      { quote: '"Every donation creates real change. Their food distribution drives truly touch lives."', name: 'Anjali Verma' },
    ];

  useEffect(() => {
    function handleMessage(e) {
      if (iframeRef.current && typeof e.data === 'number') {
        iframeRef.current.style.height = e.data + 'px';
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <style>{`
        .mission-vidhya * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-vidhya { font-family: 'Montserrat', sans-serif; background: #f4f6f8; color: #1d2b36; overflow-x: hidden; }
        .mission-vidhya img { width: 100%; display: block; }

        .mission-vidhya .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 10px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-vidhya .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-vidhya .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-vidhya .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: viShine 6s linear infinite;
        }
        .mission-vidhya .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes viShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-vidhya .hero-section {
          width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center;
          gap: 40px; padding: 70px 5%; overflow: hidden;
          background: radial-gradient(circle at top left, #dff6ff 0%, transparent 35%),
          radial-gradient(circle at bottom right, #c7ecff 0%, transparent 35%),
          linear-gradient(135deg, #ffffff, #eef8ff);
        }
        .mission-vidhya .hero-left { flex: 1; max-width: 520px; }
        .mission-vidhya .tag { color: #00a3da; display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px; background: none; }
        .mission-vidhya .hero-left h1 { font-size: 62px; line-height: 1.1; font-weight: 800; margin-bottom: 22px; color: #1c2b36; }
        .mission-vidhya .hero-left h1 span { color: #00a3da; }
        .mission-vidhya .hero-left p { font-size: 18px; line-height: 1.9; color: #51606d; margin-bottom: 30px; }
        .mission-vidhya .hero-buttons { display: flex; gap: 15px; flex-wrap: wrap; }
        .mission-vidhya .primary-btn {
          text-decoration: none; padding: 14px 26px; border-radius: 50px; font-size: 18px; font-weight: 700;
          transition: 0.3s; background: #00a3da; color: #fff; box-shadow: 0 15px 35px rgba(0,163,218,0.35);
        }
        .mission-vidhya .primary-btn:hover { transform: translateY(-4px); }
        .mission-vidhya .secondary-btn { border: 2px solid #00a3da; color: #00a3da; }
        .mission-vidhya .secondary-btn:hover { background: #00a3da; color: #fff; }
        .mission-vidhya .hero-right {
          flex: 1; display: flex; justify-content: center; align-items: center;
          position: relative; max-width: 500px; min-height: 500px;
        }
        .mission-vidhya .main-image-card {
          width: 100%; max-width: 480px; border-radius: 30px; overflow: visible;
          position: relative; z-index: 2;
          transform: perspective(1000px) rotate(-3deg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15), 0 10px 25px rgba(0,163,218,0.12);
          transition: 0.6s ease; animation: viFloatCard 4s ease-in-out infinite;
        }
        .mission-vidhya .main-image-card img { width: 100%; display: block; object-fit: cover; transition: 0.6s ease; }
        .mission-vidhya .main-image-card:hover { transform: perspective(1000px) rotate(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25); }
        @keyframes viFloatCard {
          0% { transform: perspective(1000px) rotate(-3deg) translateY(0); }
          50% { transform: perspective(1000px) rotate(-3deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotate(-3deg) translateY(0); }
        }
        .mission-vidhya .floating-card {
          position: absolute; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
          padding: 15px 18px; border-radius: 20px; min-width: 160px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.10); z-index: 5; animation: viFloat 3s ease-in-out infinite;
        }
        .mission-vidhya .floating-card h3 { color: #00a3da; font-size: 34px; margin-bottom: 4px; }
        .mission-vidhya .floating-card p { font-size: 12px; font-weight: 600; color: #51606d; }
        .mission-vidhya .card1 { top: 80px; left: 20px; }
        .mission-vidhya .card2 { bottom: 70px; right: 20px; }
        @keyframes viFloat { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

        .mission-vidhya .about-section { width: 100%; display: flex; align-items: center; justify-content: center; gap: 45px; padding: 40px 5% 10px; background: #fff; position: relative; z-index: 1; overflow: visible; isolation: isolate; }
        .mission-vidhya .about-image { position: relative; overflow: visible; isolation: isolate; }
        .mission-vidhya .about-image img { border-radius: 35px; height: 450px; object-fit: cover; box-shadow: 0 25px 50px rgba(0,0,0,0.12); transition: 0.5s ease; }
        .mission-vidhya .about-image img:hover { transform: scale(1.03); box-shadow: 0 40px 90px rgba(0,0,0,0.2); }
        .mission-vidhya .about-image::before {
          content: ""; position: absolute; top: 20px; left: 20px; width: 100%; height: 100%;
          border-radius: 35px; background: linear-gradient(135deg, rgba(0,163,218,0.2), transparent);
          filter: blur(12px); z-index: -1;
        }
        .mission-vidhya .about-content { flex: 1; max-width: 520px; }
        .mission-vidhya .mini-title { color: #00a3da; font-weight: 700; font-size: 30px; margin-bottom: 18px; display: block; }
        .mission-vidhya .about-content h2 { font-size: 42px; line-height: 1.2; margin-bottom: 22px; }
        .mission-vidhya .about-content h2 span { color: #00a3da; }
        .mission-vidhya .about-content p { font-size: 15px; line-height: 1.8; color: #51606d; }
        .mission-vidhya .feature-boxes { display: flex; gap: 15px; margin-top: 28px; }
        .mission-vidhya .feature-card { background: #f7fcff; padding: 20px; border-radius: 22px; transition: 0.3s ease; cursor: pointer; }
        .mission-vidhya .feature-card:hover { background: #00a3da; }
        .mission-vidhya .feature-card:hover h4, .mission-vidhya .feature-card:hover p, .mission-vidhya .feature-card:hover .icon { color: #fff; }
        .mission-vidhya .icon { font-size: 28px; margin-bottom: 12px; }
        .mission-vidhya .feature-card h4 { font-size: 17px; margin-bottom: 8px; }
        .mission-vidhya .feature-card p { font-size: 13px; }

        .mission-vidhya .impact-section {
          width: 100%;
          background: radial-gradient(circle at top left, #dff6ff 0%, transparent 35%),
          linear-gradient(135deg, #f4f6f8, #eef8ff);
        }
        .mission-vidhya .section-heading { text-align: center; margin-bottom: 45px; }
        .mission-vidhya .section-heading span { color: #00a3da; font-weight: 700; font-size: x-large; }
        .mission-vidhya .section-heading h2 { font-size: 40px; margin-top: 10px; }
        .mission-vidhya .impact-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; padding: 0 5% 30px; justify-items: center; }
        .mission-vidhya .impact-card {
          background: #fff; padding: 22px 16px; text-align: center; border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06); transition: 0.3s ease;
          position: relative; overflow: hidden; cursor: pointer; height: 150px; width: 250px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .mission-vidhya .impact-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1;
        }
        .mission-vidhya .impact-card:hover::before { height: 100%; }
        .mission-vidhya .impact-card h3, .mission-vidhya .impact-card p { position: relative; z-index: 2; transition: 0.3s ease; }
        .mission-vidhya .impact-card:hover h3, .mission-vidhya .impact-card:hover p { color: #fff; }

        .mission-vidhya .gallery-section { width: 100%; padding: 0 5%; background: #fff; }
        .mission-vidhya .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .mission-vidhya .gallery-item { overflow: hidden; border-radius: 24px; height: 240px; }
        .mission-vidhya .gallery-item.big { grid-row: span 2; height: 500px; }
        .mission-vidhya .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .mission-vidhya .gallery-item:hover img { transform: scale(1.08); }

        .mission-vidhya .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-vidhya .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; padding: 0; }
        .mission-vidhya .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-vidhya .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-vidhya .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-vidhya .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-vidhya .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-vidhya .sevak-btn:hover { transform: translateY(-2px); }

        .mission-vidhya .testimonial-section { padding: 4px 4%; }
        .mission-vidhya .section-header { text-align: center; margin-bottom: 60px; }
        .mission-vidhya .section-header span { color: #00a3da; font-weight: 700; letter-spacing: 2px; }
        .mission-vidhya .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-vidhya .section-header p { color: #6b7d8f; }
        .mission-vidhya .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .mission-vidhya .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden;
          position: relative; z-index: 0; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;
        }
        .mission-vidhya .testimonial-card:hover { transform: translateY(-10px); background: #00a3da; }
        .mission-vidhya .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-vidhya .testimonial-card h4 { color: #00a3da; }
        .mission-vidhya .testimonial-card h4, .mission-vidhya .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-vidhya .testimonial-card:hover h4, .mission-vidhya .testimonial-card:hover p { color: #fff !important; }
        .mission-vidhya .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-vidhya .testimonial-card:hover::before { height: 100%; }
        .mission-vidhya .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-vidhya .hero-section, .mission-vidhya .about-section { flex-direction: column; text-align: center; }
          .mission-vidhya .about-section { margin-top: 0; clip-path: inset(0); }
          .mission-vidhya #donate { margin-bottom: 0; }
          .mission-vidhya .hero-left, .mission-vidhya .about-content { max-width: 100%; }
          .mission-vidhya .hero-buttons { justify-content: center; }
          .mission-vidhya .hero-left h1 { font-size: 46px; }
          .mission-vidhya .about-content h2, .mission-vidhya .section-heading h2 { font-size: 34px; }
          .mission-vidhya .impact-grid { grid-template-columns: repeat(2,1fr); }
          .mission-vidhya .gallery-grid { grid-template-columns: 1fr; }
          .mission-vidhya .gallery-item.big { height: 240px; }
          .mission-vidhya .feature-boxes { flex-direction: column; }
          .mission-vidhya .floating-card { min-width: 130px; }
          .mission-vidhya .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-vidhya .sevak-title { font-size: 34px; }
          .mission-vidhya .testimonial-grid { grid-template-columns: 1fr; }
          .mission-vidhya .about-image img { box-shadow: none; }
        }
        @media (max-width: 600px) {
          .mission-vidhya .hero-section { padding: 50px 5% 30px; }
          .mission-vidhya .hero-left h1 { font-size: 32px; }
          .mission-vidhya .hero-left p { font-size: 15px; }
          .mission-vidhya .tag { font-size: 22px; }
          .mission-vidhya .hero-buttons { flex-direction: column; align-items: center; }
          .mission-vidhya .primary-btn { padding: 12px 22px; font-size: 15px; }
          .mission-vidhya .impact-grid { display: flex; flex-direction: row; align-items: center; justify-content: center; flex-wrap: wrap; }
          .mission-vidhya .impact-card { height: 120px; padding: 16px 12px; border-radius: 16px; }
          .mission-vidhya .hero-right { min-height: auto; padding: 0; width: 100%; max-width: 360px; margin: 0 auto; }
          .mission-vidhya .main-image-card { max-width: 100%; transform: none; animation: none; border-radius: 20px; }
          .mission-vidhya .main-image-card img { border-radius: 20px; }
          .mission-vidhya .floating-card { padding: 8px 12px; min-width: auto; border-radius: 10px; }
          .mission-vidhya .floating-card h3 { font-size: 18px; }
          .mission-vidhya .floating-card p { font-size: 11px; }
          .mission-vidhya .card1 { top: 0; left: 0; border-radius: 0 0 12px 0; }
          .mission-vidhya .card2 { bottom: 0; right: 0; border-radius: 12px 0 0 0; }
          .mission-vidhya .about-image::before { display: none; }
          .mission-vidhya .sevak-donation { padding: 40px 5%; }
          .mission-vidhya .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-vidhya .sevak-title { font-size: 24px; }
          .mission-vidhya .sevak-desc { font-size: 14px; }
          .mission-vidhya .sevak-btn { padding: 12px 28px; font-size: 14px; white-space: normal; }
          .mission-vidhya .about-section { margin-top: 0; }
          .mission-vidhya #donate { margin-bottom: 0; }
        }
        @media (max-width: 360px) {
          .mission-vidhya .about-section { margin-top: 0; }
          .mission-vidhya #donate { margin-bottom: 0; }
        }
      `}</style>

      <div className="mission-vidhya">
        <section className="tax-box">
          <h1>{taxTitle}</h1>
        </section>

        <section className="hero-section">
          <div className="hero-left">
            <span className="tag">{heroTag}</span>
            <h1><span>{heroHighlight}</span><br />{heroHeadingText}</h1>
            <p>{heroText}</p>
            <div className="hero-buttons">
              <a href="#donate" className="primary-btn">Support Education</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="main-image-card">
              <img src={heroImage} alt="Children Education" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
              {heroStats.map((stat, i) => (
                <div className={`floating-card card${i + 1}`} key={i}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div id="donate" style={{ width: '100%', background: '#fff', padding: '0', overflow: 'hidden', position: 'relative', zIndex: 10, isolation: 'isolate' }}>
          <iframe
            ref={iframeRef}
            src={donationUrl}
            style={{ width: '100%', height: '650px', border: 'none', display: 'block' }}
            title="Donate to Mission Vidhya"
          />
        </div>

        <section className="about-section" id="about" style={{ marginTop: '1px' }}>
          <div className="about-image">
            <img src={aboutImage} alt="Education" loading="lazy" decoding="async" width="800" height="600" />
          </div>
          <div className="about-content">
            <span className="mini-title">{aboutTag}</span>
            <h2>{aboutHeading} <span>{aboutHighlight}</span></h2>
            <p>{aboutText}</p>
            <div className="feature-boxes">
              {aboutFeatures.map((f, i) => (
                <div className="feature-card" key={i}>
                  <div className="icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="impact-section" id="impact">
          <div className="section-heading">
            <span>{impactTag}</span>
            <h2>{impactHeading}</h2>
          </div>
          <div className="impact-grid">
            {impactItems.map((s, i) => (
              <div className="impact-card" key={i}><h3>{s.value}</h3><p>{s.label}</p></div>
            ))}
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-heading">
            <span>{galleryTag}</span>
            <h2>{galleryHeading}</h2>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((g, i) => (
              <div className={`gallery-item${g.big ? ' big' : ''}`} key={i}><img src={g.src} alt="" loading="lazy" decoding="async" width="800" height="600" /></div>
            ))}
          </div>
        </section>

        <section className="sevak-donation">
          <div className="sevak-donation-content">
            <div className="sevak-left">
              <span className="sevak-tag">{donationTag}</span>
              <h2 className="sevak-title">{donationTitle}</h2>
              <p className="sevak-desc">{donationText}</p>
            </div>
            <div className="sevak-right">
              <a href="#" className="sevak-btn">Donate Now</a>
            </div>
          </div>
        </section>

        <section className="testimonial-section">
          <div className="section-header">
            <h2>{testimonialHeading}</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <p>{t.quote}</p>
                <h4>{t.name}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="tax-box">
          <p>Get <b>50% Exemption</b> on your donation under <b>Section 80G of Income Tax Act 1961</b></p>
        </section>
      </div>
    </>
  );
};

export default MissionVidhya;

