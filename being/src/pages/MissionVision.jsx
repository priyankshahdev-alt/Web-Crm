import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const MissionVision = () => {
  const content = usePageContent('mission-vision');

  const heroTitle = content('mv-hero', 'heading') ?? 'MISSION / VISION';
  const breadcrumb = content('mv-hero', 'breadcrumb') ?? 'Mission / Vision';

  const missionImage = content('mv-mission', 'image') ?? 'https://beingsevak.org/wp-content/uploads/2023/11/Untitled-design-2.png';
  const missionHeading = content('mv-mission', 'heading') ?? 'Mission';
  const missionText =
    content('mv-mission', 'text') ??
    'Empower and uplift the lives of visually impaired individuals and underprivileged children, ensuring their basic rights to education and livelihood. Through our different Mission & activities in the field of education, healthcare, and support programs, we aim to eliminate avoidable blindness, promote inclusivity, and enable all those we serve to lead lives of independence and dignity.';

  const valuesHeading = content('mv-values', 'heading') ?? 'VALUES';
  const values =
    content('mv-values', 'items') ?? [
      { icon: 'fa-scale-balanced', label: 'ACCOUNTABILITY' },
      { icon: 'fa-chalkboard-user', label: 'LEADERSHIP' },
      { icon: 'fa-eye', label: 'TRANSPARENCY' },
      { icon: 'fa-people-group', label: 'TEAM WORK' },
      { icon: 'fa-shapes', label: 'INNOVATION' },
    ];

  const visionImage = content('mv-vision', 'image') ?? 'https://beingsevak.org/wp-content/uploads/2023/11/Untitled-design-1-2.png';
  const visionHeading = content('mv-vision', 'heading') ?? 'Vision';
  const visionText =
    content('mv-vision', 'text') ??
    "The NGO's vision is to create a world where visually impaired, underprivileged children, and needy individuals have access to their basic rights of livelihood and education. This vision is rooted in the belief that every individual, regardless of their circumstances or disabilities, deserves the opportunity to live a life of independence and dignity.";

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light:#f4f7fb;--text:#333;--text-mid:#4a5568;--gold:#D4AF37}
        body{font-family:'Open Sans',sans-serif;color:var(--text);background:#f3f3f3}
        .hero-banner{position:relative;height:420px;background:linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url('https://beingsevak.org/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-16-at-5.59.54-PM.jpeg') center/cover no-repeat;display:flex;align-items:center;justify-content:center;text-align:center;color:white}
        .hero-content h1{font-family:'Montserrat',sans-serif;font-size:58px;font-weight:900;margin-bottom:15px;text-transform:uppercase}
        .breadcrumb{font-size:18px;font-weight:600}
        .breadcrumb span{color:var(--cyan)}
        .mv-section{padding:80px 20px;background:#f3f3f3}
        .mv-container{max-width:1300px;margin:auto;display:flex;justify-content:center;align-items:flex-start;gap:40px;flex-wrap:wrap}
        .mv-card{width:360px;background:#fff;padding:18px;box-shadow:0 3px 10px rgba(0,0,0,0.12);transition:0.3s;border-radius:6px}
        .mv-card:hover{transform:translateY(-5px)}
        .mv-card img{width:100%;height:auto;display:block;border-radius:4px}
        .mv-card h2{font-family:'Montserrat',sans-serif;font-size:36px;color:#1653a2;margin:22px 0 18px;text-align:center;font-weight:800}
        .mv-card p{font-size:17px;line-height:2;text-align:justify;color:#444}
        .values-box{width:280px;padding-top:90px}
        .values-box h2{color:#1653a2;font-size:42px;font-family:'Montserrat',sans-serif;font-weight:800;margin-bottom:40px}
        .value-item{display:flex;align-items:center;gap:18px;margin-bottom:28px;font-size:20px;font-weight:500;color:#333}
        .value-item i{color:#1653a2;font-size:28px;width:35px}
        @media(max-width:1100px){.mv-container{flex-direction:column;align-items:center}.values-box{padding-top:10px;width:360px}.values-box h2{text-align:center}}
        @media(max-width:768px){.hero-banner{height:320px}.hero-content h1{font-size:34px}.mv-card{width:100%;max-width:360px}.values-box{width:100%;max-width:360px}}
      `}</style>

      <section className="hero-banner">
        <div className="hero-content">
          <h1>{heroTitle}</h1>
          <div className="breadcrumb">Home <span>»</span> {breadcrumb}</div>
        </div>
      </section>

      <section className="mv-section">
        <div className="mv-container">
          <div className="mv-card">
            <img src={missionImage} alt={missionHeading}/>
            <h2>{missionHeading}</h2>
            <p>{missionText}</p>
          </div>
          <div className="values-box">
            <h2>{valuesHeading}</h2>
            {values.map((v, i) => (
              <div className="value-item" key={i}><i className={`fas ${v.icon}`}></i><span>{v.label}</span></div>
            ))}
          </div>
          <div className="mv-card">
            <img src={visionImage} alt={visionHeading}/>
            <h2>{visionHeading}</h2>
            <p>{visionText}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default MissionVision;
