import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';

export default function MissionBeach() {
  const content = usePageContent('mission-beach');

  const taxTitle = content('mission-beach-tax', 'title') ?? 'Mission Beach Sevak';

  const heroTag = content('mission-beach-hero', 'tag') ?? 'Beach Sevak Initiative';
  const heroHeading = content('mission-beach-hero', 'heading') ?? 'Clean Beaches, Safe Oceans, Better Future';
  const heroText =
    content('mission-beach-hero', 'description') ??
    'Beach Sevak by Being Sevak focuses on cleaning coastal areas, protecting marine life and spreading awareness about ocean waste.';
  const heroImage = content('mission-beach-hero', 'image') ?? '/images/beach1.png';

  const impactStats =
    content('beach-impact', 'stats') ?? [
      { value: '120+', label: 'Clean Drives' },
      { value: '5T+', label: 'Waste Removed' },
      { value: '500+', label: 'Volunteers' },
    ];

  const workHeading = content('beach-activities', 'heading') ?? 'Our Activities';
  const workImages =
    content('beach-activities', 'images') ?? [
      { src: '/images/beach2.jpg', alt: '' },
      { src: '/images/beach3.jpeg', alt: '' },
      { src: '/images/beach4.jpeg', alt: '' },
    ];

  const donationTag = content('beach-donation', 'tag') ?? 'Beach Sevak';
  const donationTitle = content('beach-donation', 'title') ?? 'Protect Our Beaches, Protect Our Future';
  const donationText =
    content('beach-donation', 'description') ??
    'Join our mission to keep beaches clean by removing plastic waste, protecting marine life, and spreading awareness for a cleaner and healthier coastal environment.';

  const testimonialHeading = content('beach-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('beach-testimonials', 'items') ?? [
      { quote: '"Being Sevak is doing incredible work for visually impaired and needy families. Proud to support this mission."', name: 'Riya Sharma' },
      { quote: '"Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity."', name: 'Rahul Mehta' },
      { quote: '"Every donation creates real change. Their food distribution drives truly touch lives."', name: 'Anjali Verma' },
    ];

  return (
    <>
      <style>{`
        .mission-beach * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-beach { font-family: 'Montserrat', sans-serif; overflow-x: hidden; background: #fff; }
        .mission-beach img { width: 100%; display: block; }

        .mission-beach .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(135deg, #00a3da, #315270); color: #fff;
          margin: 20px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-beach .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-beach .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-beach .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: mbShine 6s linear infinite;
        }
        .mission-beach .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes mbShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-beach .hero {
          width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 60px 7%; background: #f4fcff;
        }
        .mission-beach .hero-content { width: 100%; max-width: 1200px; display: flex; align-items: center; justify-content: space-between; gap: 60px; }
        .mission-beach .hero-left { flex: 1; }
        .mission-beach .hero-right { flex: 1; display: flex; justify-content: center; }
        .mission-beach .hero-right img {
          width: 100%; max-width: 520px; height: 550px; object-fit: cover; border-radius: 40px;
          transition: 0.6s ease; transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.18); animation: mbFloatImage 4s ease-in-out infinite;
        }
        .mission-beach .hero-right img:hover { transform: perspective(1000px) rotateY(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25); }
        @keyframes mbFloatImage {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
        }
        .mission-beach .tag { color: #00a3da; display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px; }
        .mission-beach .hero-left h1 { font-size: 62px; line-height: 1.1; margin-bottom: 25px; }
        .mission-beach .hero-left p { font-size: 18px; color: #6b7280; line-height: 1.9; margin-bottom: 35px; }
        .mission-beach .btns { display: flex; gap: 15px; flex-wrap: wrap; }
        .mission-beach .btn { padding: 16px 34px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 18px; transition: 0.3s; }
        .mission-beach .primary { background: #00a3da; color: #fff; box-shadow: 0 15px 35px rgba(0,163,218,0.35); }
        .mission-beach .btn:hover { transform: translateY(-4px); }

        .mission-beach .impact { width: 100%; padding: 0 7%; background: #f8fbfd; }
        .mission-beach .box { max-width: 1100px; margin: auto; display: flex; justify-content: center; align-items: center; gap: 25px; flex-wrap: wrap; }
        .mission-beach .card {
          background: #fff; padding: 30px 25px; border-radius: 22px; min-width: 200px;
          text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: 0.3s; cursor: pointer;
        }
        .mission-beach .card:hover { transform: translateY(-6px); background: #00a3da; color: #fff; }
        .mission-beach .card h2 { font-size: 38px; color: #00a3da; margin-bottom: 8px; }
        .mission-beach .card:hover h2, .mission-beach .card:hover p { color: #fff; }

        .mission-beach .work { width: 100%; padding: 10px 7%; text-align: center; }
        .mission-beach .work h2 { font-size: 42px; margin-bottom: 40px; }
        .mission-beach .grid { max-width: 1100px; margin: auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 25px; }
        .mission-beach .item { border-radius: 25px; overflow: hidden; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.05); transition: 0.4s; }
        .mission-beach .item img { width: 100%; height: 220px; object-fit: cover; transition: 0.5s; }
        .mission-beach .item:hover img { transform: scale(1.03); }

        .mission-beach .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-beach .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; }
        .mission-beach .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-beach .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-beach .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-beach .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-beach .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-beach .sevak-btn:hover { transform: translateY(-2px); }

        .mission-beach .testimonial-section { padding: 50px 5%; }
        .mission-beach .section-header { text-align: center; margin-bottom: 60px; }
        .mission-beach .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-beach .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .mission-beach .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden; position: relative;
        }
        .mission-beach .testimonial-card:hover { transform: translateY(-10px); }
        .mission-beach .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-beach .testimonial-card h4 { color: #00a3da; }
        .mission-beach .testimonial-card h4, .mission-beach .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-beach .testimonial-card:hover h4, .mission-beach .testimonial-card:hover p { color: #fff !important; }
        .mission-beach .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-beach .testimonial-card:hover::before { height: 100%; }
        .mission-beach .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-beach .hero-content { flex-direction: column; text-align: center; }
          .mission-beach .hero-left h1 { font-size: 46px; }
          .mission-beach .hero-right img { height: auto; aspect-ratio: 16/10; max-height: 420px; transform: none; animation: none; }
          .mission-beach .grid { grid-template-columns: 1fr; }
          .mission-beach .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-beach .sevak-title { font-size: 34px; }
        }
        @media (max-width: 600px) {
          .mission-beach .hero-left h1 { font-size: 38px; }
          .mission-beach .btns { flex-direction: column; }
          .mission-beach .hero-right img { height: auto; aspect-ratio: 4/3; max-height: 300px; transform: none; animation: none; border-radius: 24px; }
          .mission-beach .sevak-title { font-size: 28px; }
        }
      `}</style>

      <div className="mission-beach">
        <section className="tax-box">
          <h1>{taxTitle}</h1>
        </section>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <span className="tag">{heroTag}</span>
              <h1>{heroHeading}</h1>
              <p>
                {heroText}
              </p>
              <div className="btns">
                <a href="#impact" className="btn primary">Join Mission</a>
              </div>
            </div>
            <div className="hero-right">
              <img src={heroImage} alt="Beach Sevak" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
            </div>
          </div>
        </section>

        <section className="impact" id="impact">
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

        <section className="sevak-donation">
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

