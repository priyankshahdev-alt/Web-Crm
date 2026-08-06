import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function ImpactEmergencyMedical() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const content = usePageContent('impact-emergency-medical');

  const headingTag = content('impact-emergency-medical-heading', 'tag') ?? 'HEALTHCARE SUPPORT PROGRAM';
  const headingTitle = content('impact-emergency-medical-heading', 'heading') ?? 'Emergency Medical Support';
  const headingText =
    content('impact-emergency-medical-heading', 'description') ??
    'Medical emergencies can strike any family without warning. Through our Emergency Medical Support initiative, Being Sevak Charitable Trust provides timely financial assistance, treatment support, medicines, hospitalization aid, and life-saving care to underprivileged patients facing critical health conditions. Our mission is to ensure that no life is lost due to lack of medical resources or financial constraints.';
  const mainImage = content('impact-emergency-medical-heading', 'image') ?? '/images/g54.webp';
  const cards =
    content('impact-emergency-medical-cards', 'items') ?? [
      { title: 'Critical Care Assistance', description: 'Providing urgent medical aid for life-threatening illnesses, surgeries, and emergency treatments.' },
      { title: 'Hospitalization Support', description: 'Helping financially challenged families access quality healthcare and hospitalization facilities.' },
      { title: 'Medicines & Treatment', description: 'Supporting patients with essential medicines, diagnostics, and specialized medical care.' },
      { title: 'Saving Precious Lives', description: 'Every contribution helps a patient receive timely treatment and a second chance at life.' },
    ];
  const storyTag = content('impact-emergency-medical-impact', 'tag') ?? 'IMPACT STORY';
  const storyTitle = content('impact-emergency-medical-impact', 'heading') ?? 'Hope During a Medical Emergency';
  const storyText =
    content('impact-emergency-medical-impact', 'text') ??
    'Master Imad Shaikh, an 8-month-old child suffering from congenital heart disease, came from Uttar Pradesh with his family seeking urgent medical assistance. His father worked as a labourer and his mother was a housewife. Through the support of Being Sevak Charitable Trust, he received emergency medical help and hospitalization support during a critical stage of treatment.';
  const stats =
    content('impact-emergency-medical-impact', 'stats') ?? [
      { value: '2400+', label: 'Medical Relief Cases' },
      { value: '24/7', label: 'Emergency Response' },
      { value: '100%', label: 'Life Saving Focus' },
    ];
  const galleryTag = content('impact-emergency-medical-gallery', 'tag') ?? 'PROJECT GALLERY';
  const galleryTitle = content('impact-emergency-medical-gallery', 'heading') ?? 'Moments of Impact';
  const galleryText =
    content('impact-emergency-medical-gallery', 'description') ??
    'Explore glimpses of our initiatives, community outreach programs, and the positive impact created through collective efforts.';
  const galleryImages =
    content('impact-emergency-medical-gallery', 'images') ?? ['/images/g51.webp', '/images/g52.webp', '/images/g53.webp'];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --navy: #03163E; --mid: #315371; --cyan: #00A2D9; --cyan-light: #33bce8; --green: #2eb85c; --gold: #D4AF37; --white: #ffffff; --light-bg: #f4f7fb; --text-dark: #1a1a2e; --text-mid: #4a5568; }
    body { font-family: 'Open Sans', sans-serif; color: var(--text-dark); overflow-x: hidden; }

    .medical-support-section { background: #fff; padding: 100px 8%; overflow: hidden; }
    .medical-container { max-width: 1300px; margin: auto; }
    .medical-heading { text-align: center; max-width: 850px; margin: 0 auto 70px; }
    .medical-tag { display: inline-block; padding: 10px 24px; background: rgba(0,163,218,.12); color: #00a3da; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
    .medical-heading h2 { font-size: 52px; color: #111; margin-bottom: 20px; }
    .medical-heading p { color: #666; line-height: 1.9; font-size: 17px; }
    .medical-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .medical-image { position: relative; }
    .medical-image::before { content: ""; position: absolute; width: 200px; height: 200px; background: #00a3da; border-radius: 50%; top: -35px; left: -35px; opacity: .12; }
    .medical-image img { width: 100%; border-radius: 25px; box-shadow: 0 15px 40px rgba(0,0,0,.12); position: relative; z-index: 2; }
    .medical-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .medical-card { background: #fff; border: 1px solid rgba(0,163,218,.15); padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,.05); transition: .4s; }
    .medical-card:hover { background: #00a3da; transform: translateY(-8px); }
    .medical-card h3 { font-size: 22px; margin-bottom: 12px; transition: .4s; }
    .medical-card p { color: #666; line-height: 1.7; transition: .4s; }
    .medical-card:hover h3, .medical-card:hover p { color: #fff; }
    .medical-impact { margin-top: 80px; background: linear-gradient(135deg,#00a3da,#008ec0); padding: 60px; border-radius: 30px; color: #fff; display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: center; }
    .medical-story span { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
    .medical-story h3 { font-size: 42px; margin: 15px 0; }
    .medical-story p { line-height: 1.9; }
    .medical-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }
    .medical-box { background: rgba(255,255,255,.12); backdrop-filter: blur(10px); padding: 30px 15px; text-align: center; border-radius: 20px; }
    .medical-box h2 { font-size: 40px; margin-bottom: 10px; }
    .medical-box span { font-size: 14px; }

    @media(max-width:991px) {
      .medical-grid { grid-template-columns: 1fr; }
      .medical-content { grid-template-columns: 1fr; }
      .medical-impact { grid-template-columns: 1fr; padding: 35px; }
      .medical-stats { grid-template-columns: 1fr; }
      .medical-heading h2 { font-size: 38px; }
      .medical-story h3 { font-size: 30px; }
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

      <section className="medical-support-section">
        <div className="medical-container">
          <div className="medical-heading">
            <span className="medical-tag">{headingTag}</span>
            <h2>{headingTitle}</h2>
            <p>{headingText}</p>
          </div>

          <div className="medical-grid">
            <div className="medical-image">
              <img src={mainImage} alt="Emergency Medical Support" />
            </div>
            <div className="medical-content">
              {cards.map((card, i) => (
                <div className="medical-card" key={i}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="medical-impact">
            <div className="medical-story">
              <span>{storyTag}</span>
              <h3>{storyTitle}</h3>
              <p>{storyText}</p>
            </div>
            <div className="medical-stats">
              {stats.map((s, i) => (
                <div className="medical-box" key={i}>
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
