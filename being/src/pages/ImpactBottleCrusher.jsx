import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function ImpactBottleCrusher() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const content = usePageContent('impact-bottle-crusher');

  const headingTag = content('impact-bottle-crusher-heading', 'tag') ?? 'ENVIRONMENTAL PROGRAM';
  const headingTitle = content('impact-bottle-crusher-heading', 'heading') ?? 'Bottle Crusher Initiative';
  const headingText =
    content('impact-bottle-crusher-heading', 'description') ??
    'Plastic pollution is one of the most pressing environmental challenges of our time. Through the Bottle Crusher Initiative, Being Sevak Charitable Trust provides bottle crushing machines that reduce plastic waste volume, promote recycling, and create livelihood opportunities for the underprivileged while contributing to a cleaner, greener future.';
  const mainImage = content('impact-bottle-crusher-heading', 'image') ?? '/images/g66.png';
  const cards =
    content('impact-bottle-crusher-cards', 'items') ?? [
      { title: 'Waste Reduction', description: 'Reducing plastic waste volume by up to 90% for easier recycling and disposal.' },
      { title: 'Livelihood Generation', description: 'Creating income opportunities for beneficiaries through plastic collection and recycling.' },
      { title: 'Environmental Impact', description: 'Contributing to cleaner surroundings and a healthier environment for communities.' },
      { title: 'Community Awareness', description: 'Educating communities about the importance of waste management and recycling.' },
    ];
  const storyTag = content('impact-bottle-crusher-impact', 'tag') ?? 'SUCCESS STORY';
  const storyTitle = content('impact-bottle-crusher-impact', 'heading') ?? 'Turning Waste into Opportunity';
  const storyText =
    content('impact-bottle-crusher-impact', 'text') ??
    'Plastic bottles that would otherwise pollute our streets and waterways are now being crushed, recycled, and converted into valuable resources. Through this initiative, beneficiaries have found a sustainable livelihood while contributing to environmental conservation, proving that social impact and environmental responsibility can go hand in hand.';
  const stats =
    content('impact-bottle-crusher-impact', 'stats') ?? [
      { value: '500+', label: 'Tons Recycled' },
      { value: '100+', label: 'Beneficiaries' },
      { value: '100%', label: 'Eco-Friendly' },
    ];
  const galleryTag = content('impact-bottle-crusher-gallery', 'tag') ?? 'PROJECT GALLERY';
  const galleryTitle = content('impact-bottle-crusher-gallery', 'heading') ?? 'Moments of Impact';
  const galleryText =
    content('impact-bottle-crusher-gallery', 'description') ??
    'Explore glimpses of our initiatives, community outreach programs, and the positive impact created through collective efforts.';
  const galleryImages =
    content('impact-bottle-crusher-gallery', 'images') ?? ['/images/g67.png', '/images/g68.png', '/images/g69.png'];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --navy: #03163E; --mid: #315371; --cyan: #00A2D9; --cyan-light: #33bce8; --green: #2eb85c; --gold: #D4AF37; --white: #ffffff; --light-bg: #f4f7fb; --text-dark: #1a1a2e; --text-mid: #4a5568; }
    body { font-family: 'Open Sans', sans-serif; color: var(--text-dark); overflow-x: hidden; }

    .crusher-section { background: #fff; padding: 100px 8%; overflow: hidden; }
    .crusher-container { max-width: 1300px; margin: auto; }
    .crusher-heading { text-align: center; max-width: 850px; margin: 0 auto 70px; }
    .crusher-tag { display: inline-block; padding: 10px 24px; background: rgba(0,163,218,.12); color: #00a3da; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
    .crusher-heading h2 { font-size: 52px; color: #111; margin-bottom: 20px; }
    .crusher-heading p { color: #666; line-height: 1.9; font-size: 17px; }
    .crusher-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .crusher-image { position: relative; }
    .crusher-image::before { content: ""; position: absolute; width: 200px; height: 200px; background: #00a3da; border-radius: 50%; top: -35px; left: -35px; opacity: .12; }
    .crusher-image img { width: 100%; border-radius: 25px; box-shadow: 0 15px 40px rgba(0,0,0,.12); position: relative; z-index: 2; }
    .crusher-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .crusher-card { background: #fff; border: 1px solid rgba(0,163,218,.15); padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,.05); transition: .4s; }
    .crusher-card:hover { background: #00a3da; transform: translateY(-8px); }
    .crusher-card h3 { font-size: 22px; margin-bottom: 12px; transition: .4s; }
    .crusher-card p { color: #666; line-height: 1.7; transition: .4s; }
    .crusher-card:hover h3, .crusher-card:hover p { color: #fff; }
    .crusher-impact { margin-top: 80px; background: linear-gradient(135deg,#00a3da,#008ec0); padding: 60px; border-radius: 30px; color: #fff; display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: center; }
    .crusher-story span { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
    .crusher-story h3 { font-size: 42px; margin: 15px 0; }
    .crusher-story p { line-height: 1.9; }
    .crusher-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }
    .crusher-box { background: rgba(255,255,255,.12); backdrop-filter: blur(10px); padding: 30px 15px; text-align: center; border-radius: 20px; }
    .crusher-box h2 { font-size: 40px; margin-bottom: 10px; }
    .crusher-box span { font-size: 14px; }

    @media(max-width:991px) {
      .crusher-grid { grid-template-columns: 1fr; }
      .crusher-content { grid-template-columns: 1fr; }
      .crusher-impact { grid-template-columns: 1fr; padding: 35px; }
      .crusher-stats { grid-template-columns: 1fr; }
      .crusher-heading h2 { font-size: 38px; }
      .crusher-story h3 { font-size: 30px; }
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

      <section className="crusher-section">
        <div className="crusher-container">
          <div className="crusher-heading">
            <span className="crusher-tag">{headingTag}</span>
            <h2>{headingTitle}</h2>
            <p>{headingText}</p>
          </div>

          <div className="crusher-grid">
            <div className="crusher-image">
              <img src={mainImage} alt="Bottle Crusher Initiative" loading="lazy" decoding="async" width="800" height="600" />
            </div>
            <div className="crusher-content">
              {cards.map((card, i) => (
                <div className="crusher-card" key={i}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="crusher-impact">
            <div className="crusher-story">
              <span>{storyTag}</span>
              <h3>{storyTitle}</h3>
              <p>{storyText}</p>
            </div>
            <div className="crusher-stats">
              {stats.map((s, i) => (
                <div className="crusher-box" key={i}>
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

