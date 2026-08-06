import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const MissionAurat = () => {
  const iframeRef = useRef(null);

  const content = usePageContent('mission-aurat');

  const taxTitle = content('mission-aurat-tax', 'title') ?? 'Mission Aurat';

  const heroTag = content('mission-aurat-hero', 'tag') ?? 'Women Empowerment Initiative';
  const heroLine1 = content('mission-aurat-hero', 'headingLine1') ?? 'Empowering';
  const heroHighlight = content('mission-aurat-hero', 'headingHighlight') ?? 'Women';
  const heroLine2 = content('mission-aurat-hero', 'headingLine2') ?? 'Creating Brighter Futures';
  const heroText =
    content('mission-aurat-hero', 'description') ??
    'Aurat is dedicated to uplifting women through education, skill development, healthcare awareness and self-reliance. Together we can build stronger families and empowered communities.';
  const heroImage = content('mission-aurat-hero', 'image') ?? '/images/aurat7.jpg';
  const heroStats =
    content('aurat-hero-stats', 'items') ?? [
      { value: '15K+', label: 'Women Supported' },
      { value: '120+', label: 'Awareness Drives' },
    ];

  const aboutTag = content('aurat-about', 'tag') ?? 'About Aurat';
  const aboutHeading = content('aurat-about', 'heading') ?? 'Supporting Women With Dignity & Opportunity';
  const aboutText =
    content('aurat-about', 'text') ??
    'Aurat focuses on helping women become independent and confident through education, awareness campaigns, vocational training and community support.';
  const aboutImage = content('aurat-about', 'image') ?? '/images/aurat6.jpg';
  const aboutItems =
    content('aurat-about', 'items') ?? [
      { title: 'Education', description: 'Encouraging girls and women towards learning opportunities.' },
      { title: 'Skill Training', description: 'Providing practical training to create sustainable livelihoods.' },
      { title: 'Health Support', description: 'Promoting healthcare awareness and hygiene initiatives.' },
      { title: 'Self Reliance', description: 'Helping women build confidence and financial independence.' },
    ];

  const missionTag = content('aurat-mission', 'tag') ?? 'Our Mission';
  const missionHeading = content('aurat-mission', 'heading') ?? 'Building Hope Through Empowerment';
  const missionCards =
    content('aurat-mission', 'items') ?? [
      { number: '01', title: 'Awareness Programs', description: 'Conducting campaigns to spread awareness about women\'s rights, health and education.' },
      { number: '02', title: 'Skill Development', description: 'Creating opportunities for women through practical training and workshops.' },
      { number: '03', title: 'Community Support', description: 'Building safe and supportive communities where women can grow confidently.' },
    ];

  const impactTag = content('aurat-impact', 'tag') ?? 'Our Impact';
  const impactHeading = content('aurat-impact', 'heading') ?? 'Creating Positive Change Every Day';
  const impactText =
    content('aurat-impact', 'text') ??
    'Through continuous outreach and empowerment initiatives, Aurat is helping women discover confidence, independence and hope.';
  const impactStats =
    content('aurat-impact', 'stats') ?? [
      { value: '500+', label: 'Training Sessions' },
      { value: '20+', label: 'Communities Reached' },
      { value: '10K+', label: 'Lives Impacted' },
    ];
  const impactImage = content('aurat-impact', 'image') ?? '/images/auratImpact.jpeg';

  const galleryTag = content('aurat-gallery', 'tag') ?? 'Program Highlights';
  const galleryHeading = content('aurat-gallery', 'heading') ?? 'Moments Of Empowerment';
  const galleryText =
    content('aurat-gallery', 'description') ??
    'Together we create opportunities, confidence and hope for women through impactful community initiatives.';
  const galleryImages =
    content('aurat-gallery', 'images') ?? [
      { src: '/images/aurat1.jpg', alt: 'Awareness Drive' },
      { src: '/images/aurat2.jpg', alt: 'Women Support' },
      { src: '/images/aurat3.jpg', alt: 'Skill Training' },
      { src: '/images/aurat4.jpg', alt: 'Community Care' },
    ];

  const donationTag = content('aurat-donation', 'tag') ?? 'Mission Aurat';
  const donationUrl = content('aurat-donation', 'donationUrl') ?? '/donations/donation-inline-aurat.html';
  const donationTitle = content('aurat-donation', 'title') ?? 'Empower Her, Empower Society';
  const donationText =
    content('aurat-donation', 'description') ??
    'Help women gain education, skills, healthcare, and opportunities to lead independent and dignified lives.';

  const testimonialHeading = content('aurat-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('aurat-testimonials', 'items') ?? [
      { quote: 'Being Sevak is doing incredible work for visually impaired and needy families. Proud to support this mission.', name: 'Riya Sharma' },
      { quote: 'Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity.', name: 'Rahul Mehta' },
      { quote: 'Every donation creates real change. Their food distribution drives truly touch lives.', name: 'Anjali Verma' },
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
        .mission-aurat * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-aurat { font-family: 'Montserrat', sans-serif; background: #fff; color: #1f2937; overflow-x: hidden; }
        .mission-aurat img { width: 100%; display: block; }

        .mission-aurat .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 10px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-aurat .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-aurat .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-aurat .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: auShine 6s linear infinite;
        }
        .mission-aurat .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes auShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-aurat .hero { width: 100%; padding: 7px 20px 40px; background: #fff; }
        .mission-aurat .hero-content { max-width: 1200px; margin: auto; min-height: 85vh; display: flex; align-items: center; justify-content: space-between; gap: 60px; }
        .mission-aurat .hero-left, .mission-aurat .hero-right { flex: 1; }
        .mission-aurat .mini-title { background: transparent; color: #00a3da; padding: 0; border-radius: 0; display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px; }
        .mission-aurat .hero-left h1 { font-size: 62px; line-height: 1.1; margin-bottom: 25px; font-weight: 800; }
        .mission-aurat .hero-left h1 span { color: #00a3da; }
        .mission-aurat .hero-left p { font-size: 18px; line-height: 1.9; color: #4b5563; margin-bottom: 35px; max-width: 600px; }
        .mission-aurat .hero-buttons { display: flex; gap: 18px; flex-wrap: wrap; }
        .mission-aurat .primary-btn, .mission-aurat .secondary-btn, .mission-aurat .donate-btn {
          text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: 700; transition: 0.3s; display: inline-block;
        }
        .mission-aurat .primary-btn, .mission-aurat .donate-btn { background: #00a3da; color: #fff; }
        .mission-aurat .secondary-btn { border: 2px solid #00a3da; color: #00a3da; }
        .mission-aurat .primary-btn:hover, .mission-aurat .secondary-btn:hover, .mission-aurat .donate-btn:hover { transform: translateY(-4px); }
        .mission-aurat .hero-right { display: flex; justify-content: center; }
        .mission-aurat .image-box { width: 100%; max-width: 500px; position: relative; }
        .mission-aurat .image-box img {
          height: 620px; object-fit: cover; border-radius: 40px; transition: 0.6s ease;
          transform: perspective(1000px) rotateY(-10deg); box-shadow: 0 30px 60px rgba(0,0,0,0.18);
          animation: auFloatImg 4s ease-in-out infinite;
        }
        .mission-aurat .image-box img:hover { transform: perspective(1000px) rotateY(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25); }
        @keyframes auFloatImg { 0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); } 50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); } 100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); } }
        .mission-aurat .floating-card { position: absolute; background: #fff; padding: 18px 22px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); animation: auFloat 3s ease-in-out infinite; z-index: 5; }
        .mission-aurat .floating-card h3 { color: #00a3da; font-size: 34px; margin-bottom: 5px; }
        .mission-aurat .floating-card p { color: #6b7280; font-size: 14px; font-weight: 600; }
        .mission-aurat .card1 { top: 30px; left: -30px; }
        .mission-aurat .card2 { bottom: 30px; right: -30px; }
        @keyframes auFloat { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }

        .mission-aurat .about-section {
          width: 100%; max-width: 1100px; margin: 20px auto; padding: 50px;
          background: #ffffff; border-radius: 35px; display: flex; align-items: center;
          justify-content: center; gap: 50px; box-shadow: 0 10px 35px rgba(0,0,0,0.05);
          position: relative; z-index: 1; overflow: hidden; isolation: isolate;
        }
        .mission-aurat .about-image { flex: 1; display: flex; justify-content: center; overflow: hidden; isolation: isolate; }
        .mission-aurat .about-image img { width: 100%; max-width: 420px; height: 500px; object-fit: cover; border-radius: 28px; transition: 0.4s; }
        .mission-aurat .about-image img:hover { transform: scale(1.03); }
        .mission-aurat .about-content { flex: 1; }
        .mission-aurat .about-content span {
          display: inline-block; background: #e8f9ff; color: #00a3da; padding: 8px 18px;
          border-radius: 50px; font-size: x-large; font-weight: 700; letter-spacing: 1px; margin-bottom: 18px;
        }
        .mission-aurat .about-content h2 { font-size: 42px; line-height: 1.2; color: #111827; margin-bottom: 18px; font-weight: 800; }
        .mission-aurat .about-content p { font-size: 15px; line-height: 1.9; color: #6b7280; margin-bottom: 30px; }
        .mission-aurat .about-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }
        .mission-aurat .about-box { background: #f8fbfd; padding: 22px; border-radius: 22px; transition: 0.3s; border: 1px solid #edf2f7; }
        .mission-aurat .about-box:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.05); }
        .mission-aurat .about-box h3 { font-size: 18px; color: #111827; margin-bottom: 8px; font-weight: 700; }
        .mission-aurat .about-box p { font-size: 13px; line-height: 1.7; color: #6b7280; margin: 0; }

        .mission-aurat .mission-section { width: 100%; padding: 40px 20px; background: #f8fbfd; text-align: center; }
        .mission-aurat .mission-section .impact-content { flex: none; max-width: 100%; margin: 0 auto 40px; text-align: center; }
        .mission-aurat .section-title { max-width: 800px; margin: auto; text-align: center; margin-bottom: 60px; }
        .mission-aurat .mission-cards { max-width: 1200px; margin: auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 30px; }
        .mission-aurat .mission-card { background: #fff; padding: 40px 30px; border-radius: 30px; transition: 0.3s; }
        .mission-aurat .mission-card:hover { transform: translateY(-10px); }
        .mission-aurat .icon { width: 70px; height: 70px; border-radius: 50%; background: #e0f7ff; color: #00a3da; display: flex; align-items: center; justify-content: center; font-weight: 800; margin-bottom: 25px; }
        .mission-aurat .mission-card h3 { margin-bottom: 15px; }
        .mission-aurat .mission-card p { color: #6b7280; line-height: 1.8; }
        .mission-aurat .mission-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 30px;
        }
        .mission-aurat .mission-card:hover::before { height: 100%; }
        .mission-aurat .mission-card h3, .mission-aurat .mission-card p, .mission-aurat .mission-card .icon { position: relative; z-index: 2; transition: 0.3s ease; }
        .mission-aurat .mission-card:hover h3, .mission-aurat .mission-card:hover p, .mission-aurat .mission-card:hover .icon { color: #fff; }

        .mission-aurat .impact-section { width: 100%; padding: 40px 7%; background: #f8fbfd; }
        .mission-aurat .impact-wrapper { width: 100%; max-width: 1400px; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 70px; }
        .mission-aurat .impact-content { flex: 1; max-width: 550px; }
        .mission-aurat .impact-content span {
          display: inline-block; background: #e8f9ff; color: #00a3da; padding: 8px 18px;
          border-radius: 50px; font-size: x-large; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px;
        }
        .mission-aurat .impact-content h2 { font-size: 50px; line-height: 1.2; color: #111827; margin-bottom: 20px; font-weight: 800; }
        .mission-aurat .impact-content p { font-size: 16px; line-height: 1.9; color: #6b7280; }
        .mission-aurat .impact-stats { display: flex; gap: 22px; margin-top: 35px; flex-wrap: wrap; }
        .mission-aurat .impact-stats div { background: #ffffff; padding: 22px 26px; border-radius: 22px; min-width: 150px; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.05); transition: 0.3s; }
        .mission-aurat .impact-stats div:hover { transform: translateY(-5px); }
        .mission-aurat .impact-stats h3 { font-size: 34px; color: #00a3da; margin-bottom: 8px; font-weight: 800; }
        .mission-aurat .impact-stats p { font-size: 14px; color: #6b7280; line-height: 1.5; }
        .mission-aurat .impact-image { flex: 1; display: flex; justify-content: center; }
        .mission-aurat .impact-image img { width: 100%; max-width: 560px; height: 600px; object-fit: cover; border-radius: 35px; box-shadow: 0 12px 35px rgba(0,0,0,0.08); }

        .mission-aurat .gallery-section { width: 100%; padding: 40px 20px; }
        .mission-aurat .gallery-title { max-width: 800px; margin: auto; text-align: center; margin-bottom: 60px; }
        .mission-aurat .gallery-title span { color: #00a3da; font-size: x-large; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .mission-aurat .gallery-title h2 { font-size: 48px; margin: 15px 0; font-weight: 800; }
        .mission-aurat .gallery-title p { color: #6b7280; line-height: 1.9; }
        .mission-aurat .gallery-grid { max-width: 1200px; margin: auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 25px; }
        .mission-aurat .gallery-card { overflow: hidden; border-radius: 30px; height: 420px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .mission-aurat .gallery-card img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .mission-aurat .gallery-card:hover img { transform: scale(1.12); }

        .mission-aurat .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-aurat .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; padding: 0; }
        .mission-aurat .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-aurat .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-aurat .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-aurat .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-aurat .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-aurat .sevak-btn:hover { transform: translateY(-2px); }

        .mission-aurat .testimonial-section { padding: 4px 4%; }
        .mission-aurat .section-header { text-align: center; margin-bottom: 60px; }
        .mission-aurat .section-header span { color: #00a3da; font-weight: 700; letter-spacing: 2px; }
        .mission-aurat .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-aurat .section-header p { color: #6b7d8f; }
        .mission-aurat .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .mission-aurat .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden;
          position: relative; z-index: 0; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;
        }
        .mission-aurat .testimonial-card:hover { transform: translateY(-10px); background: #00a3da; }
        .mission-aurat .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-aurat .testimonial-card h4 { color: #00a3da; }
        .mission-aurat .testimonial-card h4, .mission-aurat .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-aurat .testimonial-card:hover h4, .mission-aurat .testimonial-card:hover p { color: #fff !important; }
        .mission-aurat .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-aurat .testimonial-card:hover::before { height: 100%; }
        .mission-aurat .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-aurat .hero-content, .mission-aurat .about-section { flex-direction: column; text-align: center; }
          .mission-aurat .about-section { margin-top: 50px; clip-path: inset(0); }
          .mission-aurat #donate { margin-bottom: 30px; }
          .mission-aurat .hero-left, .mission-aurat .about-content { max-width: 100%; }
          .mission-aurat .hero-buttons { justify-content: center; }
          .mission-aurat .hero-left h1 { font-size: 48px; }
          .mission-aurat .mission-cards { grid-template-columns: 1fr; }
          .mission-aurat .about-grid { grid-template-columns: 1fr; }
          .mission-aurat .impact-wrapper { flex-direction: column; text-align: center; gap: 50px; }
          .mission-aurat .impact-content { max-width: 100%; }
          .mission-aurat .impact-content h2 { font-size: 40px; }
          .mission-aurat .impact-stats { justify-content: center; }
          .mission-aurat .impact-image img { max-width: 450px; height: 480px; }
          .mission-aurat .gallery-grid { grid-template-columns: repeat(2,1fr); gap: 16px; padding: 0 5%; }
          .mission-aurat .gallery-card { height: 250px; }
          .mission-aurat .card1 { left: 10px; }
          .mission-aurat .card2 { right: 10px; }
          .mission-aurat .about-content h2, .mission-aurat .gallery-title h2 { font-size: 34px; }
          .mission-aurat .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-aurat .sevak-title { font-size: 34px; }
          .mission-aurat .testimonial-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .mission-aurat .hero { padding: 40px 15px 30px; }
          .mission-aurat .hero-content { flex-direction: column; gap: 30px; min-height: auto; }
          .mission-aurat .hero-left h1, .mission-aurat .about-content h2, .mission-aurat .gallery-title h2, .mission-aurat .impact-content h2 { font-size: 28px; }
          .mission-aurat .hero-left p { font-size: 15px; }
          .mission-aurat .mini-title { font-size: 22px; }
          .mission-aurat .hero-buttons { flex-direction: column; align-items: center; }
          .mission-aurat .primary-btn, .mission-aurat .donate-btn { padding: 12px 22px; font-size: 15px; }
          .mission-aurat .hero-right { width: 100%; max-width: 360px; margin: 0 auto; }
          .mission-aurat .image-box { max-width: 100%; }
          .mission-aurat .image-box img { height: 220px; border-radius: 20px; transform: none; animation: none; }
          .mission-aurat .floating-card { padding: 6px 10px; border-radius: 8px; }
          .mission-aurat .floating-card h3 { font-size: 16px; }
          .mission-aurat .floating-card p { font-size: 11px; }
          .mission-aurat .card1 { top: 0; left: 0; border-radius: 0 0 12px 0; }
          .mission-aurat .card2 { bottom: 0; right: 0; border-radius: 12px 0 0 0; }
          .mission-aurat .about-section { width: 92%; margin: 60px auto; padding: 25px 18px; border-radius: 25px; }
          .mission-aurat .about-image img { max-width: 100%; height: 320px; border-radius: 22px; }
          .mission-aurat .about-content span { font-size: 11px; padding: 7px 15px; }
          .mission-aurat .about-content h2 { font-size: 28px; }
          .mission-aurat .about-content p { font-size: 14px; }
          .mission-aurat .about-grid { grid-template-columns: 1fr; }
          .mission-aurat .about-box { padding: 18px; border-radius: 18px; }
          .mission-aurat .impact-section { padding: 40px 15px; }
          .mission-aurat .impact-content h2 { font-size: 30px; }
          .mission-aurat .impact-content p { font-size: 14px; }
          .mission-aurat .impact-stats { flex-direction: row; align-items: center; }
          .mission-aurat .impact-stats div { width: 100%; max-width: 280px; }
          .mission-aurat .impact-image img { max-width: 100%; height: 330px; border-radius: 25px; }
          .mission-aurat .gallery-grid { grid-template-columns: 1fr; gap: 12px; }
          .mission-aurat .gallery-card { height: 220px; border-radius: 20px; }
          .mission-aurat .sevak-donation { padding: 40px 5%; }
          .mission-aurat .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-aurat .sevak-title { font-size: 24px; }
          .mission-aurat .sevak-desc { font-size: 14px; }
          .mission-aurat .sevak-btn { padding: 12px 28px; font-size: 14px; white-space: normal; }
          .mission-aurat .about-section { margin-top: 50px; }
          .mission-aurat #donate { margin-bottom: 30px; }
        }
        @media (max-width: 360px) {
          .mission-aurat .about-section { margin-top: 20px; }
          .mission-aurat #donate { margin-bottom: 40px; }
        }
      `}</style>

      <div className="mission-aurat">
        <section className="tax-box">
          <p><h1>{taxTitle}</h1></p>
        </section>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <span className="mini-title">{heroTag}</span>
              <h1>{heroLine1} <span>{heroHighlight}</span><br />{heroLine2}</h1>
              <p>{heroText}</p>
              <div className="hero-buttons">
                <a href="#donate" className="primary-btn">Support Mission</a>
              </div>
            </div>
            <div className="hero-right">
              <div className="image-box">
                <img src={heroImage} alt="Women Empowerment" />
                {heroStats.map((stat, i) => (
                  <div className={`floating-card card${i + 1}`} key={i}>
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div id="donate" style={{ width: '100%', background: '#f4f7fb', padding: '0', overflow: 'hidden', position: 'relative', zIndex: 10, isolation: 'isolate', marginBottom: '0' }}>
          <iframe
            ref={iframeRef}
            src={donationUrl}
            style={{ width: '100%', height: '650px', border: 'none', display: 'block' }}
            title="Donate to Mission Aurat"
          />
        </div>

        <section className="about-section" id="about">
          <div className="about-image">
            <img src={aboutImage} alt="Women" />
          </div>
          <div className="about-content">
            <span>{aboutTag}</span>
            <h2>{aboutHeading}</h2>
            <p>{aboutText}</p>
            <div className="about-grid">
              {aboutItems.map((item, i) => (
                <div className="about-box" key={i}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mission-section" id="mission">
          <div className="impact-content">
            <span>{missionTag}</span>
            <h2>{missionHeading}</h2>
          </div>
          <div className="mission-cards">
            {missionCards.map((card, i) => (
              <div className="mission-card" key={i}>
                <div className="icon">{card.number}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="impact-section" id="impact">
          <div className="impact-wrapper">
            <div className="impact-content">
              <span>{impactTag}</span>
              <h2>{impactHeading}</h2>
              <p>{impactText}</p>
              <div className="impact-stats">
                {impactStats.map((s, i) => (
                  <div key={i}>
                    <h3>{s.value}</h3>
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="impact-image">
              <img src={impactImage} alt="" />
            </div>
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="gallery-title">
            <span>{galleryTag}</span>
            <h2>{galleryHeading}</h2>
            <p>{galleryText}</p>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((g, i) => (
              <div className="gallery-card" key={i}><img src={g.src} alt={g.alt} /></div>
            ))}
          </div>
        </section>

        <section className="sevak-donation" id="donation-section">
          <div className="sevak-donation-content">
            <div className="sevak-left">
              <span className="sevak-tag">{donationTag}</span>
              <h2 className="sevak-title">{donationTitle}</h2>
              <p className="sevak-desc">{donationText}</p>
            </div>
            <div className="sevak-right">
              <a href="#" className="sevak-btn">Donate Now</a>
            </div>
          </div>
        </section>

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
};

export default MissionAurat;
