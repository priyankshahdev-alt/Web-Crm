import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';

export default function SevakSevaKendra() {
  const content = usePageContent('sevak-seva-kendra');

  const taxTitle = content('sevak-seva-kendra-tax', 'title') ?? 'Sevak Seva Kendra';

  const heroTag = content('sevak-seva-kendra-hero', 'tag') ?? 'Sevak Seva Kendra';
  const heroLine1 = content('sevak-seva-kendra-hero', 'headingLine1') ?? 'Building A Better';
  const heroHighlight = content('sevak-seva-kendra-hero', 'headingHighlight') ?? 'Community';
  const heroLine2 = content('sevak-seva-kendra-hero', 'headingLine2') ?? 'Through Care & Development';
  const heroText =
    content('sevak-seva-kendra-hero', 'description') ??
    'Sevak Niwas Kendra by Being Sevak Charitable Trust provides education, digital learning, healthcare, women empowerment and skill development initiatives for building a stronger and self-reliant society.';
  const heroImage = content('sevak-seva-kendra-hero', 'image') ?? '/images/sevak1.jpeg';
  const heroStats =
    content('seva-kendra-hero-stats', 'items') ?? [
      { value: '5000+', label: 'Lives Empowered' },
      { value: '50+', label: 'Community Programs' },
    ];

  const libraryTag = content('seva-kendra-library', 'tag') ?? 'Library';
  const libraryLine1 = content('seva-kendra-library', 'headingLine1') ?? 'Knowledge & Learning';
  const libraryHighlight = content('seva-kendra-library', 'headingHighlight') ?? 'For Everyone';
  const libraryText =
    content('seva-kendra-library', 'text') ??
    'Our library provides books, study material and peaceful learning spaces for children, students and community members to encourage education and growth.';
  const libraryFeatures =
    content('seva-kendra-library', 'features') ?? [
      { icon: 'ðŸ“š', title: 'Study Resources', description: 'Books and learning material for students.' },
      { icon: 'ðŸ“–', title: 'Reading Space', description: 'Quiet and comfortable learning environment.' },
    ];
  const libraryImage = content('seva-kendra-library', 'image') ?? '/images/library.jpeg';

  const computerTag = content('seva-kendra-computer-centre', 'tag') ?? 'Sevak Computer Centre';
  const computerHeading = content('seva-kendra-computer-centre', 'heading') ?? 'Digital Skills For The Future';
  const computerStats =
    content('seva-kendra-computer-centre', 'stats') ?? [
      { value: '3000+', label: 'Students Trained' },
      { value: '100+', label: 'Computer Workshops' },
      { value: '50+', label: 'Digital Courses' },
      { value: '24/7', label: 'Learning Support' },
    ];

  const aiMiniTitle = content('seva-kendra-ai-centre', 'miniTitle') ?? 'AI & Digital Innovation Centre';
  const aiHeading = content('seva-kendra-ai-centre', 'heading') ?? 'Technology Driven Learning & Innovation';
  const aiText1 =
    content('seva-kendra-ai-centre', 'text1') ??
    'Our AI & Digital Innovation Centre is focused on empowering students and youth with future-ready technology skills. Through practical learning, workshops, and digital exposure, we help individuals explore the world of Artificial Intelligence, coding, robotics, and innovation.';
  const aiText2 =
    content('seva-kendra-ai-centre', 'text2') ??
    'The centre creates opportunities for creative thinking, digital transformation, and modern skill development while building confidence among young learners for tomorrow\'s technology-driven world.';
  const aiImage = content('seva-kendra-ai-centre', 'image') ?? '/images/ai2.jpg';
  const aiFeatures =
    content('seva-kendra-ai-centre', 'features') ?? [
      { title: 'AI Learning', description: 'Hands-on practical training' },
      { title: 'Digital Skills', description: 'Modern technology education' },
      { title: 'Innovation Lab', description: 'Creative project development' },
    ];

  const physioTag = content('seva-kendra-physiotherapy', 'tag') ?? 'Physiotherapy Centre';
  const physioLine1 = content('seva-kendra-physiotherapy', 'headingLine1') ?? 'Care & Recovery Through';
  const physioHighlight = content('seva-kendra-physiotherapy', 'headingHighlight') ?? 'Therapy Support';
  const physioText =
    content('seva-kendra-physiotherapy', 'text') ??
    'Our Physiotherapy Centre provides rehabilitation and physical therapy support for elderly people, patients and individuals recovering from injuries.';
  const physioFeatures =
    content('seva-kendra-physiotherapy', 'features') ?? [
      { icon: 'ðŸ§‘â€âš•ï¸', title: 'Therapy Sessions', description: 'Professional physiotherapy and rehabilitation support.' },
      { icon: 'â¤ï¸', title: 'Patient Care', description: 'Helping patients recover with proper guidance.' },
      { icon: 'ðŸ’ª', title: 'Rehabilitation', description: 'Guided recovery exercises for injury patients.' },
      { icon: 'ðŸ¥', title: 'Elderly Care', description: 'Special therapy sessions for senior citizens.' },
    ];
  const physioImage = content('seva-kendra-physiotherapy', 'image') ?? '/images/physio.jpeg';

  const womenTag = content('seva-kendra-women-empowerment', 'tag') ?? 'Women Empowerment';
  const womenHeading = content('seva-kendra-women-empowerment', 'heading') ?? 'Empowering Women Towards Independence';
  const womenStats =
    content('seva-kendra-women-empowerment', 'stats') ?? [
      { value: '2000+', label: 'Women Supported' },
      { value: '150+', label: 'Skill Workshops' },
      { value: '100+', label: 'Employment Support' },
      { value: '50+', label: 'Self Help Groups' },
    ];

  const rasoiMiniTitle = content('seva-kendra-rasoi-ghar', 'miniTitle') ?? 'Rasoi Ghar';
  const rasoiHeading = content('seva-kendra-rasoi-ghar', 'heading') ?? 'Serving Nutritious Meals With Love & Care';
  const rasoiText1 =
    content('seva-kendra-rasoi-ghar', 'text1') ??
    'Our Rasoi Ghar initiative is dedicated to providing fresh, hygienic, and nutritious meals to underprivileged families, homeless individuals, senior citizens, and daily wage workers. Through this initiative, we aim to fight hunger and spread humanity across communities.';
  const rasoiText2 =
    content('seva-kendra-rasoi-ghar', 'text2') ??
    'Every meal served represents compassion, dignity, and hope for those in need. With the support of volunteers and donors, we continue creating a positive social impact by ensuring that no one sleeps hungry.';
  const rasoiImage = content('seva-kendra-rasoi-ghar', 'image') ?? '/images/rasoi.jpeg';
  const rasoiFeatures =
    content('seva-kendra-rasoi-ghar', 'features') ?? [
      { title: '1000+', description: 'Meals Served Every Month' },
      { title: 'Daily Support', description: 'Helping Families & Workers' },
      { title: 'Community Care', description: 'Driven By Humanity & Kindness' },
    ];

  const youthTag = content('seva-kendra-youth-skill', 'tag') ?? 'Youth Skill Development';
  const youthHeading = content('seva-kendra-youth-skill', 'heading') ?? 'Training & Career Development Programmes';
  const youthStats =
    content('seva-kendra-youth-skill', 'stats') ?? [
      { value: '500+', label: 'Youth Trained' },
      { value: '80+', label: 'Skill Workshops' },
      { value: '40+', label: 'Training Sessions' },
      { value: '100+', label: 'Career Opportunities' },
    ];

  const donationTag = content('seva-kendra-donation', 'tag') ?? 'Mission Sevak Niwas';
  const donationTitle = content('seva-kendra-donation', 'title') ?? 'Providing Shelter & Support';
  const donationText =
    content('seva-kendra-donation', 'description') ??
    'Your donation provides housing, care and dignity to visually impaired individuals and families in need.';

  const testimonialHeading = content('seva-kendra-testimonials', 'heading') ?? 'What Our Donors Say';
  const testimonials =
    content('seva-kendra-testimonials', 'items') ?? [
      { quote: 'Being Sevak is doing incredible work for visually impaired and needy families. Proud to support this mission.', name: 'Riya Sharma' },
      { quote: 'Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity.', name: 'Rahul Mehta' },
      { quote: 'Every donation creates real change. Their food distribution drives truly touch lives.', name: 'Anjali Verma' },
    ];

  return (
    <>
      <style>{`
        .sevak-seva-kendra * { margin: 0; padding: 0; box-sizing: border-box; }
        .sevak-seva-kendra { font-family: 'Montserrat', sans-serif; background: #f4f6f8; color: #1d2b36; overflow-x: hidden; }
        .sevak-seva-kendra img { width: 100%; display: block; }

        .sevak-seva-kendra .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 10px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .sevak-seva-kendra .tax-box h1 { font-size: 28px; font-weight: 700; position: relative; z-index: 2; }
        .sevak-seva-kendra .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .sevak-seva-kendra .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: sskShine 6s linear infinite;
        }
        .sevak-seva-kendra .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes sskShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .sevak-seva-kendra .hero-section {
          width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center;
          gap: 40px; padding: 50px 5%; overflow: hidden;
          background: radial-gradient(circle at top left, #dff6ff 0%, transparent 35%),
          radial-gradient(circle at bottom right, #c7ecff 0%, transparent 35%),
          linear-gradient(135deg, #ffffff, #eef8ff);
        }
        .sevak-seva-kendra .hero-left { flex: 1; max-width: 520px; }
        .sevak-seva-kendra .tag { color: #00a3da; display: inline-block; margin-bottom: 25px; font-weight: 800; font-size: 30px; letter-spacing: 1px; background: none; }
        .sevak-seva-kendra .hero-left h1 { font-size: 62px; line-height: 1.1; font-weight: 800; margin-bottom: 22px; color: #1c2b36; }
        .sevak-seva-kendra .hero-left h1 span { color: #00a3da; }
        .sevak-seva-kendra .hero-left p { font-size: 18px; line-height: 1.9; color: #51606d; margin-bottom: 30px; }
        .sevak-seva-kendra .hero-buttons { display: flex; gap: 15px; flex-wrap: wrap; }
        .sevak-seva-kendra .primary-btn {
          text-decoration: none; padding: 14px 26px; border-radius: 50px; font-size: 18px; font-weight: 700;
          transition: 0.3s; background: #00a3da; color: #fff; box-shadow: 0 15px 35px rgba(0,163,218,0.35);
        }
        .sevak-seva-kendra .primary-btn:hover { transform: translateY(-4px); }
        .sevak-seva-kendra .hero-right {
          flex: 1; display: flex; justify-content: center; align-items: center;
          position: relative; max-width: 500px; min-height: 500px;
        }
        .sevak-seva-kendra .main-image-card {
          width: 100%; max-width: 480px; position: relative; z-index: 2;
          transform: perspective(1000px) rotate(-3deg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15), 0 10px 25px rgba(0,163,218,0.12);
          transition: 0.6s ease; animation: sskFloatCard 4s ease-in-out infinite;
        }
        .sevak-seva-kendra .main-image-card img { width: 100%; display: block; object-fit: cover; border-radius: 30px; transition: 0.6s ease; }
        .sevak-seva-kendra .main-image-card:hover { transform: perspective(1000px) rotate(0deg) scale(1.05); box-shadow: 0 40px 90px rgba(0,0,0,0.25); }
        @keyframes sskFloatCard {
          0% { transform: perspective(1000px) rotate(-3deg) translateY(0); }
          50% { transform: perspective(1000px) rotate(-3deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotate(-3deg) translateY(0); }
        }
        .sevak-seva-kendra .floating-card {
          position: absolute; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
          padding: 15px 18px; border-radius: 20px; min-width: 160px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.10); z-index: 5; animation: sskFloat 3s ease-in-out infinite;
        }
        .sevak-seva-kendra .floating-card h3 { color: #00a3da; font-size: 34px; margin-bottom: 4px; }
        .sevak-seva-kendra .floating-card p { font-size: 12px; font-weight: 600; color: #51606d; }
        .sevak-seva-kendra .card1 { top: -10px; left: -10px; }
        .sevak-seva-kendra .card2 { bottom: -10px; right: -10px; }
        @keyframes sskFloat { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

        .sevak-seva-kendra .about-section { width: 100%; display: flex; align-items: center; justify-content: center; gap: 45px; padding: 45px 5%; background: #fff; }
        .sevak-seva-kendra .about-image { position: relative; }
        .sevak-seva-kendra .about-image img { border-radius: 35px; height: 450px; object-fit: cover; box-shadow: 0 25px 50px rgba(0,0,0,0.12); transition: 0.5s ease; }
        .sevak-seva-kendra .about-image img:hover { transform: scale(1.03); box-shadow: 0 40px 90px rgba(0,0,0,0.2); }
        .sevak-seva-kendra .about-image::before {
          content: ""; position: absolute; top: 20px; left: 20px; width: 100%; height: 100%;
          border-radius: 35px; background: linear-gradient(135deg, rgba(0,163,218,0.2), transparent);
          filter: blur(12px); z-index: -1;
        }
        .sevak-seva-kendra .about-content { flex: 1; max-width: 520px; }
        .sevak-seva-kendra .mini-title { color: #00a3da; font-weight: 700; font-size: 30px; margin-bottom: 18px; display: block; }
        .sevak-seva-kendra .about-content h2 { font-size: 42px; line-height: 1.2; margin-bottom: 22px; }
        .sevak-seva-kendra .about-content h2 span { color: #00a3da; }
        .sevak-seva-kendra .about-content p { font-size: 15px; line-height: 1.8; color: #51606d; }
        .sevak-seva-kendra .feature-boxes { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 28px; }
        .sevak-seva-kendra .feature-card {
          background: #f7fcff; padding: 20px; border-radius: 22px; transition: 0.3s ease;
          cursor: pointer; flex: 1 1 calc(50% - 15px); min-width: 160px;
        }
        .sevak-seva-kendra .feature-card:hover { background: #00a3da; }
        .sevak-seva-kendra .feature-card:hover h4, .sevak-seva-kendra .feature-card:hover p, .sevak-seva-kendra .feature-card:hover .icon { color: #fff; }
        .sevak-seva-kendra .icon { font-size: 28px; margin-bottom: 12px; }
        .sevak-seva-kendra .feature-card h4 { font-size: 17px; margin-bottom: 8px; }
        .sevak-seva-kendra .feature-card p { font-size: 13px; }

        .sevak-seva-kendra .impact-section {
          width: 100%; padding: 60px 5%;
          background: radial-gradient(circle at top left, #dff6ff 0%, transparent 35%),
          linear-gradient(135deg, #f4f6f8, #eef8ff);
        }
        .sevak-seva-kendra .section-heading { text-align: center; margin-bottom: 35px; }
        .sevak-seva-kendra .section-heading span { color: #00a3da; font-weight: 800; font-size: 20px; }
        .sevak-seva-kendra .section-heading h2 { font-size: 40px; margin-top: 10px; }
        .sevak-seva-kendra .impact-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
        .sevak-seva-kendra .impact-card {
          background: #fff; padding: 28px 18px; text-align: center; border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06); transition: 0.3s ease; position: relative; overflow: hidden; cursor: pointer;
        }
        .sevak-seva-kendra .impact-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1;
        }
        .sevak-seva-kendra .impact-card:hover::before { height: 100%; }
        .sevak-seva-kendra .impact-card h3, .sevak-seva-kendra .impact-card p { position: relative; z-index: 2; transition: 0.3s ease; }
        .sevak-seva-kendra .impact-card:hover h3, .sevak-seva-kendra .impact-card:hover p { color: #fff; }

        .sevak-seva-kendra .techvision-wrap { width: 100%; padding: 70px 7%; background: #fff; overflow: hidden; }
        .sevak-seva-kendra .techvision-container { display: flex; align-items: center; justify-content: space-between; gap: 70px; flex-wrap: wrap; }
        .sevak-seva-kendra .techvision-image-side { flex: 1; min-width: 320px; }
        .sevak-seva-kendra .techvision-image-box {
          position: relative; border-radius: 35px; overflow: hidden; background: #fff;
          box-shadow: 0 25px 60px rgba(0,0,0,0.12), 0 12px 30px rgba(0,163,218,0.18); transition: 0.5s;
        }
        .sevak-seva-kendra .techvision-image-box:hover { transform: translateY(-10px) rotate(-1deg); }
        .sevak-seva-kendra .techvision-image-box img { width: 100%; height: 620px; object-fit: cover; display: block; }
        .sevak-seva-kendra .techvision-content-side { flex: 1; min-width: 320px; }
        .sevak-seva-kendra .techvision-mini-title {
          display: inline-block; padding: 10px 22px; background: #00a3da; color: #fff; border-radius: 60px;
          font-size: 20px; font-weight: 700; margin-bottom: 20px;
          transition: none;
        }
        .sevak-seva-kendra .techvision-mini-title:hover {
          background: #00a3da; color: #fff;
        }
        .sevak-seva-kendra .techvision-content-side h3 { font-size: 38px; line-height: 1.1; color: #111; margin-bottom: 28px; font-weight: 800; }
        .sevak-seva-kendra .techvision-content-side p { font-size: 17px; line-height: 1.9; color: #555; margin-bottom: 18px; }
        .sevak-seva-kendra .techvision-feature-grid { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 35px; }
        .sevak-seva-kendra .techvision-feature-card {
          flex: 1; min-width: 180px; background: #fff; border: 1px solid #e8f6fc; padding: 28px 22px;
          border-radius: 24px; transition: 0.4s;
          box-shadow: 0 12px 30px rgba(0,0,0,0.05), 0 8px 20px rgba(0,163,218,0.08);
        }
        .sevak-seva-kendra .techvision-feature-card:hover { transform: translateY(-8px); }
        .sevak-seva-kendra .techvision-feature-card h3 { font-size: 22px; color: #00a3da; margin-bottom: 10px; font-weight: 700; }
        .sevak-seva-kendra .techvision-feature-card span { font-size: 15px; color: #666; line-height: 1.7; }
        .sevak-seva-kendra .techvision-btn {
          display: inline-block; margin-top: 40px; padding: 16px 35px; background: #00a3da; color: #fff;
          text-decoration: none; border-radius: 60px; font-weight: 600; transition: 0.4s;
          box-shadow: 0 15px 30px rgba(0,163,218,0.25);
        }
        .sevak-seva-kendra .techvision-btn:hover { background: #008dbd; transform: translateY(-5px); }

        .sevak-seva-kendra .sevak-donation {
          width: 100%; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 50px 4%; min-height: 120px; display: flex; align-items: center;
        }
        .sevak-seva-kendra .sevak-donation-content { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 120px; }
        .sevak-seva-kendra .sevak-left { display: flex; flex-direction: column; gap: 4px; }
        .sevak-seva-kendra .sevak-tag { font-size: 20px; font-weight: 700; color: #fff; }
        .sevak-seva-kendra .sevak-title { font-size: 41px; margin: 0; line-height: 1.2; color: #fff; }
        .sevak-seva-kendra .sevak-desc { font-size: 15px; margin: 0; color: #fff; }
        .sevak-seva-kendra .sevak-btn {
          display: inline-block; padding: 15px 36px; background: #00a3da; color: #fff; text-decoration: none;
          border-radius: 6px; font-weight: 700; font-size: 16px; white-space: nowrap; transition: 0.3s;
        }
        .sevak-seva-kendra .sevak-btn:hover { transform: translateY(-2px); }

        .sevak-seva-kendra .testimonial-section { padding: 50px 5%; }
        .sevak-seva-kendra .section-header { text-align: center; margin-bottom: 40px; }
        .sevak-seva-kendra .section-header h2 { font-size: 42px; margin: 18px 0; }
        .sevak-seva-kendra .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .sevak-seva-kendra .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden; position: relative;
        }
        .sevak-seva-kendra .testimonial-card:hover { transform: translateY(-10px); }
        .sevak-seva-kendra .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .sevak-seva-kendra .testimonial-card h4 { color: #00a3da; }
        .sevak-seva-kendra .testimonial-card h4, .sevak-seva-kendra .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .sevak-seva-kendra .testimonial-card:hover h4, .sevak-seva-kendra .testimonial-card:hover p { color: #fff !important; }
        .sevak-seva-kendra .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .sevak-seva-kendra .testimonial-card:hover::before { height: 100%; }
        .sevak-seva-kendra .testimonial-card > * { position: relative; z-index: 2; }

        @media (max-width: 991px) {
          .sevak-seva-kendra .hero-section, .sevak-seva-kendra .about-section { flex-direction: column; text-align: center; }
          .sevak-seva-kendra .hero-left, .sevak-seva-kendra .about-content { max-width: 100%; }
          .sevak-seva-kendra .hero-buttons { justify-content: center; }
          .sevak-seva-kendra .hero-left h1 { font-size: 46px; }
          .sevak-seva-kendra .about-content h2, .sevak-seva-kendra .section-heading h2, .sevak-seva-kendra .techvision-content-side h3 { font-size: 34px; }
          .sevak-seva-kendra .impact-grid { grid-template-columns: repeat(2,1fr); }
          .sevak-seva-kendra .feature-boxes { flex-direction: column; }
          .sevak-seva-kendra .techvision-container { flex-direction: column; }
          .sevak-seva-kendra .techvision-image-box img { height: 500px; }
          .sevak-seva-kendra .sevak-donation-content { flex-direction: column; text-align: center; gap: 20px; min-height: auto; }
          .sevak-seva-kendra .sevak-title { font-size: 34px; }
          .sevak-seva-kendra .testimonial-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .sevak-seva-kendra .hero-left h1 { font-size: 38px; }
          .sevak-seva-kendra .hero-buttons { flex-direction: column; }
          .sevak-seva-kendra .hero-right { min-height: auto; padding-bottom: 40px; }
          .sevak-seva-kendra .main-image-card { max-width: 100%; }
          .sevak-seva-kendra .floating-card { position: absolute; padding: 5px 8px; }
          .sevak-seva-kendra .floating-card h3 { font-size: 14px; line-height: 1.1; }
          .sevak-seva-kendra .floating-card p { font-size: 10px; margin: 0; }
          .sevak-seva-kendra .techvision-wrap { padding: 50px 5%; }
          .sevak-seva-kendra .techvision-content-side h3 { font-size: 28px; }
          .sevak-seva-kendra .techvision-image-box img { height: 350px; }
          .sevak-seva-kendra .sevak-title { font-size: 28px; }
        }
      `}</style>

      <div className="sevak-seva-kendra">
        <section className="tax-box">
          <h1>{taxTitle}</h1>
        </section>

        <section className="hero-section">
          <div className="hero-left">
            <span className="tag">{heroTag}</span>
            <h1>
              {heroLine1} <span>{heroHighlight}</span><br />
              {heroLine2}
            </h1>
            <p>
              {heroText}
            </p>
            <div className="hero-buttons">
              <a href="#donate" className="primary-btn">Support Sevak Niwas</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="main-image-card">
              <img src={heroImage} alt="Sevak Niwas Kendra" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
              {heroStats.map((stat, i) => (
                <div className={`floating-card card${i + 1}`} key={i}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-image">
            <img src={libraryImage} alt="Library" loading="lazy" decoding="async" width="800" height="600" />
          </div>
          <div className="about-content">
            <span className="mini-title">{libraryTag}</span>
            <h2>{libraryLine1} <span>{libraryHighlight}</span></h2>
            <p>
              {libraryText}
            </p>
            <div className="feature-boxes">
              {libraryFeatures.map((f, i) => (
                <div className="feature-card" key={i}>
                  <div className="icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="impact-section" id="impact">
          <div className="section-heading">
            <span>{computerTag}</span>
            <h2>{computerHeading}</h2>
          </div>
          <div className="impact-grid">
            {computerStats.map((s, i) => (
              <div className="impact-card" key={i}><h3>{s.value}</h3><p>{s.label}</p></div>
            ))}
          </div>
        </section>

        <section className="techvision-wrap">
          <div className="techvision-container">
            <div className="techvision-image-side">
              <div className="techvision-image-box">
                <img src={aiImage} alt="AI Digital Centre" loading="lazy" decoding="async" width="800" height="600" />
              </div>
            </div>
            <div className="techvision-content-side">
              <span className="techvision-mini-title">{aiMiniTitle}</span>
              <h3>{aiHeading}</h3>
              <p>
                {aiText1}
              </p>
              <p>
                {aiText2}
              </p>
              <div className="techvision-feature-grid">
                {aiFeatures.map((f, i) => (
                  <div className="techvision-feature-card" key={i}><h3>{f.title}</h3><span>{f.description}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-content">
            <span className="mini-title">{physioTag}</span>
            <h2>{physioLine1} <span>{physioHighlight}</span></h2>
            <p>
              {physioText}
            </p>
            <div className="feature-boxes">
              {physioFeatures.map((f, i) => (
                <div className="feature-card" key={i}>
                  <div className="icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="about-image">
            <img src={physioImage} alt="Physiotherapy" loading="lazy" decoding="async" width="800" height="600" />
          </div>
        </section>

        <section className="impact-section">
          <div className="section-heading">
            <span>{womenTag}</span>
            <h2>{womenHeading}</h2>
          </div>
          <div className="impact-grid">
            {womenStats.map((s, i) => (
              <div className="impact-card" key={i}><h3>{s.value}</h3><p>{s.label}</p></div>
            ))}
          </div>
        </section>

        <section className="techvision-wrap">
          <div className="techvision-container">
            <div className="techvision-image-side">
              <div className="techvision-image-box">
                <img src={rasoiImage} alt="Rasoi Ghar" loading="lazy" decoding="async" width="800" height="600" />
              </div>
            </div>
            <div className="techvision-content-side">
              <span className="techvision-mini-title">{rasoiMiniTitle}</span>
              <h3>{rasoiHeading}</h3>
              <p>
                {rasoiText1}
              </p>
              <p>
                {rasoiText2}
              </p>
              <div className="techvision-feature-grid">
                {rasoiFeatures.map((f, i) => (
                  <div className="techvision-feature-card" key={i}><h3>{f.title}</h3><span>{f.description}</span></div>
                ))}
              </div>
              <Link to="/donate" className="techvision-btn">Support The Mission</Link>
            </div>
          </div>
        </section>

        <section className="impact-section">
          <div className="section-heading">
            <span>{youthTag}</span>
            <h2>{youthHeading}</h2>
          </div>
          <div className="impact-grid">
            {youthStats.map((s, i) => (
              <div className="impact-card" key={i}><h3>{s.value}</h3><p>{s.label}</p></div>
            ))}
          </div>
        </section>

        <section className="sevak-donation" id="donate">
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

