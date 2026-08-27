import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function ImpactBabyFeeding() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const content = usePageContent('impact-baby-feeding');

  const headingTag = content('baby-feeding-heading', 'tag') ?? 'NUTRITION & CARE PROGRAM';
  const headingTitle = content('baby-feeding-heading', 'heading') ?? 'Baby Feeding Kit Support';
  const headingText =
    content('baby-feeding-heading', 'description') ??
    'Proper nutrition is essential for every child\'s growth and development. Through our Baby Feeding Kit Support program, Being Sevak Charitable Trust provides essential feeding kits, infant nutrition supplies, and baby care essentials to underprivileged families. This initiative ensures that newborns and infants receive the care and nourishment they need for a healthy start in life.';
  const mainImage = content('baby-feeding-heading', 'image') ?? '/images/g1.jpeg';
  const cards =
    content('baby-feeding-cards', 'items') ?? [
      { title: 'Nutrition Essentials', description: 'Providing quality feeding bottles, formula, and nutrition supplies for infants.' },
      { title: 'Baby Care Kits', description: 'Complete feeding and hygiene kits to ensure proper care for newborns and infants.' },
      { title: 'Maternal Support', description: 'Helping new mothers with the resources they need to care for their babies properly.' },
      { title: 'Healthy Beginnings', description: 'Ensuring every child gets the nutritional foundation they need for healthy growth.' },
    ];
  const storyTag = content('baby-feeding-impact', 'tag') ?? 'SUCCESS STORY';
  const storyTitle = content('baby-feeding-impact', 'heading') ?? 'A Healthier Start for Every Child';
  const storyText =
    content('baby-feeding-impact', 'text') ??
    'For families struggling to make ends meet, providing proper nutrition for their newborns can be a challenge. Through the Baby Feeding Kit Support program, Being Sevak Charitable Trust ensures that infants from underprivileged families receive essential feeding supplies and nutrition, giving them a healthy and hopeful start to life.';
  const stats =
    content('baby-feeding-impact', 'stats') ?? [
      { value: '3000+', label: 'Kits Distributed' },
      { value: '100%', label: 'Quality Products' },
      { value: '1000+', label: 'Families Helped' },
    ];
  const galleryTag = content('baby-feeding-gallery', 'tag') ?? 'PROJECT GALLERY';
  const galleryTitle = content('baby-feeding-gallery', 'heading') ?? 'Moments of Impact';
  const galleryText =
    content('baby-feeding-gallery', 'description') ??
    'Explore glimpses of our initiatives, community outreach programs, and the positive impact created through collective efforts.';
  const galleryImages =
    content('baby-feeding-gallery', 'images') ?? ['/images/g2.webp', '/images/g3.webp', '/images/g4.webp'];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --navy: #03163E; --mid: #315371; --cyan: #00A2D9; --cyan-light: #33bce8; --green: #2eb85c; --gold: #D4AF37; --white: #ffffff; --light-bg: #f4f7fb; --text-dark: #1a1a2e; --text-mid: #4a5568; }
    body { font-family: 'Open Sans', sans-serif; color: var(--text-dark); overflow-x: hidden; }

    .baby-feeding-section { background: #fff; padding: 100px 8%; overflow: hidden; }
    .baby-container { max-width: 1300px; margin: auto; }
    .baby-heading { text-align: center; max-width: 850px; margin: 0 auto 70px; }
    .baby-tag { display: inline-block; padding: 10px 24px; background: rgba(0,163,218,.12); color: #00a3da; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
    .baby-heading h2 { font-size: 52px; color: #111; margin-bottom: 20px; }
    .baby-heading p { color: #666; line-height: 1.9; font-size: 17px; }
    .baby-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .baby-image { position: relative; }
    .baby-image::before { content: ""; position: absolute; width: 200px; height: 200px; background: #00a3da; border-radius: 50%; top: -35px; left: -35px; opacity: .12; }
    .baby-image img { width: 100%; border-radius: 25px; box-shadow: 0 15px 40px rgba(0,0,0,.12); position: relative; z-index: 2; }
    .baby-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .baby-card { background: #fff; border: 1px solid rgba(0,163,218,.15); padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,.05); transition: .4s; }
    .baby-card:hover { background: #00a3da; transform: translateY(-8px); }
    .baby-card h3 { font-size: 22px; margin-bottom: 12px; transition: .4s; }
    .baby-card p { color: #666; line-height: 1.7; transition: .4s; }
    .baby-card:hover h3, .baby-card:hover p { color: #fff; }
    .baby-impact { margin-top: 80px; background: linear-gradient(135deg,#00a3da,#008ec0); padding: 60px; border-radius: 30px; color: #fff; display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: center; }
    .baby-story span { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
    .baby-story h3 { font-size: 42px; margin: 15px 0; }
    .baby-story p { line-height: 1.9; }
    .baby-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }
    .baby-box { background: rgba(255,255,255,.12); backdrop-filter: blur(10px); padding: 30px 15px; text-align: center; border-radius: 20px; }
    .baby-box h2 { font-size: 40px; margin-bottom: 10px; }
    .baby-box span { font-size: 14px; }

    @media(max-width:991px) {
      .baby-grid { grid-template-columns: 1fr; }
      .baby-content { grid-template-columns: 1fr; }
      .baby-impact { grid-template-columns: 1fr; padding: 35px; }
      .baby-stats { grid-template-columns: 1fr; }
      .baby-heading h2 { font-size: 38px; }
      .baby-story h3 { font-size: 30px; }
    }

    .shital-gallery-section { padding: 90px 8%; background: #fff; }
    .shital-gallery-heading { text-align: center; max-width: 800px; margin: 0 auto 50px; }
    .shital-gallery-heading span { display: inline-block; padding: 10px 24px; background: rgba(0,163,218,.12); color: #00a3da; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 18px; }
    .shital-gallery-heading h2 { font-size: 48px; color: #111; margin-bottom: 15px; }
    .shital-gallery-heading p { color: #666; font-size: 17px; line-height: 1.8; }
    .shital-gallery { display: grid; grid-template-columns: repeat(3,1fr); gap: 25px; }
    .shital-gallery-item { overflow: hidden; border-radius: 25px; box-shadow: 0 15px 35px rgba(0,0,0,.08); position: relative; }
    .shital-gallery-item img { width: 100%; height: auto; display: block; transition: 0.6s ease; }
    .shital-gallery-item:hover img { transform: scale(1.08); }
    .shital-gallery-item::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.15), transparent); opacity: 0; transition: .4s; }
    .shital-gallery-item:hover::after { opacity: 1; }
    @media(max-width:991px) { .shital-gallery { grid-template-columns: 1fr; } .shital-gallery-heading h2 { font-size: 38px; } }
  `;

  return (
    <>
      <style>{css}</style>

      <section className="baby-feeding-section">
        <div className="baby-container">
          <div className="baby-heading">
            <span className="baby-tag">{headingTag}</span>
            <h2>{headingTitle}</h2>
            <p>{headingText}</p>
          </div>

          <div className="baby-grid">
            <div className="baby-image">
              <img src={mainImage} alt="Baby Feeding Kit Support" loading="lazy" decoding="async" width="800" height="600" />
            </div>
            <div className="baby-content">
              {cards.map((card, i) => (
                <div className="baby-card" key={i}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="baby-impact">
            <div className="baby-story">
              <span>{storyTag}</span>
              <h3>{storyTitle}</h3>
              <p>{storyText}</p>
            </div>
            <div className="baby-stats">
              {stats.map((s, i) => (
                <div className="baby-box" key={i}>
                  <h2>{s.value}</h2>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
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

