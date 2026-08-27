import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const MissionBezubaan = () => {
  const iframeRef = useRef(null);

  const content = usePageContent('mission-bezubaan');

  const taxTitle = content('mission-bezubaan-tax', 'title') ?? 'Mission Bezubaan';

  const heroTag = content('mission-bezubaan-hero', 'tag') ?? 'Mission Bezubaan';
  const heroLine1 = content('mission-bezubaan-hero', 'headingLine1') ?? 'Be Their';
  const heroHighlight = content('mission-bezubaan-hero', 'headingHighlight') ?? 'Voice';
  const heroLine2 = content('mission-bezubaan-hero', 'headingLine2') ?? 'Feed & Protect Street Animals';
  const heroText =
    content('mission-bezubaan-hero', 'description') ??
    'Mission Bezubaan by Being Sevak Charitable Trust supports stray animals with food, care, shelter and compassion. Every paw deserves love, safety and a better tomorrow.';
  const heroImage = content('mission-bezubaan-hero', 'image') ?? '/images/b1.png';
  const heroStats =
    content('bezubaan-hero-stats', 'items') ?? [
      { value: '5000+', label: 'Animals Fed' },
      { value: '24/7', label: 'Care Support' },
    ];

  const aboutTag = content('bezubaan-about', 'tag') ?? 'About Bezubaan';
  const aboutLine1 = content('bezubaan-about', 'headingLine1') ?? 'Compassion For Every';
  const aboutHighlight = content('bezubaan-about', 'headingHighlight') ?? 'Silent Soul';
  const aboutText =
    content('bezubaan-about', 'text') ??
    'Mission Bezubaan works to provide nutrition, safety and medical support for stray animals living on streets. Our goal is to create a kinder and more caring world for voiceless companions.';
  const aboutImage = content('bezubaan-about', 'image') ?? '/images/b2.jpg';
  const aboutItems =
    content('bezubaan-about', 'items') ?? [
      { title: 'ðŸ¾ Daily Feeding', description: 'Nutritious meals for hungry street animals.' },
      { title: 'â¤ï¸ Medical Care', description: 'Emergency treatment and healthcare support.' },
      { title: 'ðŸš‘ Rescue Support', description: 'Helping injured and abandoned animals.' },
      { title: 'ðŸ  Safe Shelter', description: 'Providing warmth, care and protection.' },
    ];

  const impactTag = content('bezubaan-impact', 'tag') ?? 'Our Impact';
  const impactHeading = content('bezubaan-impact', 'heading') ?? 'How We Help Street Animals';
  const impactText =
    content('bezubaan-impact', 'text') ??
    'Through dedicated feeding drives, rescue missions and community awareness, Mission Bezubaan is making a real difference in the lives of thousands of stray animals across India.';
  const impactStats =
    content('bezubaan-impact', 'stats') ?? [
      { value: '10K+', label: 'Meals Served' },
      { value: '1000+', label: 'Animals Helped' },
      { value: '50+', label: 'Rescue Drives' },
      { value: '24/7', label: 'Care Support' },
    ];
  const impactImage = content('bezubaan-impact', 'image') ?? '/images/b3.jpg';

  const pawMiniTitle = content('bezubaan-paw-care', 'miniTitle') ?? 'Paw Care Center';
  const pawHeading = content('bezubaan-paw-care', 'heading') ?? 'We Have Opened A Dedicated Paw Care Center';
  const pawText1 =
    content('bezubaan-paw-care', 'text1') ??
    'We have opened a dedicated Paw Care Center in Goregaon to support and protect stray dogs in need. Our center provides safe shelter, food, and proper care for abandoned and homeless dogs.';
  const pawText2 =
    content('bezubaan-paw-care', 'text2') ??
    'Through this initiative, we aim to create a compassionate space where every stray dog gets love, protection, and a second chance at life.';
  const pawMainImage = content('bezubaan-paw-care', 'image') ?? '/images/dog1.jpeg';
  const pawGalleryImages =
    content('bezubaan-paw-care', 'images') ?? [
      { src: '/images/b4.jpg', alt: 'Gallery 1' },
      { src: '/images/b5.jpg', alt: 'Gallery 2' },
      { src: '/images/b6.jpg', alt: 'Gallery 3' },
    ];
  const pawFeatures =
    content('bezubaan-paw-care', 'features') ?? [
      { title: 'Shelter Support', description: 'Safe space for stray dogs' },
      { title: 'Medical Care', description: 'Treatment for injured dogs' },
      { title: 'Daily Feeding', description: 'Food & regular care support' },
    ];

  const careTag = content('bezubaan-care-about', 'tag') ?? 'Spreading Care Across The Streets';
  const careLine1 = content('bezubaan-care-about', 'headingLine1') ?? 'Helping Animals';
  const careHighlight = content('bezubaan-care-about', 'headingHighlight') ?? 'With Love & Compassion';
  const careText =
    content('bezubaan-care-about', 'text') ??
    'Through continuous feeding drives and rescue efforts, Mission Bezubaan is creating hope and comfort for thousands of stray animals across communities.';
  const careItems =
    content('bezubaan-care-about', 'items') ?? [
      { title: 'ðŸ• Food Distribution', description: 'We regularly distribute food and water to hungry animals.' },
      { title: 'ðŸ¥ Rescue Activities', description: 'Our team rescues injured and helpless animals.' },
      { title: 'ðŸ’• Care & Awareness', description: 'We encourage kindness towards animals in communities.' },
      { title: 'ðŸ¡ Shelter Support', description: 'Providing safe homes for abandoned animals.' },
    ];
  const careImage = content('bezubaan-care-about', 'image') ?? '/images/b7.jpeg';

  const galleryTag = content('bezubaan-gallery', 'tag') ?? 'Gallery';
  const galleryHeading = content('bezubaan-gallery', 'heading') ?? 'Moments Of Love & Care';
  const galleryImages =
    content('bezubaan-gallery', 'images') ?? [
      { src: '/images/b2.jpg', alt: 'Gallery 1' },
      { src: '/images/b3.jpg', alt: 'Gallery 2' },
      { src: '/images/b4.jpg', alt: 'Gallery 3' },
      { src: '/images/b5.jpg', alt: 'Gallery 4' },
      { src: '/images/b6.jpg', alt: 'Gallery 5' },
      { src: '/images/b7.jpeg', alt: 'Gallery 6' },
      { src: '/images/dog1.jpeg', alt: 'Gallery 7' },
      { src: '/images/b1.png', alt: 'Gallery 8' },
    ];

  const donationTag = content('bezubaan-donation', 'tag') ?? 'Mission Bezubaan';
  const donationUrl = content('bezubaan-donation', 'donationUrl') ?? '/donations/donation-inline-bezubaan.html';
  const donationTitle = content('bezubaan-donation', 'title') ?? 'Speak for Those Who Cannot Speak';
  const donationText =
    content('bezubaan-donation', 'description') ??
    'Our mission is to protect and care for stray and voiceless animals by providing food, medical support, shelter, and love.';

  const testimonialHeading = content('bezubaan-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('bezubaan-testimonials', 'items') ?? [
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
        .mission-bezubaan * { margin: 0; padding: 0; box-sizing: border-box; }
        .mission-bezubaan { font-family: 'Montserrat', sans-serif; background: #ffffff; color: #111827; overflow-x: hidden; }
        .mission-bezubaan img { width: 100%; display: block; }
        .mission-bezubaan section { overflow: hidden; }

        .mission-bezubaan .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 20px 0; padding: 10px; border-radius: 0;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15); position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .mission-bezubaan .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .mission-bezubaan .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .mission-bezubaan .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: bzShine 6s linear infinite;
        }
        .mission-bezubaan .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes bzShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .mission-bezubaan .hero-section {
          width: 100%; min-height: 100vh;
          padding: 30px 7% 80px;
          background: radial-gradient(circle at top left, #dff6ff 0%, transparent 35%),
          radial-gradient(circle at bottom right, #d8f4ff 0%, transparent 35%),
          #ffffff;
        }
        .mission-bezubaan .hero-content {
          width: 100%; max-width: 1350px; margin: auto;
          display: flex; align-items: center; justify-content: space-between; gap: 70px;
        }
        .mission-bezubaan .hero-left, .mission-bezubaan .hero-right { flex: 1; }
        .mission-bezubaan .mini-title {
          background: transparent; color: #00a3da; padding: 0; border-radius: 0;
          display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px;
        }
        .mission-bezubaan .hero-left h1 { font-size: 68px; line-height: 1.08; font-weight: 800; margin-bottom: 24px; }
        .mission-bezubaan .hero-left h1 span { color: #00a3da; }
        .mission-bezubaan .hero-left p { font-size: 18px; line-height: 1.9; color: #6b7280; max-width: 620px; margin-bottom: 35px; }
        .mission-bezubaan .hero-buttons { display: flex; gap: 18px; flex-wrap: wrap; }
        .mission-bezubaan .primary-btn {
          text-decoration: none; padding: 16px 34px; border-radius: 50px; font-weight: 700;
          transition: 0.35s; background: #00a3da; color: #fff;
        }
        .mission-bezubaan .primary-btn:hover { transform: translateY(-5px) scale(1.03); }
        .mission-bezubaan .hero-right {
          flex: 1; display: flex; justify-content: center; align-items: center;
          position: relative;
        }
        .mission-bezubaan .image-box {
          width: 100%; max-width: 560px; margin: auto; position: relative;
        }
        .mission-bezubaan .image-box img {
          width: 100%; height: 680px; object-fit: cover; border-radius: 40px;
          transition: 0.6s ease; transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.18); animation: bzFloatImage 4s ease-in-out infinite;
        }
        .mission-bezubaan .image-box:hover img {
          transform: perspective(1000px) rotateY(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25);
        }
        @keyframes bzFloatImage {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
        }
        .mission-bezubaan .floating-card {
          position: absolute; background: #fff; padding: 20px 24px; border-radius: 22px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08); z-index: 5; animation: bzFloat 3s ease-in-out infinite;
        }
        .mission-bezubaan .floating-card h3 { color: #00a3da; font-size: 34px; margin-bottom: 5px; }
        .mission-bezubaan .floating-card p { font-size: 14px; color: #6b7280; }
        .mission-bezubaan .card1 { top: 35px; left: -35px; }
        .mission-bezubaan .card2 { bottom: 35px; right: -35px; }
        @keyframes bzFloat { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }

        .mission-bezubaan .about-section { width: 100%; padding: 0px 7% 60px; display: flex; align-items: center; justify-content: space-between; gap: 70px; position: relative; z-index: 1; overflow: hidden; isolation: isolate; }
        .mission-bezubaan .about-image, .mission-bezubaan .about-content { flex: 1; }
        .mission-bezubaan .about-image { position: relative; overflow: hidden; isolation: isolate; }
        .mission-bezubaan .about-image img {
          width: 100%; height: 600px; object-fit: cover; border-radius: 35px;
          transition: 0.5s; box-shadow: 0 18px 45px rgba(0,0,0,0.08);
        }
        .mission-bezubaan .about-image:hover img { transform: scale(1.04) rotate(-1deg); }
        .mission-bezubaan .about-content h2 { font-size: 52px; line-height: 1.15; margin-bottom: 20px; font-weight: 800; }
        .mission-bezubaan .about-content h2 span { color: #00a3da; }
        .mission-bezubaan .about-content p { color: #6b7280; line-height: 1.9; font-size: 16px; }
        .mission-bezubaan .about-grid {
          margin-top: 35px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px;
        }
        .mission-bezubaan .about-box {
          background: #f8fbfd; padding: 25px; border-radius: 24px; transition: 0.4s; border: 1px solid #eef2f7;
        }
        .mission-bezubaan .about-box:hover { transform: translateY(-8px); background: #00a3da; }
        .mission-bezubaan .about-box:hover h3, .mission-bezubaan .about-box:hover p { color: #fff; }
        .mission-bezubaan .about-box h3 { margin-bottom: 10px; transition: 0.3s; }
        .mission-bezubaan .about-box p { font-size: 14px; transition: 0.3s; }

        .mission-bezubaan .mission-section { width: 100%; padding: 0px 7%; background: #f8fbfd; }
        .mission-bezubaan .section-title { text-align: center; margin-bottom: 60px; }
        .mission-bezubaan .section-title h2 { font-size: 52px; line-height: 1.15; margin-bottom: 20px; font-weight: 800; }
        .mission-bezubaan .section-title span { color: #00a3da; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 15px; }
        .mission-bezubaan .mission-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .mission-bezubaan .mission-card {
          background: #fff; padding: 40px 30px; border-radius: 30px; transition: 0.4s;
          position: relative; overflow: hidden;
        }
        .mission-bezubaan .mission-card::before {
          content: ''; position: absolute; width: 100%; height: 0; left: 0; bottom: 0;
          background: #00a3da; transition: 0.4s; z-index: 0;
        }
        .mission-bezubaan .mission-card:hover::before { height: 100%; }
        .mission-bezubaan .mission-card * { position: relative; z-index: 2; }
        .mission-bezubaan .mission-card:hover h3, .mission-bezubaan .mission-card:hover p, .mission-bezubaan .mission-card:hover .bz-icon { color: #fff; }
        .mission-bezubaan .mission-card:hover .bz-icon { background: rgba(255,255,255,0.2); }
        .mission-bezubaan .bz-icon {
          width: 75px; height: 75px; border-radius: 50%; background: #dff6ff; color: #00a3da;
          display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 28px;
          margin-bottom: 22px; transition: 0.3s;
        }
        .mission-bezubaan .mission-card h3 { margin-bottom: 15px; transition: 0.3s; }
        .mission-bezubaan .mission-card p { color: #6b7280; line-height: 1.8; transition: 0.3s; font-size: 16px; }

        .mission-bezubaan .impact-section { width: 100%; padding: 0px 7%; }
        .mission-bezubaan .impact-wrapper {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 70px;
        }
        .mission-bezubaan .impact-content, .mission-bezubaan .impact-image { flex: 1; }
        .mission-bezubaan .impact-image img {
          width: 100%; height: 620px; object-fit: cover; border-radius: 35px;
          transition: 0.5s; box-shadow: 0 18px 45px rgba(0,0,0,0.08);
        }
        .mission-bezubaan .impact-image:hover img { transform: scale(1.04); }
        .mission-bezubaan .impact-content h2 { font-size: 52px; line-height: 1.15; margin-bottom: 20px; font-weight: 800; }
        .mission-bezubaan .impact-content span { color: #00a3da; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 15px; }
        .mission-bezubaan .impact-content p { color: #6b7280; line-height: 1.9; font-size: 16px; }
        .mission-bezubaan .impact-stats { display: flex; gap: 22px; margin-top: 35px; flex-wrap: wrap; }
        .mission-bezubaan .impact-stats div {
          background: #f8fbfd; padding: 24px 26px; border-radius: 22px; min-width: 160px;
          text-align: center; transition: 0.4s;
        }
        .mission-bezubaan .impact-stats div:hover { background: #00a3da; transform: translateY(-6px); }
        .mission-bezubaan .impact-stats div:hover h3, .mission-bezubaan .impact-stats div:hover p { color: #fff; }
        .mission-bezubaan .impact-stats h3 { font-size: 34px; color: #00a3da; margin-bottom: 6px; }
        .mission-bezubaan .impact-stats p { font-size: 14px; }

        .mission-bezubaan .gallery-section { width: 100%; padding: 10px 7%; background: #f8fbfd; }
        .mission-bezubaan .gallery-title { text-align: center; margin-bottom: 60px; }
        .mission-bezubaan .gallery-title span { color: #00a3da; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 15px; }
        .mission-bezubaan .gallery-title h2 { font-size: 52px; line-height: 1.15; margin-bottom: 20px; font-weight: 800; }
        .mission-bezubaan .gallery-grid {
          max-width: 1200px; margin: auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px;
        }
        .mission-bezubaan .gallery-card {
          overflow: hidden; border-radius: 30px; height: 420px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .mission-bezubaan .gallery-card img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .mission-bezubaan .gallery-card:hover img { transform: scale(1.12); }

        .mission-bezubaan .pawzen-wrap { width: 100%; padding: 90px 7%; background: #ffffff; overflow: hidden; }
        .mission-bezubaan .pawzen-container { display: flex; align-items: center; justify-content: space-between; gap: 60px; flex-wrap: wrap; }
        .mission-bezubaan .pawzen-image-side { flex: 1; min-width: 320px; }
        .mission-bezubaan .pawzen-main-image {
          width: 100%; height: 420px; border-radius: 28px; overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        }
        .mission-bezubaan .pawzen-main-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mission-bezubaan .pawzen-gallery-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 18px; }
        .mission-bezubaan .pawzen-gallery-row img {
          width: 100%; height: 120px; object-fit: cover; border-radius: 18px; transition: 0.4s; cursor: pointer;
        }
        .mission-bezubaan .pawzen-gallery-row img:hover { transform: translateY(-5px); }
        .mission-bezubaan .pawzen-content-side { flex: 1; min-width: 320px; }
        .mission-bezubaan .pawzen-mini-title {
          display: inline-block; padding: 10px 18px; background: #e8f0ff; color: #00a3da;
          border-radius: 50px; font-size: 14px; font-weight: 600; margin-bottom: 20px;
        }
        .mission-bezubaan .pawzen-content-side h2 {
          font-size: 56px; line-height: 1.1; color: #00a3da; margin-bottom: 25px; font-weight: 800;
        }
        .mission-bezubaan .pawzen-content-side p { font-size: 17px; line-height: 1.9; color: #555; margin-bottom: 18px; }
        .mission-bezubaan .pawzen-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 35px; }
        .mission-bezubaan .pawzen-feature-card {
          background: #ffffff; border: 1px solid #dce6ff; border-radius: 22px; padding: 25px 20px;
          transition: 0.4s; box-shadow: 0 10px 25px rgba(0,58,188,0.06);
        }
        .mission-bezubaan .pawzen-feature-card:hover { transform: translateY(-6px); background: #00a3da; }
        .mission-bezubaan .pawzen-feature-card h3 { color: #00a3da; font-size: 20px; margin-bottom: 10px; transition: 0.4s; }
        .mission-bezubaan .pawzen-feature-card span { color: #666; font-size: 14px; transition: 0.4s; }
        .mission-bezubaan .pawzen-feature-card:hover h3, .mission-bezubaan .pawzen-feature-card:hover span { color: #fff; }

        .mission-bezubaan .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 55px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .mission-bezubaan .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; }
        .mission-bezubaan .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .mission-bezubaan .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .mission-bezubaan .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .mission-bezubaan .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .mission-bezubaan .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .mission-bezubaan .sevak-btn:hover { transform: translateY(-2px); }

        .mission-bezubaan .testimonial-section { padding: 50px 5%; }
        .mission-bezubaan .section-header { text-align: center; margin-bottom: 40px; }
        .mission-bezubaan .section-header h2 { font-size: 42px; margin: 18px 0; }
        .mission-bezubaan .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .mission-bezubaan .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden; position: relative;
        }
        .mission-bezubaan .testimonial-card:hover { transform: translateY(-10px); }
        .mission-bezubaan .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .mission-bezubaan .testimonial-card h4 { color: #00a3da; }
        .mission-bezubaan .testimonial-card h4, .mission-bezubaan .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .mission-bezubaan .testimonial-card:hover h4, .mission-bezubaan .testimonial-card:hover p { color: #fff !important; }
        .mission-bezubaan .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .mission-bezubaan .testimonial-card:hover::before { height: 100%; }
        .mission-bezubaan .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .mission-bezubaan .hero-content, .mission-bezubaan .about-section, .mission-bezubaan .impact-wrapper, .mission-bezubaan .pawzen-container { flex-direction: column; text-align: center; }
          .mission-bezubaan .hero-left, .mission-bezubaan .about-content, .mission-bezubaan .impact-content, .mission-bezubaan .pawzen-content-side { max-width: 100%; }
          .mission-bezubaan .hero-buttons { justify-content: center; }
          .mission-bezubaan .hero-left h1 { font-size: 46px; }
          .mission-bezubaan .mini-title { font-size: 24px; }
          .mission-bezubaan .about-content h2, .mission-bezubaan .section-title h2, .mission-bezubaan .impact-content h2, .mission-bezubaan .gallery-title h2, .mission-bezubaan .pawzen-content-side h2 { font-size: 36px; }
          .mission-bezubaan .about-grid { grid-template-columns: 1fr; }
          .mission-bezubaan .impact-stats { justify-content: center; }
          .mission-bezubaan .mission-cards { grid-template-columns: 1fr; }
          .mission-bezubaan .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 0 5%; }
          .mission-bezubaan .gallery-card { height: 250px; }
          .mission-bezubaan .pawzen-feature-grid { grid-template-columns: 1fr; }
          .mission-bezubaan .floating-card { min-width: 130px; }
          .mission-bezubaan .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .mission-bezubaan .sevak-title { font-size: 34px; }
          .mission-bezubaan .testimonial-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .mission-bezubaan .hero-section { padding: 30px 5% 40px; min-height: auto; }
          .mission-bezubaan .hero-content { gap: 30px; }
          .mission-bezubaan .hero-left h1 { font-size: 34px; }
          .mission-bezubaan .hero-left p { font-size: 15px; max-width: 100%; }
          .mission-bezubaan .hero-buttons { flex-direction: column; align-items: center; }
          .mission-bezubaan .primary-btn { padding: 12px 24px; font-size: 15px; }
          .mission-bezubaan .image-box { max-width: 100%; }
          .mission-bezubaan .image-box img { height: 280px; border-radius: 20px; transform: none; animation: none; }
          .mission-bezubaan .about-image img { height: 320px; border-radius: 22px; }
          .mission-bezubaan .about-section { gap: 30px; margin-top: 50px; clip-path: inset(0); }
          .mission-bezubaan #donate { margin-bottom: 30px; }
          .mission-bezubaan .card1 { top: 0; left: 0; border-radius: 0 0 12px 0; }
          .mission-bezubaan .card2 { bottom: 0; right: 0; border-radius: 12px 0 0 0; }
          .mission-bezubaan .floating-card { padding: 5px 8px; }
          .mission-bezubaan .floating-card h3 { font-size: 14px; line-height: 1.1; }
          .mission-bezubaan .floating-card p { font-size: 10px; margin: 0; }
          .mission-bezubaan .about-content h2, .mission-bezubaan .section-title h2, .mission-bezubaan .impact-content h2, .mission-bezubaan .gallery-title h2, .mission-bezubaan .pawzen-content-side h2 { font-size: 28px; }
          .mission-bezubaan .mission-section { padding: 40px 5%; }
          .mission-bezubaan .mission-cards { gap: 18px; }
          .mission-bezubaan .mission-card { padding: 25px 20px; border-radius: 22px; }
          .mission-bezubaan .impact-section { padding: 40px 5%; }
          .mission-bezubaan .pawzen-wrap { padding: 70px 5%; }
          .mission-bezubaan .pawzen-main-image { height: 260px; }
          .mission-bezubaan .pawzen-gallery-row { grid-template-columns: 1fr 1fr; gap: 10px; }
          .mission-bezubaan .pawzen-gallery-row img { height: 100px; }
          .mission-bezubaan .pawzen-content-side h2 { font-size: 34px; }
          .mission-bezubaan .pawzen-content-side p { font-size: 15px; }
          .mission-bezubaan .gallery-grid { grid-template-columns: 1fr; gap: 12px; }
          .mission-bezubaan .gallery-card { height: 220px; border-radius: 20px; }
          .mission-bezubaan .gallery-section { padding: 40px 5%; }
          .mission-bezubaan .sevak-title { font-size: 28px; }
          .mission-bezubaan .sevak-desc { font-size: 14px; }
          .mission-bezubaan .sevak-btn { padding: 12px 28px; font-size: 14px; white-space: normal; }
          .mission-bezubaan .about-section { margin-top: 50px; }
          .mission-bezubaan #donate { margin-bottom: 30px; }
        }
        @media (max-width: 360px) {
          .mission-bezubaan .about-section { margin-top: 60px; }
          .mission-bezubaan #donate { margin-bottom: 40px; }
        }
      `}</style>

      <div className="mission-bezubaan">
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
                <img src={heroImage} alt="Dog" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
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
            title="Donate to Mission Bezubaan"
          />
        </div>

        <section className="about-section" id="about">
          <div className="about-image">
            <img src={aboutImage} alt="Animals" loading="lazy" decoding="async" width="800" height="600" />
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

        <section className="impact-section" id="impact">
          <div className="impact-wrapper">
            <div className="impact-content">
              <span>{impactTag}</span>
              <h2>{impactHeading}</h2>
              <p>
                {impactText}
              </p>
              <div className="impact-stats">
                {impactStats.map((s, i) => (
                  <div key={i}><h3>{s.value}</h3><p>{s.label}</p></div>
                ))}
              </div>
            </div>
            <div className="impact-image">
              <img src={impactImage} alt="Impact" loading="lazy" decoding="async" width="800" height="600" />
            </div>
          </div>
        </section>

        <section className="pawzen-wrap">
          <div className="pawzen-container">
            <div className="pawzen-image-side">
              <div className="pawzen-main-image">
                <img src={pawMainImage} alt="Paw Care Center" loading="lazy" decoding="async" width="800" height="600" />
              </div>
              <div className="pawzen-gallery-row">
                {pawGalleryImages.map((g, i) => (
                  <img key={i} src={g.src} alt={g.alt} loading="lazy" decoding="async" width="800" height="600" />
                ))}
              </div>
            </div>
            <div className="pawzen-content-side">
              <span className="pawzen-mini-title">{pawMiniTitle}</span>
              <h2>{pawHeading}</h2>
              <p>
                {pawText1}
              </p>
              <p>
                {pawText2}
              </p>
              <div className="pawzen-feature-grid">
                {pawFeatures.map((f, i) => (
                  <div className="pawzen-feature-card" key={i}><h3>{f.title}</h3><span>{f.description}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-content">
            <span className="mini-title">{careTag}</span>
            <h2>{careLine1} <span>{careHighlight}</span></h2>
            <p>
              {careText}
            </p>
            <div className="about-grid">
              {careItems.map((item, i) => (
                <div className="about-box" key={i}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="about-image">
            <img src={careImage} alt="Impact" loading="lazy" decoding="async" width="800" height="600" />
          </div>
        </section>

        <section className="gallery-section">
          <div className="gallery-title">
            <span>{galleryTag}</span>
            <h2>{galleryHeading}</h2>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((g, i) => (
              <div className="gallery-card" key={i}><img src={g.src} alt={g.alt} loading="lazy" decoding="async" width="800" height="600" /></div>
            ))}
          </div>
        </section>

        <section className="sevak-donation">
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
};

export default MissionBezubaan;

