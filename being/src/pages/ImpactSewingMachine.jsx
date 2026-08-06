import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function ImpactSewingMachine() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = usePageContent('impact-sewing-machine');

  const headingTag = content('impact-sewing-machine-heading', 'tag') ?? 'WOMEN EMPOWERMENT PROGRAM';
  const headingTitle = content('impact-sewing-machine-heading', 'heading') ?? 'Sewing Machine ';
  const headingText =
    content('impact-sewing-machine-heading', 'description') ??
    'A sewing machine is more than a tool — it is a pathway to dignity, financial independence, and a brighter future. Through this initiative, Being Sevak Charitable Trust provides sewing machines to visually impaired and economically challenged families, helping them create sustainable livelihoods and support their households with confidence.';
  const mainImage = content('impact-sewing-machine-heading', 'image') ?? '/images/g94.webp';
  const cards =
    content('impact-sewing-machine-cards', 'items') ?? [
      { title: 'Income Generation', description: 'Enables beneficiaries and their family members to earn a stable livelihood through tailoring and stitching work.' },
      { title: 'Women Empowerment', description: 'Creates opportunities for women to work from home and become financially independent.' },
      { title: 'Skill Utilization', description: 'Supports skilled individuals by providing the tools needed to transform talent into income.' },
      { title: 'Family Support', description: 'Strengthens household income and improves the quality of life for entire families.' },
    ];
  const storyTag = content('impact-sewing-machine-impact', 'tag') ?? 'IMPACT STORY';
  const storyTitle = content('impact-sewing-machine-impact', 'heading') ?? 'Transforming Lives Through Opportunity';
  const storyText =
    content('impact-sewing-machine-impact', 'text') ??
    'Arvind Vyas, a visually impaired member facing financial challenges, received a sewing machine through Being Sevak Charitable Trust. This support empowered his wife to start tailoring work and contribute towards the family\'s income. What seemed like a simple machine became a symbol of hope, resilience, and self-reliance for their family.';
  const stats =
    content('impact-sewing-machine-impact', 'stats') ?? [
      { value: '100+', label: 'Families Supported' },
      { value: '100%', label: 'Livelihood Focused' },
      { value: '24/7', label: 'Income Opportunity' },
    ];
  const galleryTag = content('impact-sewing-machine-gallery', 'tag') ?? 'PROJECT GALLERY';
  const galleryTitle = content('impact-sewing-machine-gallery', 'heading') ?? 'Moments of Impact';
  const galleryText =
    content('impact-sewing-machine-gallery', 'description') ??
    'Explore glimpses of our initiatives, community outreach programs, and the positive impact created through collective efforts.';
  const galleryImages =
    content('impact-sewing-machine-gallery', 'images') ?? ['/images/g91.webp', '/images/g92.webp', '/images/g93.webp'];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --navy: #03163E; --mid: #315371; --cyan: #00A2D9; --cyan-light: #33bce8;
      --green: #2eb85c; --gold: #D4AF37; --white: #ffffff; --light-bg: #f4f7fb;
      --text-dark: #1a1a2e; --text-mid: #4a5568;
    }
    body { font-family: 'Open Sans', sans-serif; color: var(--text-dark); overflow-x: hidden; }

    .sewing-success-section { background: #fff; padding: 100px 8%; overflow: hidden; }
    .sewing-container { max-width: 1300px; margin: auto; }
    .sewing-heading { text-align: center; max-width: 850px; margin: auto; margin-bottom: 70px; }
    .sewing-tag { display: inline-block; padding: 10px 25px; background: rgba(0,163,218,.12); color: #00a3da; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
    .sewing-heading h2 { font-size: 52px; color: #111; margin-bottom: 20px; }
    .sewing-heading p { color: #666; line-height: 1.9; font-size: 17px; }
    .sewing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px; }
    .sewing-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .sewing-card { background: #fff; border: 1px solid rgba(0,163,218,.15); padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,.05); transition: .4s; }
    .sewing-card:hover { background: #00a3da; transform: translateY(-8px); }
    .sewing-card h3 { font-size: 22px; margin-bottom: 12px; transition: .4s; }
    .sewing-card p { color: #666; line-height: 1.7; transition: .4s; }
    .sewing-card:hover h3, .sewing-card:hover p { color: #fff; }
    .sewing-image { position: relative; }
    .sewing-image::after { content: ""; position: absolute; width: 200px; height: 200px; background: #00a3da; border-radius: 50%; right: -30px; top: -30px; opacity: .12; }
    .sewing-image img { width: 100%; border-radius: 25px; position: relative; z-index: 2; box-shadow: 0 15px 40px rgba(0,0,0,.12); }
    .impact-story { background: linear-gradient(135deg,#00a3da,#0093c5); padding: 60px; border-radius: 30px; color: #fff; display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: center; }
    .story-left span { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
    .story-left h3 { font-size: 42px; margin: 15px 0; }
    .story-left p { line-height: 1.9; opacity: .95; }
    .story-right { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }
    .impact-box { background: rgba(255,255,255,.12); backdrop-filter: blur(10px); text-align: center; padding: 30px 15px; border-radius: 20px; }
    .impact-box h2 { font-size: 40px; margin-bottom: 10px; }
    .impact-box span { font-size: 15px; }

    @media(max-width:991px) {
      .sewing-grid { grid-template-columns: 1fr; }
      .sewing-content { grid-template-columns: 1fr; }
      .impact-story { grid-template-columns: 1fr; padding: 35px; }
      .story-right { grid-template-columns: 1fr; }
      .sewing-heading h2 { font-size: 38px; }
      .story-left h3 { font-size: 32px; }
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

      <section className="sewing-success-section">
        <div className="sewing-container">
          <div className="sewing-heading">
            <span className="sewing-tag">{headingTag}</span>
            <h2>{headingTitle}</h2>
            <p>{headingText}</p>
          </div>

          <div className="sewing-grid">
            <div className="sewing-content">
              {cards.map((card, i) => (
                <div className="sewing-card" key={i}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
            <div className="sewing-image">
              <img src={mainImage} alt="" />
            </div>
          </div>

          <div className="impact-story">
            <div className="story-left">
              <span>{storyTag}</span>
              <h3>{storyTitle}</h3>
              <p>{storyText}</p>
            </div>
            <div className="story-right">
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
            <div className="shital-gallery-item" key={i}><img src={src} alt="" /></div>
          ))}
        </div>
      </section>
    </>
  );
}
