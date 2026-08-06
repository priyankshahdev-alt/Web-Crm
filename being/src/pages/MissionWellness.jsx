import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

export default function MissionWellness() {
  const iframeRef = useRef(null);

  const content = usePageContent('mission-wellness');

  const taxTitle = content('mission-wellness-tax', 'title') ?? 'Mission Aarogya';

  const heroTag = content('mission-wellness-hero', 'tag') ?? 'Mission Aarogya';
  const heroLine1 = content('mission-wellness-hero', 'headingLine1') ?? 'Bringing';
  const heroHighlight = content('mission-wellness-hero', 'headingHighlight') ?? 'Health';
  const heroLine2 = content('mission-wellness-hero', 'headingLine2') ?? 'Into Every Life';
  const heroText =
    content('mission-wellness-hero', 'description') ??
    'Mission Aarogya by Being Sevak Charitable Trust provides healthcare support, medical assistance, emergency aid and wellness initiatives for underprivileged communities across India.';
  const heroImage = content('mission-wellness-hero', 'image') ?? '/images/arogya1.png';
  const heroStats =
    content('wellness-hero-stats', 'items') ?? [
      { value: '3000+', label: 'Lives Supported' },
      { value: '24/7', label: 'Care Support' },
    ];

  const aboutTag = content('wellness-about', 'tag') ?? 'About Mission';
  const aboutLine1 = content('wellness-about', 'headingLine1') ?? 'Helping Patients With';
  const aboutHighlight = content('wellness-about', 'headingHighlight') ?? 'Care & Emergency Support';
  const aboutText =
    content('wellness-about', 'text') ??
    'Our mission supports heart patients, children and old age people by helping them during medical emergencies, hospital treatments and critical healthcare situations with compassion and care.';
  const aboutItems =
    content('wellness-about', 'items') ?? [
      { title: 'Heart Patient Help', description: 'Supporting heart patients with emergency medical assistance.' },
      { title: 'Child Healthcare', description: 'Helping small children receive proper hospital treatment.' },
      { title: 'Old Age Support', description: 'Providing healthcare help for elderly people in need.' },
      { title: 'Hospital Assistance', description: 'Helping needy families with treatment and hospital support.' },
    ];
  const aboutImage = content('wellness-about', 'image') ?? '/images/arogya2.png';

  const supportTag = content('wellness-support', 'tag') ?? 'Our Support';
  const supportHeading = content('wellness-support', 'heading') ?? 'How We Help Schools & Colleges';
  const supportCards =
    content('wellness-support', 'cards') ?? [
      { icon: '01', title: 'Washroom Renovation', description: 'We renovate old school and college toilets to provide students with clean, safe and hygienic washroom facilities.' },
      { icon: '02', title: 'Clean Water Filters', description: 'Installing clean drinking water filters to ensure healthy and safe water access for students and staff members.' },
      { icon: '03', title: 'Kitchen & Wash Basin Support', description: 'We help schools by building new kitchens, wash basins and hygiene areas for better cleanliness and student wellbeing.' },
    ];
  const projectImages =
    content('wellness-support', 'images') ?? [
      { src: '/images/arogya4.png', alt: '' },
      { src: '/images/arogya3.png', alt: '' },
      { src: '/images/arogya5.png', alt: '' },
    ];

  const babyTag = content('wellness-baby-care', 'tag') ?? 'Baby Care Center';
  const babyHeading = content('wellness-baby-care', 'heading') ?? 'Safe Feeding Spaces For Mothers & Babies';
  const babyText =
    content('wellness-baby-care', 'text') ??
    'Our Baby Care Center initiative creates safe and comfortable feeding spaces where mothers can feed and care for their babies peacefully in public places with privacy, hygiene and proper support.';
  const babyItems =
    content('wellness-baby-care', 'items') ?? [
      { title: 'Baby Feeding Rooms', description: 'Providing clean and safe feeding areas for mothers and babies.' },
      { title: 'Mother Support', description: 'Helping mothers with comfortable care facilities in public places.' },
      { title: 'Hygienic Environment', description: 'Maintaining cleanliness and safety for newborn baby care.' },
      { title: 'Public Care Centers', description: 'Setting up baby care centers at different public locations.' },
    ];
  const babyImage = content('wellness-baby-care', 'image') ?? '/images/g1.jpeg';

  const galleryTag = content('wellness-gallery', 'tag') ?? 'Gallery';
  const galleryHeading = content('wellness-gallery', 'heading') ?? 'Moments Of Support & Care';
  const galleryImages =
    content('wellness-gallery', 'images') ?? [
      { src: '/images/vision4.jpg', alt: 'Gallery', big: true },
      { src: '/images/vision5.jpeg', alt: 'Gallery', big: false },
      { src: '/images/vision6.jpeg', alt: 'Gallery', big: false },
      { src: '/images/vision7.jpeg', alt: 'Gallery', big: false },
    ];

  const donationTag = content('wellness-donation', 'tag') ?? 'Mission Aarogya';
  const donationUrl = content('wellness-donation', 'donationUrl') ?? '/donations/donation-inline-arogya.html';
  const donationTitle = content('wellness-donation', 'title') ?? 'Health is the True Wealth';
  const donationText =
    content('wellness-donation', 'description') ??
    'Your donation provides healthcare, medical support and wellness services to underprivileged communities across India.';

  const testimonialHeading = content('wellness-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('wellness-testimonials', 'items') ?? [
      { quote: 'Being Sevak is doing incredible work for healthcare and needy families. Proud to support this mission.', name: 'Riya Sharma' },
      { quote: 'Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity.', name: 'Rahul Mehta' },
      { quote: 'Every donation creates real change. Their healthcare initiatives truly touch lives.', name: 'Anjali Verma' },
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
        .mission-wellness * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-wellness { font-family: 'Poppins', sans-serif; background: #f4f6f8; color: #315270; overflow-x: hidden; }
        .mission-wellness img { width: 100%; display: block; }
        .mission-wellness section { overflow: hidden; }

        .mission-wellness .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 20px 0; padding: 10px; border-radius: 0;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15); position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-wellness .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-wellness .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-wellness .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: mwShine 6s linear infinite;
        }
        .mission-wellness .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes mwShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-wellness .hero-section { width: 100%; padding: 10px 5%; }
        .mission-wellness .hero-content {
          max-width: 1200px; margin: auto;
          display: flex; align-items: center; justify-content: space-between; gap: 60px;
        }
        .mission-wellness .hero-left { flex: 1; max-width: 520px; }
        .mission-wellness .mini-title {
          background: transparent; color: #00a3da; padding: 0; border-radius: 0;
          display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px;
        }
        .mission-wellness .hero-left h1 { font-size: 62px; line-height: 1.1; font-weight: 800; color: #1c2b36; margin-bottom: 25px; }
        .mission-wellness .hero-left h1 span { color: #00a3da; }
        .mission-wellness .hero-left p { font-size: 18px; line-height: 1.9; color: #66788a; margin-bottom: 35px; }
        .mission-wellness .hero-buttons { display: flex; gap: 20px; flex-wrap: wrap; }
        .mission-wellness .primary-btn {
          text-decoration: none; padding: 16px 34px; border-radius: 50px; font-size: 18px; font-weight: 600;
          transition: 0.3s; display: inline-block; background: #00a3da; color: #fff;
          box-shadow: 0 15px 35px rgba(0,163,218,0.35);
        }
        .mission-wellness .primary-btn:hover { transform: translateY(-4px); }
        .mission-wellness .hero-right { flex: 1; max-width: 50%; display: flex; justify-content: flex-end; }
        .mission-wellness .image-box {
          width: 100%; max-width: 560px; margin: auto; position: relative;
        }
        .mission-wellness .image-box img {
          width: 100%; height: 480px; object-fit: cover; border-radius: 40px;
          transition: 0.6s ease; transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.18); animation: mwFloatImage 4s ease-in-out infinite;
        }
        .mission-wellness .image-box:hover img {
          transform: perspective(1000px) rotateY(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25);
        }
        @keyframes mwFloatImage {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
        }
        .mission-wellness .floating-card {
          position: absolute; background: #fff; padding: 20px 24px; border-radius: 22px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08); z-index: 5; animation: mwFloat 3s ease-in-out infinite;
        }
        .mission-wellness .floating-card h3 { color: #00a3da; font-size: 34px; margin-bottom: 5px; }
        .mission-wellness .floating-card p { font-size: 14px; color: #6b7280; }
        .mission-wellness .card1 { top: 35px; left: -35px; }
        .mission-wellness .card2 { bottom: 35px; right: -35px; }
        @keyframes mwFloat { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }

        .mission-wellness .about-section { width: 100%; padding: 60px 7%; display: flex; align-items: center; justify-content: space-between; gap: 70px; position: relative; z-index: 1; overflow: hidden; isolation: isolate; }
        .mission-wellness .about-image, .mission-wellness .about-content { flex: 1; }
        .mission-wellness .about-image { position: relative; overflow: hidden; isolation: isolate; }
        .mission-wellness .about-image img { width: 100%; height: 450px; object-fit: cover; border-radius: 35px; transition: 0.5s; box-shadow: 0 18px 45px rgba(0,0,0,0.08); }
        .mission-wellness .about-image:hover img { transform: scale(1.04) rotate(-1deg); }
        .mission-wellness .about-content span { color: #00a3da; font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 15px; }
        .mission-wellness .about-content h2 { font-size: 52px; line-height: 1.15; margin-bottom: 20px; font-weight: 800; }
        .mission-wellness .about-content p { color: #6b7280; line-height: 1.9; font-size: 16px; }
        .mission-wellness .about-grid { margin-top: 35px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
        .mission-wellness .about-box {
          background: #f8fbfd; padding: 25px; border-radius: 24px; transition: 0.4s; border: 1px solid #eef2f7;
        }
        .mission-wellness .about-box:hover { transform: translateY(-8px); background: #00a3da; }
        .mission-wellness .about-box:hover h3, .mission-wellness .about-box:hover p { color: #fff; }
        .mission-wellness .about-box h3 { margin-bottom: 10px; transition: 0.3s; }
        .mission-wellness .about-box p { font-size: 14px; transition: 0.3s; }

        .mission-wellness .mission-section { width: 100%; padding: 60px 5%; background: #f8fbfd; }
        .mission-wellness .section-title { text-align: center; margin-bottom: 60px; }
        .mission-wellness .section-title span { color: #00a3da; font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 15px; }
        .mission-wellness .section-title h2 { font-size: 52px; line-height: 1.15; margin-bottom: 20px; font-weight: 800; }
        .mission-wellness .mission-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .mission-wellness .mission-card {
          background: #fff; padding: 40px 30px; border-radius: 30px; transition: 0.4s;
          position: relative; overflow: hidden;
        }
        .mission-wellness .mission-card::before {
          content: ''; position: absolute; width: 100%; height: 0; left: 0; bottom: 0;
          background: #00a3da; transition: 0.4s; z-index: 0;
        }
        .mission-wellness .mission-card:hover::before { height: 100%; }
        .mission-wellness .mission-card * { position: relative; z-index: 2; }
        .mission-wellness .mission-card:hover h3, .mission-wellness .mission-card:hover p, .mission-wellness .mission-card:hover .icon { color: #fff; }
        .mission-wellness .mission-card:hover .icon { background: rgba(255,255,255,0.2); }
        .mission-wellness .icon {
          width: 75px; height: 75px; border-radius: 50%; background: #dff6ff; color: #00a3da;
          display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px;
          margin-bottom: 22px; transition: 0.3s;
        }
        .mission-wellness .mission-card h3 { margin-bottom: 15px; transition: 0.3s; }
        .mission-wellness .mission-card p { color: #6b7280; line-height: 1.8; transition: 0.3s; }
        .mission-wellness .project-image-card {
          position: relative; height: 380px; border-radius: 30px; overflow: hidden;
          transform-style: preserve-3d; transition: 0.6s ease; cursor: pointer;
        }
        .mission-wellness .project-image-card img { width: 100%; height: 100%; object-fit: cover; border-radius: 30px; transition: 0.6s ease; }
        .mission-wellness .project-image-card:hover { transform: perspective(1200px) rotateY(10deg) rotateX(6deg) translateY(-12px); }
        .mission-wellness .project-image-card:hover img { transform: scale(1.08); }
        .mission-wellness .project-image-card::after {
          content: ""; position: absolute; left: 20px; right: 20px; bottom: -18px; height: 35px;
          background: rgba(0,0,0,0.18); filter: blur(20px); border-radius: 50%; z-index: -1; transition: 0.5s;
        }
        .mission-wellness .project-image-card:hover::after { bottom: -25px; filter: blur(25px); }

        .mission-wellness .gallery-section { width: 100%; padding: 60px 5%; background: #f8fbfd; }
        .mission-wellness .gallery-title { text-align: center; margin-bottom: 60px; }
        .mission-wellness .gallery-title span { color: #00a3da; font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 15px; }
        .mission-wellness .gallery-title h2 { font-size: 52px; line-height: 1.15; margin-bottom: 20px; font-weight: 800; }
        .mission-wellness .gallery-grid { max-width: 1200px; margin: auto; display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 260px; gap: 25px; }
        .mission-wellness .gallery-item { position: relative; overflow: hidden; border-radius: 30px; cursor: pointer; }
        .mission-wellness .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .mission-wellness .gallery-item.large { grid-column: span 2; grid-row: span 2; }
        .mission-wellness .gallery-item:hover img { transform: scale(1.08); }

        .mission-wellness .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-wellness .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; }
        .mission-wellness .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-wellness .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-wellness .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-wellness .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-wellness .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-wellness .sevak-btn:hover { transform: translateY(-2px); }

        .mission-wellness .testimonial-section { padding: 40px 5%; }
        .mission-wellness .section-header { text-align: center; margin-bottom: 60px; }
        .mission-wellness .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-wellness .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .mission-wellness .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden;
          position: relative; z-index: 0; display: flex; flex-direction: column; justify-content: space-between;
        }
        .mission-wellness .testimonial-card:hover { transform: translateY(-10px); }
        .mission-wellness .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-wellness .testimonial-card h4 { color: #00a3da; }
        .mission-wellness .testimonial-card h4, .mission-wellness .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-wellness .testimonial-card:hover h4, .mission-wellness .testimonial-card:hover p { color: #fff !important; }
        .mission-wellness .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-wellness .testimonial-card:hover::before { height: 100%; }
        .mission-wellness .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-wellness .hero-content { flex-direction: column; gap: 40px; }
          .mission-wellness .hero-left, .mission-wellness .hero-right { max-width: 100%; width: 100%; }
          .mission-wellness .hero-right { justify-content: center; }
          .mission-wellness .hero-left { text-align: center; }
          .mission-wellness .hero-buttons { justify-content: center; }
          .mission-wellness .mini-title { font-size: 24px; }
          .mission-wellness .hero-left h1 { font-size: 46px; }
          .mission-wellness .image-box { max-width: 100%; }
          .mission-wellness .image-box img { height: auto; aspect-ratio: 16/10; max-height: 420px; border-radius: 28px; transform: none; animation: none; }
          .mission-wellness .image-box:hover img { transform: none; }
          .mission-wellness .card1 { top: 0; left: 0; border-radius: 0 0 18px 0; }
          .mission-wellness .card2 { bottom: 0; right: 0; border-radius: 18px 0 0 0; }
          .mission-wellness .floating-card { padding: 10px 14px; animation: none; }
          .mission-wellness .floating-card:hover { transform: none; }
          .mission-wellness .floating-card h3 { font-size: 20px; }
          .mission-wellness .floating-card p { font-size: 12px; }
          .mission-wellness .about-section { flex-direction: column; text-align: center; gap: 35px; padding: 50px 5%; margin-top: 50px; clip-path: inset(0); }
          .mission-wellness .about-image img { height: auto; aspect-ratio: 16/10; max-height: 400px; border-radius: 28px; }
          .mission-wellness .about-image:hover img { transform: none; }
          .mission-wellness .about-grid { grid-template-columns: 1fr; gap: 16px; }
          .mission-wellness .about-box { padding: 20px; border-radius: 20px; }
          .mission-wellness .about-content h2 { font-size: 34px; }
          .mission-wellness .mission-section { padding: 50px 5%; }
          .mission-wellness .section-title { margin-bottom: 35px; }
          .mission-wellness .section-title h2 { font-size: 34px; }
          .mission-wellness .mission-cards { grid-template-columns: 1fr; gap: 20px; }
          .mission-wellness .mission-card { padding: 30px 24px; border-radius: 24px; }
          .mission-wellness .project-image-card { height: auto; aspect-ratio: 16/10; min-height: 250px; border-radius: 24px; transform: none; }
          .mission-wellness .project-image-card:hover { transform: none; }
          .mission-wellness .project-image-card::after { display: none; }
          .mission-wellness .gallery-section { padding: 50px 5%; }
          .mission-wellness .gallery-title { margin-bottom: 35px; }
          .mission-wellness .gallery-title h2 { font-size: 34px; }
          .mission-wellness .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: auto; gap: 16px; }
          .mission-wellness .gallery-item { border-radius: 24px; }
          .mission-wellness .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-wellness .sevak-title { font-size: 34px; }
          .mission-wellness .sevak-desc { font-size: 14px; }
          .mission-wellness .sevak-btn { white-space: normal; }
          .mission-wellness .testimonial-grid { grid-template-columns: 1fr; gap: 20px; }
          .mission-wellness .tax-box { height: auto; padding: 15px; }
          .mission-wellness .about-image img { box-shadow: none; }
        }
        @media (max-width: 600px) {
          .mission-wellness .hero-section { padding: 30px 5% 20px; }
          .mission-wellness .hero-content { gap: 25px; }
          .mission-wellness .hero-left h1 { font-size: 28px; }
          .mission-wellness .hero-left p { font-size: 14px; }
          .mission-wellness .mini-title { font-size: 18px; }
          .mission-wellness .hero-buttons { flex-direction: column; align-items: center; }
          .mission-wellness .primary-btn { padding: 12px 24px; font-size: 15px; }
          .mission-wellness .image-box img { aspect-ratio: 4/3; max-height: 320px; border-radius: 18px; }
          .mission-wellness .card1 { border-radius: 0 0 12px 0; }
          .mission-wellness .card2 { border-radius: 12px 0 0 0; }
          .mission-wellness .floating-card { padding: 6px 10px; }
          .mission-wellness .floating-card h3 { font-size: 16px; line-height: 1.2; }
          .mission-wellness .floating-card p { font-size: 11px; margin: 0; }
          .mission-wellness .about-section { flex-direction: column; text-align: center; gap: 30px; padding: 40px 5%; }
          .mission-wellness .about-image img { aspect-ratio: 4/3; max-height: 300px; border-radius: 20px; }
          .mission-wellness .about-content h2 { font-size: 26px; }
          .mission-wellness .about-box { padding: 16px; border-radius: 16px; }
          .mission-wellness .about-box h3 { font-size: 16px; }
          .mission-wellness .about-box p { font-size: 13px; }
          .mission-wellness .about-grid { grid-template-columns: 1fr; gap: 14px; }
          .mission-wellness .mission-section { padding: 35px 5%; }
          .mission-wellness .section-title { margin-bottom: 25px; }
          .mission-wellness .section-title h2 { font-size: 26px; }
          .mission-wellness .mission-cards { grid-template-columns: 1fr; gap: 16px; }
          .mission-wellness .mission-card { padding: 22px 18px; border-radius: 20px; }
          .mission-wellness .icon { width: 60px; height: 60px; font-size: 18px; }
          .mission-wellness .mission-card h3 { font-size: 17px; }
          .mission-wellness .mission-card p { font-size: 14px; }
          .mission-wellness .project-image-card { aspect-ratio: 4/3; min-height: 200px; border-radius: 18px; }
          .mission-wellness .gallery-section { padding: 35px 5%; }
          .mission-wellness .gallery-title { margin-bottom: 25px; }
          .mission-wellness .gallery-title h2 { font-size: 26px; }
          .mission-wellness .gallery-grid { grid-template-columns: 1fr; grid-auto-rows: auto; gap: 12px; }
          .mission-wellness .gallery-item, .mission-wellness .gallery-item.large { grid-column: span 1; grid-row: span 1; height: auto; aspect-ratio: 4/3; border-radius: 18px; }
          .mission-wellness .sevak-title { font-size: 26px; }
          .mission-wellness .sevak-desc { font-size: 13px; }
          .mission-wellness .sevak-btn { padding: 12px 28px; font-size: 14px; }
          .mission-wellness .testimonial-grid { grid-template-columns: 1fr; gap: 16px; }
          .mission-wellness .testimonial-card { padding: 22px; border-radius: 22px; }
          .mission-wellness .testimonial-card p { font-size: 14px; }
          .mission-wellness .about-section { margin-top: 50px; }
          .mission-wellness #donate { margin-bottom: 30px; }
        }
        @media (max-width: 360px) {
          .mission-wellness .about-section { margin-top: 60px; }
          .mission-wellness #donate { margin-bottom: 40px; }
        }
      `}</style>

      <div className="mission-wellness">
        <section className="tax-box">
          <h1>{taxTitle}</h1>
        </section>

        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-left">
              <span className="mini-title">{heroTag}</span>
              <h1>
                {heroLine1} <span>{heroHighlight}</span><br />
                {heroLine2}
              </h1>
              <p>
                {heroText}
              </p>
              <div className="hero-buttons">
                <a href="#donate" className="primary-btn">Donate Now</a>
              </div>
            </div>
            <div className="hero-right">
              <div className="image-box">
                <img src={heroImage} alt="Mission Aarogya" />
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

        <div id="donate" style={{ width: '100%', background: '#f4f7fb', padding: '0', overflow: 'hidden', marginBottom: '0', position: 'relative', zIndex: 10, isolation: 'isolate' }}>
          <iframe
            ref={iframeRef}
            src={donationUrl}
            style={{ width: '100%', height: '650px', border: 'none', display: 'block' }}
            title="Donate to Mission Aarogya"
          />
        </div>

        <section className="about-section" id="about">
          <div className="about-image">
            <img src={aboutImage} alt="Healthcare Support" />
          </div>
          <div className="about-content">
            <span className="mini-title">{aboutTag}</span>
            <h2>{aboutLine1} <span>{aboutHighlight}</span></h2>
            <p>
              {aboutText}
            </p>
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

        <section className="mission-section">
          <div className="section-title">
            <span>{supportTag}</span>
            <h2>{supportHeading}</h2>
          </div>
          <div className="mission-cards">
            {supportCards.map((c, i) => (
              <div className="mission-card" key={i}>
                <div className="icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
          <div className="mission-cards" style={{ marginTop: '40px' }}>
            {projectImages.map((img, i) => (
              <div className="project-image-card" key={i}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-content">
            <span className="mini-title">{babyTag}</span>
            <h2>{babyHeading}</h2>
            <p>
              {babyText}
            </p>
            <div className="about-grid">
              {babyItems.map((item, i) => (
                <div className="about-box" key={i}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="about-image">
            <img src={babyImage} alt="Baby Care Center" />
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="gallery-title">
            <span>{galleryTag}</span>
            <h2>{galleryHeading}</h2>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((g, i) => (
              <div className={g.big ? 'gallery-item large' : 'gallery-item'} key={i}><img src={g.src} alt={g.alt} /></div>
            ))}
          </div>
        </section>

        <section className="sevak-donation" id="donate-section">
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
