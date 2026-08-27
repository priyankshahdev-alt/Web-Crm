import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function Donation2() {
  const content = usePageContent('donate');

  const heroTag = content('donate-hero', 'tag') ?? 'Support Our Mission';
  const heroHeadingLine1 = content('donate-hero', 'headingLine1') ?? 'Choose a Project,';
  const heroHeadingLine2 = content('donate-hero', 'headingLine2') ?? 'Make an Impact';
  const heroText =
    content('donate-hero', 'description') ??
    'Your generosity fuels life-changing programs across India. Select a project below and contribute to a brighter future.';
  const heroImage = content('donate-hero', 'image') ?? '/images/bs.png';
  const heroStats =
    content('donate-hero', 'stats') ?? [
      { value: '7+', label: 'Active Missions' },
      { value: '1000+', label: 'Lives Impacted' },
    ];
  const projectsTag = content('donate-projects', 'tag') ?? 'WHAT WE DO';
  const projectsHeading = content('donate-projects', 'heading') ?? 'Our Projects';
  const projectsText =
    content('donate-projects', 'description') ?? 'Click on a mission to learn more and donate directly.';
  const taxLead = content('donate-tax', 'lead') ?? 'Get';
  const taxHighlight1 = content('donate-tax', 'highlight1') ?? '50% Exemption';
  const taxMiddle = content('donate-tax', 'middle') ?? 'on your donation under';
  const taxHighlight2 = content('donate-tax', 'highlight2') ?? 'Section 80G of Income Tax Act 1961';

  const [activeTab, setActiveTab] = useState('tab-annapurna');

  useEffect(() => {
    const handleIframeMessage = (e) => {
      const frames = document.querySelectorAll('.donation-frame');
      frames.forEach(frame => {
        if (frame.contentWindow === e.source) {
          frame.style.height = e.data + 'px';
        }
      });
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  const tabs =
    content('donate-projects', 'items') ?? [
      { id: 'tab-annapurna', label: 'Mission Annapurna', icon: 'fa-utensils', title: 'Mission Annapurna', desc: 'Providing nutritious meals and dry ration kits to underprivileged children and visually impaired individuals across Mumbai.', src: '../donations/donation-inline.html' },
      { id: 'tab-vidya', label: 'Mission Vidya', icon: 'fa-graduation-cap', title: 'Mission Vidya', desc: 'Quality education support for underprivileged children, school dropouts, and visually impaired students through scholarships and supplies.', src: '../donations/donation-vidhya.html' },
      { id: 'tab-aurat', label: 'Mission Aurat', icon: 'fa-fist-raised', title: 'Mission Aurat', desc: 'Empowering women through education, skill development, legal awareness, health support, and self-help groups.', src: '../donations/donation-aurat.html' },
      { id: 'tab-bezubaan', label: 'Mission Bezubaan', icon: 'fa-paw', title: 'Mission Bezubaan', desc: 'Animal welfare initiatives including rescue, medical care, feeding programs, and shelter for stray and abandoned animals.', src: '../donations/donation-bezubaan.html' },
      { id: 'tab-atmanirbhar', label: 'Mission Atmanirbhar', icon: 'fa-hand-holding-heart', title: 'Mission Atmanirbhar', desc: 'Skill development and vocational training for visually impaired individuals, widows, and underprivileged youth to achieve self-reliance.', src: '../donations/donation-atmanirbhar.html' },
      { id: 'tab-arogya', label: 'Mission Arogya', icon: 'fa-heartbeat', title: 'Mission Arogya', desc: 'Healthcare initiatives including medical camps, eye check-ups, health awareness drives, and medicine distribution for the needy.', src: '../donations/donation-arogya.html' },
      { id: 'tab-eco', label: 'Mission Eco Warriors', icon: 'fa-leaf', title: 'Mission Eco Warriors', desc: 'Environmental conservation projects including tree plantation drives, beach clean-ups, recycling awareness, and sustainability education.', src: '../donations/donation-ecowarriors.html' },
      { id: 'tab-sevaknivas', label: 'Sevak Nivas', icon: 'fa-home', title: 'Sevak Nivas', desc: 'Providing shelter, care, skill development, and independent living opportunities for visually impaired students through 12 dedicated facilities.', src: '../donations/donation-sevaknivas.html' },
    ];

  useEffect(() => {
    // Meta Pixel
    if (!window.fbq) {
      const f = window.fbq = function() {
        f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = f;
      f.push = f;
      f.loaded = true;
      f.version = '2.0';
      f.queue = [];
      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(t);
    }
    window.fbq('init', '1466280918378719');
    window.fbq('track', 'PageView');
  }, []);

  return (
    <>
      <style>{`
        .donation-frame {
          width: 100%;
          min-height: 550px;
          border: none;
          display: block;
          border-radius: 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 0;
          position: relative;
          overflow: hidden;
          padding: 120px 8% 60px;
        }
        .hero-content { position: relative; z-index: 2; }
        .tag {
          background: transparent;
          color: #00a3da;
          padding: 0;
          border-radius: 0;
          display: inline-block;
          margin-bottom: 25px;
          font-weight: 800;
          font-size: 30px;
          letter-spacing: 1px;
        }
        .hero h1 { font-size: 52px; line-height: 1.1; margin-bottom: 25px; }
        .hero h1 span { color: #00a3da; }
        .hero p { font-size: 17px; line-height: 1.9; color: #66788a; margin-bottom: 35px; }
        .hero-buttons { display: flex; gap: 20px; }
        .hero-buttons .donate-btn {
          padding: 14px 26px;
          border-radius: 50px;
          text-decoration: none;
          color: #fff;
          background: #00a3da;
          box-shadow: 0 15px 30px rgba(0, 163, 218, 0.35);
          display: inline-block;
          transition: 0.3s;
          font-size: 16px;
          font-weight: 600;
        }
        .hero-buttons .donate-btn:hover { transform: translateY(-4px); }
        .hero-image { position: relative; z-index: 1; }
        .hero-image img {
          height: 350px;
          object-fit: contain;
          border-radius: 40px;
          transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
          transition: 0.6s ease;
          animation: floatImage 4s ease-in-out infinite;
          background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 20px;
        }
        .hero-image img:hover {
          transform: perspective(1000px) rotateY(0deg) scale(1.05);
          box-shadow: 0 40px 90px rgba(0, 0, 0, 0.25);
        }
        @keyframes floatImage {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
        }
        .hero-image::before {
          content: "";
          position: absolute;
          top: 20px; left: 20px;
          width: 100%; height: 100%;
          border-radius: 40px;
          background: linear-gradient(135deg, rgba(0, 163, 218, 0.25), transparent);
          z-index: -1;
          filter: blur(10px);
        }
        .floating-card {
          position: absolute;
          padding: 15px 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          animation: floatUpDown 3s ease-in-out infinite;
          z-index: 10;
        }
        .floating-card h3 { color: #00a3da; font-size: 34px; margin: 0; }
        .floating-card p { color: #66788a; margin: 0; font-size: 14px; }
        .card1 { top: 40px; left: -60px; }
        .card2 { bottom: 50px; right: -40px; }
        @keyframes floatUpDown {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .blur { position: absolute; border-radius: 50%; filter: blur(120px); }
        .blur1 { width: 350px; height: 350px; background: #00a3da33; top: 0; left: 0; }
        .blur2 { width: 350px; height: 350px; background: #3152702b; bottom: 0; right: 0; }
        .section-header { text-align: center; margin-bottom: 40px; }
        .section-header span { color: #00a3da; font-weight: 700; letter-spacing: 2px; font-size: 30px; }
        .section-header h2 { font-size: 42px; margin: 10px 0; color: #315270; }
        .section-header p { color: #6b7d8f; font-size: 16px; }
        .projects-section { padding: 40px 8% 60px; }
        .tabs-wrapper { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 30px; }
        .tab-link {
          padding: 12px 22px;
          border: none;
          background: #fff;
          color: #315270;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          border-radius: 50px;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          white-space: nowrap;
        }
        .tab-link:hover {
          background: #00a3da;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 163, 218, 0.3);
        }
        .tab-link.active {
          background: #00a3da;
          color: #fff;
          box-shadow: 0 8px 25px rgba(0, 163, 218, 0.35);
        }
        .tab-content {
          display: none;
          animation: fadeUp 0.5s ease;
        }
        .tab-content.active { display: block; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .project-card {
          background: #fff;
          padding: 35px;
          border-radius: 25px;
          text-align: center;
          max-width: 720px;
          margin: 0 auto 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          transition: 0.4s;
        }
        .project-card:hover { transform: translateY(-8px) rotateX(4deg); }
        .card-icon {
          width: 160px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00a3da, #315270);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          color: #fff;
          transition: 0.4s;
        }
        .project-card:hover .card-icon { transform: scale(1.1); }
        .project-card h3 { font-size: 24px; color: #315270; margin-bottom: 12px; }
        .project-card p { color: #6b7d8f; line-height: 1.8; font-size: 15px; max-width: 560px; margin: 0 auto; }
        .tax-box {
          width: 100%;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff;
          border-radius: 0;
          margin: 20px 0;
          padding: 10px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
          transition: 0.4s ease;
        }
        .tax-box::before {
          content: "";
          position: absolute;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%;
          animation: shine 6s linear infinite;
        }
        @keyframes shine {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .tax-box:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 25px 60px rgba(0, 163, 218, 0.35);
        }
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; min-height: auto; padding: 140px 8% 40px; text-align: center; }
          .hero h1 { font-size: 36px; }
          .hero-buttons { justify-content: center; }
          .hero-image { margin-top: 30px; }
          .hero-image img { height: 260px; }
          .card1 { top: 10px; left: 10px; }
          .card2 { bottom: 30px; right: 10px; }
          .floating-card h3 { font-size: 24px; }
          .floating-card p { font-size: 12px; }
          .section-header span { font-size: 22px; }
          .section-header h2 { font-size: 30px; }
          .tabs-wrapper { gap: 6px; }
          .tab-link { font-size: 12px; padding: 10px 16px; }
          .project-card { padding: 25px 20px; }
          .project-card h3 { font-size: 20px; }
          .tax-box p { font-size: 13px; }
          section { padding: 10px 5%; }
        }
        @media (max-width: 768px) {
          .card-icon { display: none; }
          .project-card { padding: 20px 18px; border-radius: 18px; }
          .project-card h3 { font-size: 18px; }
          .project-card p { font-size: 14px; line-height: 1.6; }
          .card-icon { width: 64px; height: 64px; font-size: 26px; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0, 163, 218, 0.3); }
          .tab-link { font-size: 11px; padding: 8px 14px; }
        }
        @media (max-width: 600px) {
          .tag { font-size: 22px; }
          .hero { padding: 120px 5% 30px; }
          .hero h1 { font-size: 30px; }
          .hero p { font-size: 15px; }
          .hero-image img { height: 200px; transform: perspective(1000px) rotateY(-5deg); padding: 12px; }
          .floating-card { padding: 10px 14px; }
          .floating-card h3 { font-size: 20px; }
          .floating-card p { font-size: 11px; }
          .section-header { margin-bottom: 24px; }
          .section-header span { font-size: 18px; }
          .section-header h2 { font-size: 24px; }
          .section-header p { font-size: 14px; }
          .tabs-wrapper { gap: 4px; }
          .tab-link { font-size: 10px; padding: 6px 10px; }
          .project-card { padding: 16px 14px; border-radius: 16px; }
          .project-card h3 { font-size: 16px; }
          .project-card p { font-size: 13px; line-height: 1.5; }
          .donation-frame { min-height: 480px; border-radius: 16px; }
          .tax-box { height: auto; padding: 14px 10px; }
          .tax-box p { font-size: 12px; }
        }
        @media (max-width: 480px) {
          .hero { padding: 100px 4% 24px; }
          .hero h1 { font-size: 24px; }
          .hero p { font-size: 14px; }
          .hero-image img { height: 160px; border-radius: 24px; padding: 10px; }
          .hero-image::before { display: none; }
          .card1 { top: 0; left: 0; padding: 8px 12px; }
          .card2 { bottom: 10px; right: 0; padding: 8px 12px; }
          .floating-card h3 { font-size: 16px; }
          .floating-card p { font-size: 10px; }
          .project-card { padding: 14px 12px; border-radius: 14px; }
          .project-card h3 { font-size: 15px; }
          .project-card p { font-size: 12px; }
          .donation-frame { min-height: 800px; border-radius: 14px; }
          .projects-section { padding: 30px 5% 40px; }
          .tax-box p { font-size: 11px; }
        }
      `}</style>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tag">{heroTag}</span>
          <h1>{heroHeadingLine1}<br/><span>{heroHeadingLine2}</span></h1>
          <p>{heroText}</p>
          <div className="hero-buttons">
            <a href="#projects" className="donate-btn">Explore Projects</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card1">
            <h3>{heroStats[0].value}</h3>
            <p>{heroStats[0].label}</p>
          </div>
          <div className="floating-card card2">
            <h3>{heroStats[1].value}</h3>
            <p>{heroStats[1].label}</p>
          </div>
          <img src={heroImage} alt="Being Sevak" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
        </div>
        <div className="blur blur1"></div>
        <div className="blur blur2"></div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-header">
          <span>{projectsTag}</span>
          <h2>{projectsHeading}</h2>
          <p>{projectsText}</p>
        </div>

        <div className="tabs-wrapper">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-link${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabs.map(tab => (
          <div key={tab.id} className={`tab-content${activeTab === tab.id ? ' active' : ''}`}>
            <div className="project-card">
              <div className="card-icon"><i className={`fas ${tab.icon}`}></i></div>
              <h3>{tab.title}</h3>
              <p>{tab.desc}</p>
            </div>
            <iframe src={tab.src} className="donation-frame" scrolling="no" title={tab.title}></iframe>
          </div>
        ))}
      </section>

      <section className="tax-box">
        <p>{taxLead} <b>{taxHighlight1}</b> {taxMiddle} <b>{taxHighlight2}</b></p>
      </section>
    </>
  );
}

