import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function ImpactRozgaarBooth() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const content = usePageContent('impact-rozgaar-booth');

  const headingTag = content('impact-rozgaar-booth-heading', 'tag') ?? 'MISSION ATMANIRBHAR';
  const headingTitle = content('impact-rozgaar-booth-heading', 'heading') ?? 'Rozgaar Booth ';
  const headingText =
    content('impact-rozgaar-booth-heading', 'description') ??
    'Through the Rozgaar Booth Repairing initiative, Being Sevak Charitable Trust helps visually impaired and specially-abled individuals restore and renovate their livelihood booths. These booths serve as a primary source of income, enabling beneficiaries to run small businesses independently and live with dignity and self-reliance.';
  const mainImage = content('impact-rozgaar-booth-heading', 'image') ?? '/images/g15.webp';
  const cards =
    content('impact-rozgaar-booth-cards', 'items') ?? [
      { title: 'Livelihood Restoration', description: 'Repairing damaged booths helps beneficiaries restart their businesses and regain financial stability.' },
      { title: 'Economic Independence', description: 'A functional booth creates a sustainable source of income for visually impaired individuals and families.' },
      { title: 'Safe Work Environment', description: 'Renovated structures provide a secure and comfortable workplace for daily business operations.' },
      { title: 'Empowering Dreams', description: 'Every repaired booth becomes a symbol of hope, confidence, and self-sufficiency.' },
    ];
  const storyTag = content('impact-rozgaar-booth-impact', 'tag') ?? 'SUCCESS STORY';
  const storyTitle = content('impact-rozgaar-booth-impact', 'heading') ?? 'From Struggle to Sustainable Income';
  const storyText =
    content('impact-rozgaar-booth-impact', 'text') ??
    'Geeta Nazre, a visually impaired beneficiary, was allotted a telephone booth in poor condition. Since her family\'s livelihood depended on the booth, urgent repairs and replacement were essential. Through support from Being Sevak Charitable Trust, the booth was restored, helping her continue earning and supporting her family with dignity.';
  const stats =
    content('impact-rozgaar-booth-impact', 'stats') ?? [
      { value: '100+', label: 'Booths Supported' },
      { value: '500+', label: 'Lives Empowered' },
      { value: '100%', label: 'Livelihood Focused' },
    ];
  const galleryTag = content('impact-rozgaar-booth-gallery', 'tag') ?? 'PROJECT GALLERY';
  const galleryTitle = content('impact-rozgaar-booth-gallery', 'heading') ?? 'Moments of Impact';
  const galleryText =
    content('impact-rozgaar-booth-gallery', 'description') ??
    'Explore glimpses of our initiatives, community outreach programs, and the positive impact created through collective efforts.';
  const galleryImages =
    content('impact-rozgaar-booth-gallery', 'images') ?? ['/images/g11.webp', '/images/g12.webp', '/images/g14.webp'];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --navy: #03163E; --mid: #315371; --cyan: #00A2D9; --cyan-light: #33bce8; --green: #2eb85c; --gold: #D4AF37; --white: #ffffff; --light-bg: #f4f7fb; --text-dark: #1a1a2e; --text-mid: #4a5568; }
    body { font-family: 'Open Sans', sans-serif; color: var(--text-dark); overflow-x: hidden; }

    .rozgaar-booth-section { background: #fff; padding: 100px 8%; overflow: hidden; }
    .rozgaar-container { max-width: 1300px; margin: auto; }
    .rozgaar-heading { text-align: center; max-width: 850px; margin: 0 auto 70px; }
    .rozgaar-tag { display: inline-block; padding: 10px 24px; background: rgba(0,163,218,.12); color: #00a3da; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
    .rozgaar-heading h2 { font-size: 52px; color: #111; margin-bottom: 20px; }
    .rozgaar-heading p { color: #666; line-height: 1.9; font-size: 17px; }
    .rozgaar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .rozgaar-image { position: relative; }
    .rozgaar-image::before { content: ""; position: absolute; width: 180px; height: 180px; background: #00a3da; border-radius: 50%; top: -30px; left: -30px; opacity: .12; }
    .rozgaar-image img { width: 100%; border-radius: 25px; box-shadow: 0 15px 40px rgba(0,0,0,.12); position: relative; z-index: 2; }
    .rozgaar-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .rozgaar-card { background: #fff; border: 1px solid rgba(0,163,218,.15); padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,.05); transition: .4s; }
    .rozgaar-card:hover { background: #00a3da; transform: translateY(-8px); }
    .rozgaar-card h3 { margin-bottom: 12px; font-size: 22px; transition: .4s; }
    .rozgaar-card p { color: #666; line-height: 1.7; transition: .4s; }
    .rozgaar-card:hover h3, .rozgaar-card:hover p { color: #fff; }
    .rozgaar-impact { margin-top: 80px; background: linear-gradient(135deg,#00a3da,#008fbe); padding: 60px; border-radius: 30px; color: #fff; display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: center; }
    .impact-content span { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
    .impact-content h3 { font-size: 40px; margin: 15px 0; }
    .impact-content p { line-height: 1.9; }
    .impact-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }
    .impact-box { background: rgba(255,255,255,.12); backdrop-filter: blur(10px); padding: 30px 15px; text-align: center; border-radius: 20px; }
    .impact-box h2 { font-size: 38px; margin-bottom: 10px; }
    .impact-box span { font-size: 14px; }

    @media(max-width:991px) {
      .rozgaar-grid { grid-template-columns: 1fr; }
      .rozgaar-content { grid-template-columns: 1fr; }
      .rozgaar-impact { grid-template-columns: 1fr; padding: 35px; }
      .impact-stats { grid-template-columns: 1fr; }
      .rozgaar-heading h2 { font-size: 38px; }
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

      <section className="rozgaar-booth-section">
        <div className="rozgaar-container">
          <div className="rozgaar-heading">
            <span className="rozgaar-tag">{headingTag}</span>
            <h2>{headingTitle}</h2>
            <p>{headingText}</p>
          </div>

          <div className="rozgaar-grid">
            <div className="rozgaar-image">
              <img src={mainImage} alt="Rozgaar Booth Repairing" loading="lazy" decoding="async" width="800" height="600" />
            </div>
            <div className="rozgaar-content">
              {cards.map((card, i) => (
                <div className="rozgaar-card" key={i}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rozgaar-impact">
            <div className="impact-content">
              <span>{storyTag}</span>
              <h3>{storyTitle}</h3>
              <p>{storyText}</p>
            </div>
            <div className="impact-stats">
              {stats.map((s, i) => (
                <div className="impact-box" key={i}>
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

