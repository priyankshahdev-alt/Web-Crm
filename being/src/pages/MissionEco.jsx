import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function MissionEco() {
  const iframeRef = useRef(null);

  const content = usePageContent('mission-eco');

  const taxTitle = content('mission-eco-tax', 'title') ?? 'Mission Eco-Warriors';

  const heroTag = content('mission-eco-hero', 'tag') ?? 'Mission Eco Warriors';
  const heroHeading = content('mission-eco-hero', 'heading') ?? 'Turning Plastic Bottles Into A Cleaner Future';
  const heroText =
    content('mission-eco-hero', 'description') ??
    'Mission Eco Warriors by Being Sevak promotes cleanliness and recycling by installing Bottle Crusher Machines at metro stations and public places to reduce plastic waste and protect the environment.';
  const heroImage = content('mission-eco-hero', 'image') ?? '/images/eco main..jpg';

  const impactStats =
    content('eco-impact', 'stats') ?? [
      { value: '25+', label: 'Machines Installed' },
      { value: '10K+', label: 'Bottles Recycled' },
      { value: '15+', label: 'Metro Stations' },
    ];

  const workHeading = content('eco-activities', 'heading') ?? 'Our Activities';
  const workImages =
    content('eco-activities', 'images') ?? [
      { src: '/images/eco5.jpeg', alt: '' },
      { src: '/images/eco3.jpeg', alt: '' },
      { src: '/images/eco2.jpeg', alt: '' },
      { src: '/images/eco7.jpeg', alt: '' },
      { src: '/images/eco6.jpeg', alt: '' },
      { src: '/images/eco4.jpeg', alt: '' },
    ];

  const treeHeading = content('eco-tree-plantation', 'heading') ?? 'Tree Plantation';
  const treeText1 =
    content('eco-tree-plantation', 'text1') ??
    'Our Tree Plantation initiative is dedicated to creating a greener, healthier, and more sustainable future for communities. Through collective efforts, we plant trees in schools, public spaces, villages, and urban areas to improve air quality and protect nature.';
  const treeText2 =
    content('eco-tree-plantation', 'text2') ??
    'Every tree planted is a step toward reducing pollution, conserving biodiversity, and spreading environmental awareness among people. Together, we aim to inspire communities to care for the planet and build a cleaner tomorrow.';
  const treeMainImage = content('eco-tree-plantation', 'image') ?? '/images/tree1.jpg';
  const treeSmallImages =
    content('eco-tree-plantation', 'images') ?? [
      { src: '/images/tree2.jpg', alt: '' },
      { src: '/images/tree3.jpg', alt: '' },
      { src: '/images/tree4.jpg', alt: '' },
    ];
  const treeStats =
    content('eco-tree-plantation', 'stats') ?? [
      { value: '500+', label: 'Trees Planted' },
      { value: '20+', label: 'Volunteer Teams' },
      { value: '15+', label: 'Communities Reached' },
    ];

  const beachTag = content('eco-beach-sevak', 'tag') ?? 'Beach Sevak Initiative';
  const beachHeading = content('eco-beach-sevak', 'heading') ?? 'Clean Beaches, Safe Oceans, Better Future';
  const beachText =
    content('eco-beach-sevak', 'description') ??
    'Beach Sevak by Being Sevak focuses on cleaning coastal areas, protecting marine life and spreading awareness about ocean waste.';
  const beachImage = content('eco-beach-sevak', 'image') ?? '/images/beach1.png';

  const beachImpactStats =
    content('eco-beach-impact', 'stats') ?? [
      { value: '120+', label: 'Clean Drives' },
      { value: '5T+', label: 'Waste Removed' },
      { value: '500+', label: 'Volunteers' },
    ];

  const beachWorkHeading = content('eco-beach-activities', 'heading') ?? 'Our Activities';
  const beachWorkImages =
    content('eco-beach-activities', 'images') ?? [
      { src: '/images/beach2.jpeg', alt: '' },
      { src: '/images/beach3.jpeg', alt: '' },
      { src: '/images/beach4.jpeg', alt: '' },
    ];

  const donationTag = content('eco-donation', 'tag') ?? 'Mission Eco Warriors';
  const donationUrl = content('eco-donation', 'donationUrl') ?? '/donations/donation-ecowarriors.html';
  const donationTitle = content('eco-donation', 'title') ?? 'Fight Today for a Greener Tomorrow';
  const donationText =
    content('eco-donation', 'description') ??
    'Join our Eco Warriors movement to protect nature through tree plantation, waste management, recycling awareness, and climate action for a sustainable future.';

  const testimonialHeading = content('eco-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('eco-testimonials', 'items') ?? [
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
        .mission-eco * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-eco { font-family: 'Montserrat', sans-serif; overflow-x: hidden; background: #fff; }
        .mission-eco img { width: 100%; display: block; }

        .mission-eco .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%); color: #fff;
          margin: 10px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-eco .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-eco .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-eco .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: meShine 6s linear infinite;
        }
        .mission-eco .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes meShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-eco .hero {
          width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 60px 7%; background: #f4fcff;
        }
        .mission-eco .hero-content { width: 100%; max-width: 1200px; display: flex; align-items: center; justify-content: space-between; gap: 60px; }
        .mission-eco .hero-left { flex: 1; }
        .mission-eco .hero-right { flex: 1; display: flex; justify-content: center; }
        .mission-eco .hero-right img {
          width: 100%; max-width: 520px; height: 550px; object-fit: cover; border-radius: 40px;
          transition: 0.6s ease; transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.18); animation: meFloatImage 4s ease-in-out infinite;
        }
        .mission-eco .hero-right img:hover { transform: perspective(1000px) rotateY(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25); }
        @keyframes meFloatImage {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
        }
        .mission-eco .tag { color: #00a3da; display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px; background: none; }
        .mission-eco .hero-left h1 { font-size: 62px; line-height: 1.1; margin-bottom: 25px; }
        .mission-eco .hero-left p { font-size: 18px; color: #6b7280; line-height: 1.9; margin-bottom: 35px; }
        .mission-eco .btns { display: flex; gap: 15px; flex-wrap: wrap; }
        .mission-eco .btn { padding: 16px 34px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 18px; transition: 0.3s; }
        .mission-eco .primary { background: #00a3da; color: #fff; box-shadow: 0 15px 35px rgba(0,163,218,0.35); }
        .mission-eco .btn:hover { transform: translateY(-4px); }

        .mission-eco .impact { width: 100%; padding-top: 60px; padding-right: 7%; padding-bottom: 60px; padding-left: 7%; background: #f8fbfd; }
        .mission-eco .box { max-width: 1100px; margin: auto; display: flex; justify-content: center; align-items: center; gap: 25px; flex-wrap: wrap; }
        .mission-eco .card {
          background: #fff; padding: 30px 25px; border-radius: 22px; min-width: 200px;
          text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: 0.3s; cursor: pointer;
        }
        .mission-eco .card:hover { transform: translateY(-6px); background: #00a3da; color: #fff; }
        .mission-eco .card h2 { font-size: 38px; color: #00a3da; margin-bottom: 8px; }
        .mission-eco .card:hover h2, .mission-eco .card:hover p { color: #fff; }

        .mission-eco .work { width: 100%; padding: 60px 7%; text-align: center; }
        .mission-eco .work h2 { font-size: 42px; margin-bottom: 40px; }
        .mission-eco .grid { max-width: 1100px; margin: auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 25px; }
        .mission-eco .item { border-radius: 25px; overflow: hidden; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.05); transition: 0.4s; }
        .mission-eco .item img { width: 100%; height: 220px; object-fit: cover; transition: 0.5s; }
        .mission-eco .item:hover img { transform: scale(1.08); }

        .mission-eco .green-earth-wrap { width: 100%; padding: 100px 7%; background: #fff; overflow: hidden; position: relative; }
        .mission-eco .green-earth-wrap::before {
          content: ""; position: absolute; width: 320px; height: 320px; background: #00a3da15;
          border-radius: 50%; top: -120px; right: -120px; filter: blur(20px);
        }
        .mission-eco .green-earth-container { display: flex; align-items: center; justify-content: space-between; gap: 70px; flex-wrap: wrap; }
        .mission-eco .green-earth-gallery { flex: 1; min-width: 320px; position: relative; }
        .mission-eco .green-earth-main-img {
          border-radius: 30px; overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.12), 0 10px 25px rgba(0,163,218,0.15);
          transition: 0.5s;
        }
        .mission-eco .green-earth-main-img:hover { transform: perspective(1000px) rotateY(-5deg) translateY(-8px); }
        .mission-eco .green-earth-main-img img { width: 100%; height: 450px; object-fit: cover; display: block; }
        .mission-eco .green-earth-bottom-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-top: 22px; }
        .mission-eco .green-earth-small-card {
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08), 0 6px 15px rgba(0,163,218,0.12);
          transition: 0.4s; background: #fff;
        }
        .mission-eco .green-earth-small-card:hover { transform: translateY(-8px) scale(1.03); }
        .mission-eco .green-earth-small-card img { width: 100%; height: 130px; object-fit: cover; display: block; }
        .mission-eco .green-earth-content { flex: 1; min-width: 320px; }
        .mission-eco .green-earth-content h2 { font-size: 58px; line-height: 1.1; color: #111; margin-bottom: 25px; font-weight: 800; }
        .mission-eco .green-earth-content p { font-size: 17px; line-height: 1.9; color: #555; margin-bottom: 18px; }
        .mission-eco .green-earth-points { display: flex; gap: 18px; margin-top: 35px; flex-wrap: wrap; }
        .mission-eco .green-earth-box {
          flex: 1; min-width: 140px; background: #fff; border: 1px solid #e9f7fc; padding: 28px 20px;
          border-radius: 24px; text-align: center;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05), 0 10px 20px rgba(0,163,218,0.08); transition: 0.4s;
        }
        .mission-eco .green-earth-box:hover { transform: translateY(-8px); }
        .mission-eco .green-earth-box h3 { font-size: 36px; color: #00a3da; margin-bottom: 8px; font-weight: 800; }
        .mission-eco .green-earth-box span { color: #666; font-size: 15px; }
        .mission-eco .green-earth-btn {
          display: inline-block; margin-top: 38px; background: #00a3da; color: #fff; padding: 16px 34px;
          border-radius: 60px; text-decoration: none; font-weight: 600; transition: 0.4s;
          box-shadow: 0 15px 30px rgba(0,163,218,0.25);
        }
        .mission-eco .green-earth-btn:hover { transform: translateY(-5px); background: #008bb9; }

        .mission-eco .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-eco .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; }
        .mission-eco .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-eco .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-eco .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-eco .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-eco .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-eco .sevak-btn:hover { transform: translateY(-2px); }

        .mission-eco .testimonial-section { padding: 50px 5%; }
        .mission-eco .section-header { text-align: center; margin-bottom: 40px; }
        .mission-eco .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-eco .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .mission-eco .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden; position: relative;
        }
        .mission-eco .testimonial-card:hover { transform: translateY(-10px); }
        .mission-eco .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-eco .testimonial-card h4 { color: #00a3da; }
        .mission-eco .testimonial-card h4, .mission-eco .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-eco .testimonial-card:hover h4, .mission-eco .testimonial-card:hover p { color: #fff !important; }
        .mission-eco .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-eco .testimonial-card:hover::before { height: 100%; }
        .mission-eco .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-eco .hero-content { flex-direction: column; text-align: center; }
          .mission-eco .hero-left h1 { font-size: 46px; }
          .mission-eco .hero-right img { height: auto; aspect-ratio: 16/10; max-height: 420px; transform: none; animation: none; }
          .mission-eco .grid { grid-template-columns: 1fr; }
          .mission-eco .green-earth-container { flex-direction: column; }
          .mission-eco .green-earth-content h2 { font-size: 42px; }
          .mission-eco .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-eco .sevak-title { font-size: 34px; }
        }
        @media (max-width: 600px) {
          .mission-eco .hero-left h1 { font-size: 32px; }
          .mission-eco .tag { font-size: 20px; }
          .mission-eco .btns { flex-direction: column; align-items: center; }
          .mission-eco .hero-right img { height: auto; aspect-ratio: 4/3; max-height: 300px; border-radius: 24px; transform: none; animation: none; }
          .mission-eco .green-earth-wrap { padding: 50px 5%; }
          .mission-eco .green-earth-content h2 { font-size: 34px; }
          .mission-eco .green-earth-btn { display: block; width: fit-content; margin-left: auto; margin-right: auto; }
          .mission-eco .sevak-title { font-size: 28px; }
        }
      `}</style>

      <div className="mission-eco">
        <section className="tax-box">
          <h1>{taxTitle}</h1>
        </section>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <span className="tag">{heroTag}</span>
              <h1><b>{heroHeading}</b></h1>
              <p>
                {heroText}
              </p>
              <div className="btns">
                <a href="#donate" className="btn primary">Support Mission</a>
              </div>
            </div>
            <div className="hero-right">
              <img src={heroImage} alt="Eco Warriors" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
            </div>
          </div>
        </section>

        <div id="donate" style={{ width: '100%', background: '#f4f7fb', padding: '0', overflow: 'hidden', marginBottom: '0', position: 'relative', zIndex: 10, isolation: 'isolate' }}>
          <iframe
            ref={iframeRef}
            src={donationUrl}
            style={{ width: '100%', height: '650px', border: 'none', display: 'block', marginBottom: '-1px' }}
            title="Donate to Mission Eco Warriors"
          />
        </div>

        <section className="impact">
          <div className="box">
            {impactStats.map((s, i) => (
              <div className="card" key={i}><h2>{s.value}</h2><p>{s.label}</p></div>
            ))}
          </div>
        </section>

        <section className="work">
          <h2>{workHeading}</h2>
          <div className="grid">
            {workImages.map((img, i) => (
              <div className="item" key={i}><img src={img.src} alt={img.alt} loading="lazy" decoding="async" width="800" height="600" /></div>
            ))}
          </div>
        </section>

        <section className="green-earth-wrap">
          <div className="green-earth-container">
            <div className="green-earth-gallery">
              <div className="green-earth-main-img">
                <img src={treeMainImage} alt="" loading="lazy" decoding="async" width="800" height="600" />
              </div>
              <div className="green-earth-bottom-grid">
                {treeSmallImages.map((img, i) => (
                  <div className="green-earth-small-card" key={i}><img src={img.src} alt={img.alt} loading="lazy" decoding="async" width="800" height="600" /></div>
                ))}
              </div>
            </div>
            <div className="green-earth-content">
              <h2>{treeHeading}</h2>
              <p>
                {treeText1}
              </p>
              <p>
                {treeText2}
              </p>
              <div className="green-earth-points">
                {treeStats.map((s, i) => (
                  <div className="green-earth-box" key={i}><h3>{s.value}</h3><span>{s.label}</span></div>
                ))}
              </div>
              <Link to="/donate" className="green-earth-btn">Join The Mission</Link>
            </div>
          </div>
        </section>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <span className="tag">{beachTag}</span>
              <h1>{beachHeading}</h1>
              <p>
                {beachText}
              </p>
              <div className="btns">
                <a href="#impact" className="btn primary">Join Mission</a>
              </div>
            </div>
            <div className="hero-right">
              <img src={beachImage} alt="Beach Sevak" loading="lazy" decoding="async" width="800" height="600" />
            </div>
          </div>
        </section>

        <section className="impact">
          <div className="box">
            {beachImpactStats.map((s, i) => (
              <div className="card" key={i}><h2>{s.value}</h2><p>{s.label}</p></div>
            ))}
          </div>
        </section>

        <section className="work">
          <h2>{beachWorkHeading}</h2>
          <div className="grid">
            {beachWorkImages.map((img, i) => (
              <div className="item" key={i}><img src={img.src} alt={img.alt} loading="lazy" decoding="async" width="800" height="600" /></div>
            ))}
          </div>
        </section>

        <section className="sevak-donation" id="donate">
          <div className="sevak-donation-content">
            <div className="sevak-left">
              <span className="sevak-tag">{donationTag}</span>
              <h2 className="sevak-title">{donationTitle}</h2>
              <p className="sevak-desc">
                {donationText}
              </p>
            </div>
            <div className="sevak-right">
              <Link to="/donate" className="sevak-btn">Donate Now</Link>
            </div>
          </div>
        </section>

        <br />

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
}

