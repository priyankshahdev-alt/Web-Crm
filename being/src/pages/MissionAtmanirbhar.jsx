import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const MissionAtmanirbhar = () => {
  const iframeRef = useRef(null);

  const content = usePageContent('mission-atmanirbhar');

  const taxTitle = content('mission-atmanirbhar-tax', 'title') ?? 'Mission AtmaNirbhar';

  const heroTag = content('mission-atmanirbhar-hero', 'tag') ?? 'Mission Atma Nirbhar';
  const heroHeading = content('mission-atmanirbhar-hero', 'heading') ?? 'Building Self Reliant & Empowered Communities';
  const heroText =
    content('mission-atmanirbhar-hero', 'description') ??
    'Atma Nirbhar initiative by Being Sevak focuses on empowering individuals through skills, education, and sustainable livelihood opportunities.';
  const heroImage = content('mission-atmanirbhar-hero', 'image') ?? '/images/at7.jpeg';

  const aboutTag = content('atmanirbhar-about', 'tag') ?? 'About Initiative';
  const aboutHeading = content('atmanirbhar-about', 'heading') ?? 'Empowering People For A Better Future';
  const aboutText =
    content('atmanirbhar-about', 'text') ??
    'We support skill development, self employment training and awareness programs that help individuals become financially independent.';
  const aboutItems =
    content('atmanirbhar-about', 'items') ?? [
      { title: 'Skill Development', description: 'Training programs for practical skills.' },
      { title: 'Employment Support', description: 'Helping people find sustainable jobs.' },
      { title: 'Entrepreneurship', description: 'Encouraging small business creation.' },
      { title: 'Awareness', description: 'Spreading financial literacy.' },
    ];
  const aboutImage = content('atmanirbhar-about', 'image') ?? '/images/at6.jpg';

  const impactStats =
    content('atmanirbhar-impact', 'stats') ?? [
      { value: '200+', label: 'Training Programs' },
      { value: '50+', label: 'Communities' },
      { value: '5K+', label: 'Lives Improved' },
    ];

  const galleryTag = content('atmanirbhar-gallery', 'tag') ?? 'Program Highlights';
  const galleryHeading = content('atmanirbhar-gallery', 'heading') ?? 'Moments Of Empowerment';
  const galleryText =
    content('atmanirbhar-gallery', 'text') ?? 'Empowering women with opportunity, confidence, and hope - Mission Atmanirbhar';
  const galleryItems =
    content('atmanirbhar-gallery', 'items') ?? [
      { src: '/images/at1.jpg', title: 'Awareness Drive', className: 'gallery-item large' },
      { src: '/images/wheelchairman.jpg', title: 'Wheelchair Support', className: 'gallery-item' },
      { src: '/images/at3.jpeg', title: 'Skill Training', className: 'gallery-item' },
      { src: '/images/at8.jpeg', title: 'Community Care', className: 'gallery-item' },
      { src: '/images/at5.jpg', title: 'Empowering Together', className: 'gallery-item' },
    ];

  const donationTag = content('atmanirbhar-donation', 'tag') ?? 'Mission Atmanirbhar';
  const donationUrl = content('atmanirbhar-donation', 'donationUrl') ?? '/donations/donation-inline-atmanirbhar.html';
  const donationTitle = content('atmanirbhar-donation', 'title') ?? 'Empowering Lives Through Self-Reliance';
  const donationText =
    content('atmanirbhar-donation', 'description') ??
    'Help individuals and families become self-reliant through skill development, livelihood support, education, and sustainable opportunities for a brighter future.';

  const testimonialHeading = content('atmanirbhar-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('atmanirbhar-testimonials', 'items') ?? [
      { quote: 'Being Sevak is doing incredible work for visually impaired and needy families. Proud to support this mission.', name: 'Riya Sharma' },
      { quote: 'Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity.', name: 'Rahul Mehta' },
      { quote: 'Every donation creates real change. Their food distribution drives truly touch lives.', name: 'Anjali Verma' },
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
        .mission-atmanirbhar * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-atmanirbhar { font-family: 'Montserrat', sans-serif; background: #fff; color: #111827; overflow-x: hidden; }
        .mission-atmanirbhar img { width: 100%; display: block; }
        .mission-atmanirbhar section { overflow: hidden; }

        .mission-atmanirbhar .tax-box {
          width: 100%; height: 80px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 20px 0; padding: 10px; border-radius: 0;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15); position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-atmanirbhar .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-atmanirbhar .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-atmanirbhar .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: atShine 6s linear infinite;
        }
        .mission-atmanirbhar .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes atShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-atmanirbhar .hero-section { width: 100%; min-height: 100vh; padding: 70px 7%; background: #f5fbff; }
        .mission-atmanirbhar .hero-content {
          max-width: 1200px; margin: auto;
          display: flex; align-items: center; justify-content: space-between; gap: 60px;
        }
        .mission-atmanirbhar .hero-left { flex: 1; }
        .mission-atmanirbhar .hero-right { flex: 1; display: flex; justify-content: center; }
        .mission-atmanirbhar .tag {
          background: transparent; color: #00a3da; padding: 0; border-radius: 0;
          display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px;
        }
        .mission-atmanirbhar .hero-left h1 { font-size: 62px; line-height: 1.1; font-weight: 800; margin-bottom: 25px; }
        .mission-atmanirbhar .hero-left p { font-size: 18px; color: #6b7280; line-height: 1.9; margin-bottom: 35px; }
        .mission-atmanirbhar .hero-buttons { display: flex; gap: 15px; }
        .mission-atmanirbhar .primary-btn {
          padding: 16px 34px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 18px;
          transition: 0.3s; background: #00a3da; color: #fff; box-shadow: 0 15px 35px rgba(0,163,218,0.35);
        }
        .mission-atmanirbhar .primary-btn:hover { transform: translateY(-4px); }
        .mission-atmanirbhar .hero-right img {
          max-width: 520px; height: 560px; object-fit: cover; border-radius: 40px;
          transition: 0.6s ease; transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.18); animation: atFloatImage 4s ease-in-out infinite;
        }
        .mission-atmanirbhar .hero-right img:hover {
          transform: perspective(1000px) rotateY(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25);
        }
        @keyframes atFloatImage {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
        }

        .mission-atmanirbhar .about-section { width: 100%; padding: 0px 7%; margin-top: 0px; display: flex; align-items: center; gap: 60px; position: relative; z-index: 1; overflow: hidden; isolation: isolate; }
        .mission-atmanirbhar .about-image { flex: 1; overflow: hidden; isolation: isolate; }
        .mission-atmanirbhar .about-image img { height: 520px; border-radius: 30px; object-fit: cover; }
        .mission-atmanirbhar .about-content { flex: 1; }
        .mission-atmanirbhar .about-content span { color: #00a3da; font-weight: 700; }
        .mission-atmanirbhar .about-content h2 { font-size: 42px; margin: 15px 0; }
        .mission-atmanirbhar .about-content p { color: #6b7280; line-height: 1.8; }
        .mission-atmanirbhar .about-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 25px; }
        .mission-atmanirbhar .about-box {
          position: relative; overflow: hidden; background: #f8fbfd; padding: 20px;
          border-radius: 20px; transition: 0.4s; z-index: 1; cursor: pointer;
        }
        .mission-atmanirbhar .about-box::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: -1;
        }
        .mission-atmanirbhar .about-box:hover::before { height: 100%; }
        .mission-atmanirbhar .about-box:hover { color: #fff; transform: translateY(-6px); }
        .mission-atmanirbhar .about-box h3, .mission-atmanirbhar .about-box p { transition: 0.3s; }
        .mission-atmanirbhar .about-box:hover h3, .mission-atmanirbhar .about-box:hover p { color: #fff; }

        .mission-atmanirbhar .impact-section { width: 100%; padding: 80px 7%; background: #eef4f7; }
        .mission-atmanirbhar .impact-wrapper { display: flex; justify-content: center; align-items: center; gap: 25px; padding: 40px 60px; }
        .mission-atmanirbhar .impact-card {
          background: #eef9ff; padding: 20px 50px; border-radius: 20px; transition: 0.4s ease; cursor: pointer; width: 250px; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .mission-atmanirbhar .impact-card:hover { background: #00a3da; color: #fff; transform: translateY(-6px); }
        .mission-atmanirbhar .impact-card h3, .mission-atmanirbhar .impact-card p { transition: 0.3s ease; }
        .mission-atmanirbhar .impact-card:hover h3, .mission-atmanirbhar .impact-card:hover p { color: #fff; }

        .mission-atmanirbhar .gallery-section { width: 100%; padding: 90px 20px; }
        .mission-atmanirbhar .gallery-title { max-width: 800px; margin: auto; text-align: center; margin-bottom: 60px; }
        .mission-atmanirbhar .gallery-title span { color: #00a3da; font-size: 15px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .mission-atmanirbhar .gallery-title h2 { font-size: 48px; margin: 15px 0; font-weight: 800; }
        .mission-atmanirbhar .gallery-title p { color: #6b7280; line-height: 1.9; }
        .mission-atmanirbhar .gallery-grid { max-width: 1200px; margin: auto; display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 260px; gap: 25px; }
        .mission-atmanirbhar .gallery-item { position: relative; overflow: hidden; border-radius: 30px; cursor: pointer; }
        .mission-atmanirbhar .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .mission-atmanirbhar .gallery-item.large { grid-column: span 2; grid-row: span 2; }
        .mission-atmanirbhar .gallery-item.wide { grid-column: span 2; }
        .mission-atmanirbhar .gallery-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.1));
          display: flex; align-items: flex-end; padding: 30px; opacity: 0; transition: 0.4s;
        }
        .mission-atmanirbhar .gallery-overlay h3 { color: #fff; font-size: 24px; transform: translateY(20px); transition: 0.4s; }
        .mission-atmanirbhar .gallery-item:hover img { transform: scale(1.08); }
        .mission-atmanirbhar .gallery-item:hover .gallery-overlay { opacity: 1; }
        .mission-atmanirbhar .gallery-item:hover .gallery-overlay h3 { transform: translateY(0); }

        .mission-atmanirbhar .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-atmanirbhar .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; }
        .mission-atmanirbhar .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-atmanirbhar .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-atmanirbhar .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-atmanirbhar .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-atmanirbhar .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-atmanirbhar .sevak-btn:hover { transform: translateY(-2px); }

        .mission-atmanirbhar .testimonial-section { padding: 50px 5%; }
        .mission-atmanirbhar .section-header { text-align: center; margin-bottom: 60px; }
        .mission-atmanirbhar .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-atmanirbhar .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .mission-atmanirbhar .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden; position: relative;
        }
        .mission-atmanirbhar .testimonial-card:hover { transform: translateY(-10px); }
        .mission-atmanirbhar .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-atmanirbhar .testimonial-card h4 { color: #00a3da; }
        .mission-atmanirbhar .testimonial-card h4, .mission-atmanirbhar .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-atmanirbhar .testimonial-card:hover h4, .mission-atmanirbhar .testimonial-card:hover p { color: #fff !important; }
        .mission-atmanirbhar .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-atmanirbhar .testimonial-card:hover::before { height: 100%; }
        .mission-atmanirbhar .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-atmanirbhar .hero-content, .mission-atmanirbhar .about-section { flex-direction: column; text-align: center; }
          .mission-atmanirbhar .about-section { margin-top: 0px; clip-path: inset(0); }
          .mission-atmanirbhar #donate { margin-bottom: 30px; }
          .mission-atmanirbhar .hero-left { max-width: 100%; }
          .mission-atmanirbhar .hero-right img { max-width: 400px; height: 400px; }
          .mission-atmanirbhar .tag { font-size: 24px; }
          .mission-atmanirbhar .hero-left h1 { font-size: 46px; }
          .mission-atmanirbhar .hero-buttons { justify-content: center; }
          .mission-atmanirbhar .about-grid { grid-template-columns: 1fr; }
          .mission-atmanirbhar .impact-wrapper { flex-direction: column; align-items: center; }
          .mission-atmanirbhar .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-atmanirbhar .sevak-title { font-size: 34px; }
          .mission-atmanirbhar .testimonial-grid { grid-template-columns: 1fr; }
          .mission-atmanirbhar .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 0 5%; }
          .mission-atmanirbhar .gallery-item.large, .mission-atmanirbhar .gallery-item.wide { grid-column: span 2; }
          .mission-atmanirbhar .gallery-title h2 { font-size: 34px; }
        }
        @media (max-width: 600px) {
          .mission-atmanirbhar .hero-section { padding: 40px 5% 30px; min-height: auto; }
          .mission-atmanirbhar .hero-content { gap: 30px; }
          .mission-atmanirbhar .hero-left h1 { font-size: 26px; line-height: 1.3; }
          .mission-atmanirbhar .hero-left p { font-size: 15px; }
          .mission-atmanirbhar .tag { font-size: 16px; font-weight: 900; }
          .mission-atmanirbhar .hero-buttons { flex-direction: column; align-items: center; }
          .mission-atmanirbhar .primary-btn { padding: 12px 24px; font-size: 15px; }
          .mission-atmanirbhar .hero-right img { max-width: 100%; height: 280px; border-radius: 20px; transform: none; animation: none; }
          .mission-atmanirbhar .about-section { padding: 50px 5%; gap: 30px; }
          .mission-atmanirbhar .about-image img { height: 300px; border-radius: 22px; }
          .mission-atmanirbhar .about-content h2 { font-size: 28px; }
          .mission-atmanirbhar .about-box { padding: 16px; border-radius: 16px; }
          .mission-atmanirbhar .impact-section { padding: 50px 5%; }
          .mission-atmanirbhar .impact-wrapper { gap: 15px; }
          .mission-atmanirbhar .impact-card { padding: 40px 60px; text-align: center; }
          .mission-atmanirbhar .gallery-section { padding: 50px 5%; }
          .mission-atmanirbhar .gallery-grid { grid-template-columns: 1fr; grid-auto-rows: auto; gap: 12px; }
          .mission-atmanirbhar .gallery-item, .mission-atmanirbhar .gallery-item.large, .mission-atmanirbhar .gallery-item.wide { grid-column: span 1; grid-row: span 1; height: 280px; }
          .mission-atmanirbhar .gallery-title h2 { font-size: 28px; }
          .mission-atmanirbhar .sevak-title { font-size: 28px; }
          .mission-atmanirbhar .sevak-desc { font-size: 14px; }
          .mission-atmanirbhar .sevak-btn { padding: 12px 28px; font-size: 14px; white-space: normal; }
          .mission-atmanirbhar .about-section { margin-top: 0px; }
          .mission-atmanirbhar #donate { margin-bottom: 30px; }
        }
        @media (max-width: 360px) {
          .mission-atmanirbhar .about-section { margin-top: 0px; }
          .mission-atmanirbhar #donate { margin-bottom: 40px; }
        }
      `}</style>

      <div className="mission-atmanirbhar">
        <section className="tax-box">
          <h1>{taxTitle}</h1>
        </section>

        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-left">
              <span className="tag">{heroTag}</span>
              <h1>{heroHeading}</h1>
              <p>{heroText}</p>
              <div className="hero-buttons">
                <a href="#donate" className="primary-btn">Support The Mission</a>
              </div>
            </div>
            <div className="hero-right">
              <img src={heroImage} alt="Atmanirbhar" />
            </div>
          </div>
        </section>

        <div id="donate" style={{ width: '100%', background: '#f4f7fb', padding: '0', overflow: 'hidden', marginBottom: '0', position: 'relative', zIndex: 10, isolation: 'isolate' }}>
          <iframe
            ref={iframeRef}
            src={donationUrl}
            style={{ width: '100%', height: '650px', border: 'none', display: 'block' }}
            title="Donate to Mission Atmanirbhar"
          />
        </div>

        <section className="about-section" id="about">
          <div className="about-image">
            <img src={aboutImage} alt="Atmanirbhar" />
          </div>
          <div className="about-content">
            <span>{aboutTag}</span>
            <h2>{aboutHeading}</h2>
            <p>{aboutText}</p>
            <div className="about-grid">
              {aboutItems.map((item, i) => (
                <div className="about-box" key={i}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="impact-section" id="impact">
          <div className="impact-wrapper">
            {impactStats.map((s, i) => (
              <div className="impact-card" key={i}>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="gallery-title">
            <span>{galleryTag}</span>
            <h2>{galleryHeading}</h2>
            <p>{galleryText}</p>
          </div>
          <div className="gallery-grid">
            {galleryItems.map((g, i) => (
              <div className={g.className} key={i}><img src={g.src} alt="" /><div className="gallery-overlay"><h3>{g.title}</h3></div></div>
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
              <a href="#donate" className="sevak-btn">Donate Now</a>
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

export default MissionAtmanirbhar;
