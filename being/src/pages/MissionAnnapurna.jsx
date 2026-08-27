import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const MissionAnnapurna = () => {
  const iframeRef = useRef(null);

  const content = usePageContent('mission-annapurna');

  const taxTitle = content('mission-annapurna-tax', 'title') ?? 'Mission Annapurna';

  const heroTag = content('mission-annapurna-hero', 'tag') ?? 'Fight Against Hunger';
  const heroLine1 = content('mission-annapurna-hero', 'headingLine1') ?? 'Nourishing Lives';
  const heroLine2 = content('mission-annapurna-hero', 'headingLine2') ?? 'With';
  const heroHighlight = content('mission-annapurna-hero', 'headingHighlight') ?? 'Hope & Humanity';
  const heroText =
    content('mission-annapurna-hero', 'description') ??
    'Being Sevak Charitable Trust presents the Annapurna Mission: Fight against Hunger, a humanitarian initiative dedicated to addressing hunger and malnutrition among underprivileged children, visually impaired individuals, and low-income families across India.';
  const heroImage = content('mission-annapurna-hero', 'image') ?? '/images/a1.jpeg';
  const heroStats =
    content('annapurna-hero-stats', 'items') ?? [
      { value: '102K+', label: 'Annapurna Kits' },
      { value: '12K+', label: 'Meals Distributed' },
    ];

  const aboutTag = content('annapurna-about', 'tag') ?? 'ABOUT THE MISSION';
  const aboutHeading = content('annapurna-about', 'heading') ?? 'Feeding Families. Empowering Communities.';
  const aboutImage = content('annapurna-about', 'image') ?? '/images/a2.jpg';
  const aboutCards =
    content('annapurna-about', 'items') ?? [
      { title: 'Annapurna Kit Distribution', description: 'Helping families with essential ration kits for survival.' },
      { title: 'Snack Distribution for Underprivileged Children', description: 'Bringing smiles through snacks for needy children.' },
      { title: 'Meals for Persons with Disabilities', description: 'Serving fresh meals to fight hunger every day.' },
      { title: 'Roti Drive for all Underprivileged Children', description: 'No one sleeps hungry, sharing fresh rotis daily.' },
    ];

  const programsTag = content('annapurna-programs', 'tag') ?? 'OUR PROGRAMS';
  const programsText1 =
    content('annapurna-programs', 'text1') ??
    'Mission Annapurna (Fight Against Hunger) by Being Sevak Charitable Trust is a humanitarian initiative focused on reducing hunger and malnutrition among underprivileged children, visually impaired individuals, and low-income families across India.';
  const programsText2 =
    content('annapurna-programs', 'text2') ??
    'With the support of CSR partners, donors, and volunteers, the mission provides nutritious meals and essential food supplies to build a hunger-free and dignified society.';
  const programs =
    content('annapurna-programs', 'items') ?? [
      { number: '01', title: 'Cooked Meal Distribution', description: 'Providing freshly cooked nutritious meals to underprivileged children to support healthy growth, education, and overall well-being.' },
      { number: '02', title: 'Dry Ration Kits', description: 'Distributing easy-to-use ration kits to visually impaired individuals to ensure dignity, independence, and food security.' },
      { number: '03', title: 'Nutrition Meal Support', description: 'Serving balanced and hygienic meals to children and vulnerable individuals to fight malnutrition and improve health outcomes.' },
      { number: '04', title: 'Family Food-Grain Kits', description: 'Providing essential food-grain kits in small, medium, and large sizes to support struggling families based on their needs.' },
    ];

  const galleryImages =
    content('annapurna-gallery', 'images') ?? ['/images/a3.jpg', '/images/a6.jpg', '/images/snackKit.jpeg', '/images/rotidrive.jpeg'];

  const donationTag = content('annapurna-donation', 'tag') ?? 'Mission Annapurna';
  const donationUrl = content('annapurna-donation', 'donationUrl') ?? '/donations/donation-inline.html';
  const donationTitle = content('annapurna-donation', 'title') ?? 'Nourishing Lives, Spreading Hope';
  const donationText =
    content('annapurna-donation', 'description') ??
    'Support food distribution initiatives to ensure that no family sleeps hungry and everyone receives nutritious meals.';

  const testimonialHeading = content('annapurna-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('annapurna-testimonials', 'items') ?? [
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
        .mission-annapurna * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-annapurna { font-family: 'Poppins', sans-serif; background: #f4f6f8; color: #315270; overflow-x: hidden; position: relative; }
        .mission-annapurna img { width: 100%; display: block; }

        .mission-annapurna .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 10px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-annapurna .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-annapurna .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-annapurna .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: anShine 6s linear infinite;
        }
        .mission-annapurna .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes anShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-annapurna .hero {
          min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: center;
          gap: 0; position: relative; overflow: hidden; padding: 0 4%;
        }
        .mission-annapurna .hero-content { position: relative; z-index: 2; }
        .mission-annapurna .tag { background: transparent; color: #00a3da; padding: 0; border-radius: 0; display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px; }
        .mission-annapurna .hero h1 { font-size: 62px; line-height: 1.1; font-weight: 800; margin-bottom: 25px; }
        .mission-annapurna .hero h1 span { color: #00a3da; }
        .mission-annapurna .hero p { font-size: 18px; line-height: 1.9; color: #66788a; margin-bottom: 35px; }
        .mission-annapurna .hero-buttons { display: flex; gap: 20px; }
        .mission-annapurna .donate-btn-hero {
          padding: 14px 26px; border-radius: 50px; text-decoration: none; font-weight: 600;
          color: #fff; background: #00a3da; box-shadow: 0 15px 30px rgba(0,163,218,0.35);
          display: inline-block; transition: 0.3s; font-size: 18px;
        }
        .mission-annapurna .donate-btn-hero:hover { transform: translateY(-4px); }
        .mission-annapurna .hero-image { position: relative; z-index: 1; }
        .mission-annapurna .hero-image img {
          height: 350px; object-fit: cover; border-radius: 40px;
          transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.18); transition: 0.6s ease;
          animation: anFloatImg 4s ease-in-out infinite;
        }
        .mission-annapurna .hero-image img:hover { transform: perspective(1000px) rotateY(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25); }
        @keyframes anFloatImg { 0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); } 50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); } 100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); } }
        .mission-annapurna .hero-image::before {
          content: ""; position: absolute; top: 20px; left: 20px; width: 100%; height: 100%;
          border-radius: 40px; background: linear-gradient(135deg, rgba(0,163,218,0.25), transparent);
          z-index: -1; filter: blur(10px);
        }
        .mission-annapurna .floating-card {
          position: absolute; padding: 15px 20px; background: #fff; border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: anFloatCard 3s ease-in-out infinite; z-index: 10;
        }
        .mission-annapurna .floating-card h3 { color: #00a3da; font-size: 34px; }
        .mission-annapurna .floating-card p { font-size: 12px; font-weight: 600; color: #315270; }
        .mission-annapurna .card1 { top: 40px; left: -60px; }
        .mission-annapurna .card2 { bottom: 50px; right: -40px; }
        @keyframes anFloatCard { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        .mission-annapurna .blur { position: absolute; border-radius: 50%; filter: blur(120px); }
        .mission-annapurna .blur1 { width: 350px; height: 350px; background: #00a3da33; top: 0; left: 0; }
        .mission-annapurna .blur2 { width: 350px; height: 350px; background: #3152702b; bottom: 0; right: 0; }

        .mission-annapurna .about-section { display: grid; grid-template-columns: 1fr; gap: 40px; padding: 28px 5% 40px 5%; text-align: center; position: relative; z-index: 1; overflow: hidden; isolation: isolate; }
        .mission-annapurna .about-image { position: relative; overflow: hidden; isolation: isolate; }
        .mission-annapurna .about-image img { border-radius: 35px; height: 600px; object-fit: cover; box-shadow: 0 25px 50px rgba(0,0,0,0.12); transition: 0.5s ease; }
        .mission-annapurna .about-image img:hover { transform: scale(1.03); box-shadow: 0 40px 90px rgba(0,0,0,0.2); }
        .mission-annapurna .about-image::before {
          content: ""; position: absolute; top: 20px; left: 20px; width: 100%; height: 100%;
          border-radius: 35px; background: linear-gradient(135deg, rgba(0,163,218,0.2), transparent);
          filter: blur(12px); z-index: -1;
        }
        .mission-annapurna .small-title { color: #00a3da; font-weight: 700; letter-spacing: 2px; font-size: 32px; }
        .mission-annapurna .about-content h2 { font-size: 42px; margin: 20px 0; }
        .mission-annapurna .about-content p { line-height: 2; color: #657688; }
        .mission-annapurna .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-top: 40px; }
        .mission-annapurna .about-card {
          background: #fff; padding: 30px; border-radius: 25px; transition: 0.4s;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05); cursor: pointer;
        }
        .mission-annapurna .about-card:hover { background: #00a3da; transform: translateY(-10px) rotateX(6deg); }
        .mission-annapurna .about-card:hover h3, .mission-annapurna .about-card:hover p { color: #fff; }
        .mission-annapurna .about-card h3 { margin-bottom: 15px; color: #00a3da; }

        .mission-annapurna .highlight-section { padding: 4px 4%; }
        .mission-annapurna .section-header { text-align: center; margin-bottom: 20px; }
        .mission-annapurna .section-header span { color: #00a3da; font-weight: 700; letter-spacing: 2px; font-size: 40px; }
        .mission-annapurna .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-annapurna .section-header p { color: #6b7d8f; }
        .mission-annapurna .highlight-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 30px; }
        .mission-annapurna .highlight-card {
          background: #fff; padding: 20px 30px; border-radius: 30px; transition: 0.5s;
          position: relative; overflow: hidden; box-shadow: 0 25px 40px rgba(0,0,0,0.05); cursor: pointer;
        }
        .mission-annapurna .highlight-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.5s ease; z-index: 1;
        }
        .mission-annapurna .highlight-card:hover::before { height: 100%; }
        .mission-annapurna .highlight-card:hover { transform: translateY(-15px); }
        .mission-annapurna .highlight-card h3, .mission-annapurna .highlight-card p, .mission-annapurna .highlight-card .number {
          position: relative; z-index: 2; transition: 0.4s ease;
        }
        .mission-annapurna .highlight-card:hover h3, .mission-annapurna .highlight-card:hover p { color: #fff; }
        .mission-annapurna .number { font-size: 60px; font-weight: 700; color: #00a3da1e; position: absolute; right: 20px; top: 10px; }
        .mission-annapurna .highlight-card:hover .number { color: #ffffff40; }
        .mission-annapurna .highlight-card h3 { margin-bottom: 18px; font-size: 18px; }
        .mission-annapurna .highlight-card p { line-height: 1.8; color: #6a7b8c; }

        .mission-annapurna .gallery-section { padding: 4px 4%; }
        .mission-annapurna .gallery-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 25px; }
        .mission-annapurna .gallery-card { overflow: hidden; border-radius: 30px; height: 420px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .mission-annapurna .gallery-card img { height: 100%; object-fit: cover; transition: 0.6s; }
        .mission-annapurna .gallery-card:hover img { transform: scale(1.12); }

        .mission-annapurna .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-annapurna .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; padding: 0; }
        .mission-annapurna .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-annapurna .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-annapurna .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-annapurna .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-annapurna .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-annapurna .sevak-btn:hover { transform: translateY(-2px); }

        .mission-annapurna .testimonial-section { padding: 4px 4%; }
        .mission-annapurna .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch; grid-auto-rows: 1fr;
        }
        .mission-annapurna .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden;
          position: relative; z-index: 0; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;
        }
        .mission-annapurna .testimonial-card:hover { transform: translateY(-10px); background: #00a3da; }
        .mission-annapurna .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-annapurna .testimonial-card h4 { color: #00a3da; }
        .mission-annapurna .testimonial-card h4, .mission-annapurna .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-annapurna .testimonial-card:hover h4, .mission-annapurna .testimonial-card:hover p { color: #fff !important; }
        .mission-annapurna .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-annapurna .testimonial-card:hover::before { height: 100%; }
        .mission-annapurna .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-annapurna .hero, .mission-annapurna .about-section { grid-template-columns: 1fr; min-height: auto; padding: 60px 5% 40px; gap: 40px; text-align: center; }
          .mission-annapurna .about-section { margin-top: 0; }
          .mission-annapurna .hero-content { order: 1; }
          .mission-annapurna .hero-image { order: 2; margin: 0 auto; }
          .mission-annapurna .hero h1 { font-size: 42px; }
          .mission-annapurna .hero p { font-size: 16px; }
          .mission-annapurna .hero-buttons { justify-content: center; }
          .mission-annapurna .hero-image img { height: 280px; max-width: 100%; transform: perspective(800px) rotateY(-5deg); }
          .mission-annapurna .card1 { top: 10px; left: -20px; }
          .mission-annapurna .card2 { bottom: 30px; right: -20px; }
          .mission-annapurna .floating-card { padding: 10px 16px; }
          .mission-annapurna .floating-card h3 { font-size: 26px; }
          .mission-annapurna .about-image img { height: 400px; max-width: 100%; }
          .mission-annapurna .about-content h2 { font-size: 32px; }
          .mission-annapurna .small-title { font-size: 26px; }
          .mission-annapurna .about-grid { grid-template-columns: 1fr; gap: 20px; }
          .mission-annapurna .section-header span { font-size: 30px; }
          .mission-annapurna .section-header h2 { font-size: 32px; }
          .mission-annapurna .highlight-grid { grid-template-columns: repeat(2,1fr); gap: 20px; padding: 0 5%; }
          .mission-annapurna .gallery-grid { grid-template-columns: repeat(2,1fr); gap: 16px; padding: 0 5%; }
          .mission-annapurna .gallery-card { height: 250px; }
          .mission-annapurna .sevak-donation-content { flex-direction: column; text-align: center; gap: 24px; }
          .mission-annapurna .sevak-title { font-size: 32px; }
          .mission-annapurna .sevak-desc { font-size: 14px; }
          .mission-annapurna .testimonial-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .mission-annapurna .hero { padding: 40px 5% 30px; gap: 24px; }
          .mission-annapurna .hero h1 { font-size: 28px; }
          .mission-annapurna .hero p { font-size: 14px; }
          .mission-annapurna .tag { font-size: 20px; }
          .mission-annapurna .hero-image { width: 100%; max-width: 360px; margin: 0 auto; }
          .mission-annapurna .hero-image img { height: 200px; width: 100%; border-radius: 20px; transform: none; animation: none; }
          .mission-annapurna .hero-image::before { display: none; }
          .mission-annapurna .card1 { top: 0; left: 0; border-radius: 0 0 12px 0; }
          .mission-annapurna .card2 { bottom: 0; right: 0; border-radius: 12px 0 0 0; }
          .mission-annapurna .floating-card { padding: 5px 8px; }
          .mission-annapurna .floating-card h3 { font-size: 16px; line-height: 1.2; }
          .mission-annapurna .floating-card p { font-size: 11px; margin: 0; }
          .mission-annapurna .donate-btn-hero { padding: 10px 20px; font-size: 14px; }
          .mission-annapurna .about-image img { height: 280px; border-radius: 24px; }
          .mission-annapurna .about-section { margin-top: 0; }
          .mission-annapurna .about-image::before { display: none; }
          .mission-annapurna .about-content h2 { font-size: 26px; }
          .mission-annapurna .small-title { font-size: 20px; }
          .mission-annapurna .about-card { padding: 20px; }
          .mission-annapurna .about-card h3 { font-size: 16px; }
          .mission-annapurna .section-header span { font-size: 24px; }
          .mission-annapurna .section-header h2 { font-size: 26px; }
          .mission-annapurna .highlight-grid { grid-template-columns: 1fr; }
          .mission-annapurna .highlight-card { padding: 16px 20px; }
          .mission-annapurna .highlight-card h3 { font-size: 16px; }
          .mission-annapurna .number { font-size: 40px; }
          .mission-annapurna .gallery-grid { grid-template-columns: 1fr; gap: 12px; }
          .mission-annapurna .gallery-card { height: 220px; border-radius: 20px; }
          .mission-annapurna .sevak-donation { padding: 40px 5%; }
          .mission-annapurna .sevak-title { font-size: 26px; }
          .mission-annapurna .sevak-btn { padding: 12px 28px; font-size: 14px; }
          .mission-annapurna .testimonial-card { padding: 20px; }
          .mission-annapurna .testimonial-card p { font-size: 14px; }
          .mission-annapurna .tax-box { height: auto; padding: 16px; }
          .mission-annapurna .tax-box p { font-size: 14px; }
          #donate iframe { height: 850px !important; }
        }
      `}</style>

      <div className="mission-annapurna">
        <section className="tax-box">
          <h1>{taxTitle}</h1>
        </section>

        <section className="hero">
          <div className="hero-content">
            <span className="tag">{heroTag}</span>
            <h1>{heroLine1} <br />{heroLine2} <span>{heroHighlight}</span></h1>
            <p>{heroText}</p>
            <div className="hero-buttons">
              <a href="#donate" className="donate-btn-hero">Support The Mission</a>
            </div>
          </div>
          <div className="hero-image">
            {heroStats.map((stat, i) => (
              <div className={`floating-card card${i + 1}`} key={i}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
            <img src={heroImage} alt="ngo" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
          </div>
          <div className="blur blur1"></div>
          <div className="blur blur2"></div>
        </section>

        <div id="donate" style={{ width: '100%', background: '#f4f7fb', padding: '0', overflow: 'hidden', marginBottom: '0', position: 'relative', zIndex: 10, isolation: 'isolate' }}>
          <iframe
            ref={iframeRef}
            src={donationUrl}
            style={{ width: '100%', height: '650px', border: 'none', display: 'block' }}
            title="Donate to Mission Annapurna"
          />
        </div>

        <section className="about-section" id="about">
          <div className="about-image">
            <img src={aboutImage} alt="food distribution" loading="lazy" decoding="async" width="800" height="600" />
          </div>
          <div className="about-content">
            <span className="small-title">{aboutTag}</span>
            <h2>{aboutHeading}</h2>
            <div className="about-grid">
              {aboutCards.map((card, i) => (
                <div className="about-card" key={i}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="highlight-section" id="highlights">
          <div className="section-header">
            <span>{programsTag}</span>
            <p>{programsText1}</p>
            <p>{programsText2}</p>
          </div>
          <div className="highlight-grid">
            {programs.map((program, i) => (
              <div className="highlight-card" key={i}>
                <div className="number">{program.number}</div>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="gallery-section">
          <div className="gallery-grid">
            {galleryImages.map((src, i) => (
              <div className="gallery-card" key={i}><img src={src} alt="gallery" loading="lazy" decoding="async" width="800" height="600" /></div>
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

export default MissionAnnapurna;

