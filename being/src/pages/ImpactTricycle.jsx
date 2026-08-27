import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function ImpactTricycle() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = usePageContent('impact-tricycle');

  const headingTag = content('impact-tricycle-heading', 'tag') ?? 'MOBILITY SUPPORT PROGRAM';
  const headingTitle = content('impact-tricycle-heading', 'heading') ?? 'Tricycle to Lifecycle';
  const headingText =
    content('impact-tricycle-heading', 'description') ??
    'Empowering visually impaired and differently-abled individuals with specially designed tricycles that provide independence, dignity, and a better quality of life. Through this initiative, Being Sevak Charitable Trust helps beneficiaries travel safely, access opportunities, and become more self-reliant in their daily lives.';
  const mainImage = content('impact-tricycle-heading', 'image') ?? '/images/g64.webp';
  const cards =
    content('impact-tricycle-cards', 'items') ?? [
      { title: 'Freedom of Movement', description: 'Tricycles provide safe and independent mobility for visually impaired and differently-abled individuals.' },
      { title: 'Improved Daily Life', description: 'Beneficiaries can travel to work, education centers, markets, and social activities with confidence.' },
      { title: 'Building Self-Reliance', description: 'Access to mobility creates opportunities for financial independence and social inclusion.' },
      { title: 'Community Impact', description: 'Every tricycle gifted becomes a step toward dignity, empowerment, and a more inclusive society.' },
    ];
  const stats =
    content('impact-tricycle-impact', 'stats') ?? [
      { value: '500+', label: 'Lives Empowered' },
      { value: '100%', label: 'Mobility Support' },
      { value: '50+', label: 'Distribution Drives' },
    ];
  const galleryTag = content('impact-tricycle-gallery', 'tag') ?? 'PROJECT GALLERY';
  const galleryTitle = content('impact-tricycle-gallery', 'heading') ?? 'Moments of Impact';
  const galleryText =
    content('impact-tricycle-gallery', 'description') ??
    'Explore glimpses of our initiatives, community outreach programs, and the positive impact created through collective efforts.';
  const galleryImages =
    content('impact-tricycle-gallery', 'images') ?? ['/images/g61.webp', '/images/g62.webp', '/images/g63.webp'];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
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
        body { font-family: 'Open Sans', sans-serif; color: var(--text-dark); overflow-x: hidden; }

        .tricycle-lifecycle-section {
          background: #fff;
          padding: 100px 8%;
          overflow: hidden;
        }
        .tricycle-container {
          max-width: 1300px;
          margin: auto;
        }
        .tricycle-heading {
          text-align: center;
          max-width: 850px;
          margin: 0 auto 70px;
        }
        .tricycle-tag {
          display: inline-block;
          padding: 10px 22px;
          background: rgba(0,163,218,0.12);
          color: #00a3da;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        .tricycle-heading h2 {
          font-size: 52px;
          color: #111;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .tricycle-heading p {
          color: #666;
          font-size: 17px;
          line-height: 1.9;
        }
        .tricycle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }
        .tricycle-image {
          position: relative;
        }
        .tricycle-image::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          background: #00a3da;
          border-radius: 50%;
          top: -30px;
          left: -30px;
          opacity: .12;
        }
        .tricycle-image img {
          width: 100%;
          border-radius: 25px;
          display: block;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
          position: relative;
          z-index: 2;
        }
        .tricycle-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .tricycle-card {
          background: #fff;
          border: 1px solid rgba(0,163,218,0.15);
          padding: 28px;
          border-radius: 20px;
          transition: .4s;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .tricycle-card:hover {
          background: #00a3da;
          transform: translateY(-8px);
        }
        .tricycle-card h3 {
          color: #111;
          margin-bottom: 12px;
          font-size: 22px;
          transition: .4s;
        }
        .tricycle-card p {
          color: #666;
          line-height: 1.7;
          transition: .4s;
        }
        .tricycle-card:hover h3,
        .tricycle-card:hover p {
          color: #fff;
        }
        .tricycle-stats {
          margin-top: 80px;
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }
        .tricycle-stat-box {
          background: #00a3da;
          min-width: 250px;
          padding: 35px;
          text-align: center;
          border-radius: 20px;
          color: #fff;
          box-shadow: 0 15px 35px rgba(0,163,218,0.25);
        }
        .tricycle-stat-box h3 {
          font-size: 42px;
          margin-bottom: 10px;
        }
        .tricycle-stat-box span {
          font-size: 17px;
          font-weight: 500;
        }

        @media(max-width:991px) {
          .tricycle-grid { grid-template-columns: 1fr; }
          .tricycle-content { grid-template-columns: 1fr; }
          .tricycle-heading h2 { font-size: 38px; }
          .tricycle-stat-box { width: 100%; }
        }

        .shital-gallery-section {
          padding: 90px 8%;
          background: #fff;
        }
        .shital-gallery-heading {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 50px;
        }
        .shital-gallery-heading span {
          display: inline-block;
          padding: 10px 24px;
          background: rgba(0,163,218,.12);
          color: #00a3da;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 18px;
        }
        .shital-gallery-heading h2 {
          font-size: 48px;
          color: #111;
          margin-bottom: 15px;
        }
        .shital-gallery-heading p {
          color: #666;
          font-size: 17px;
          line-height: 1.8;
        }
        .shital-gallery {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 25px;
        }
        .shital-gallery-item {
          overflow: hidden;
          border-radius: 25px;
          box-shadow: 0 15px 35px rgba(0,0,0,.08);
          position: relative;
        }
        .shital-gallery-item img {
          width: 100%;
          height: auto;
          display: block;
          transition: 0.6s ease;
        }
        .shital-gallery-item:hover img {
          transform: scale(1.08);
        }
        .shital-gallery-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.15), transparent);
          opacity: 0;
          transition: .4s;
        }
        .shital-gallery-item:hover::after {
          opacity: 1;
        }
        @media(max-width:991px) {
          .shital-gallery { grid-template-columns: 1fr; }
          .shital-gallery-heading h2 { font-size: 38px; }
        }
      `}</style>

      <section className="tricycle-lifecycle-section">
        <div className="tricycle-container">
          <div className="tricycle-heading">
            <span className="tricycle-tag">{headingTag}</span>
            <h2>{headingTitle}</h2>
            <p>{headingText}</p>
          </div>

          <div className="tricycle-grid">
            <div className="tricycle-image">
              <img src={mainImage} alt="Tricycle Distribution" loading="lazy" decoding="async" width="800" height="600" />
            </div>
            <div className="tricycle-content">
              {cards.map((card, i) => (
                <div className="tricycle-card" key={i}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tricycle-stats">
            {stats.map((s, i) => (
              <div className="tricycle-stat-box" key={i}>
                <h3>{s.value}</h3>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shital-gallery-section">
        <div className="shital-gallery-heading">
          <span>{galleryTag}</span>
          <h2>{galleryTitle}</h2>
          <p>{galleryText}</p>
        </div>
        <div className="shital-gallery">
          {galleryImages.map((src, i) => (
            <div className="shital-gallery-item" key={i}><img src={src} alt="" loading="lazy" decoding="async" width="800" height="600" /></div>
          ))}
        </div>
      </section>
    </>
  );
}

