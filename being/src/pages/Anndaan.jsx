import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';

export default function Anndaan() {
  const content = usePageContent('anndaan');

  const bannerImage = content('anndaan-hero', 'image') ?? '/images/anndan.jpeg';
  const bannerHeading = content('anndaan-hero', 'heading') ?? 'Annदान';
  const bannerTagline = content('anndaan-hero', 'tagline') ?? 'Serving Humanity With Love & Food';

  const introMiniTitle = content('anndaan-intro', 'miniTitle') ?? 'Being Sevak Charitable Trust';
  const introLine1 = content('anndaan-intro', 'headingLine1') ?? 'Nourishing Lives';
  const introLine2 = content('anndaan-intro', 'headingLine2') ?? 'Through Every Meal & Ration kit';
  const introText =
    content('anndaan-intro', 'description') ??
    'From hot meals to nutrition kits, every initiative is a step toward fighting hunger and spreading humanity with dignity, love, and care.';

  const kitTag = content('anndaan-annapurna-kit', 'tag') ?? 'SUPPORT KITS';
  const kitHeading = content('anndaan-annapurna-kit', 'heading') ?? 'Annapurna Kit';
  const kitText1 =
    content('anndaan-annapurna-kit', 'text1') ??
    'Annapurna Kits are thoughtfully prepared with essential grocery items such as rice, flour, pulses, oil, sugar, and daily nutrition supplies to support families facing difficult times with dignity and care.';
  const kitText2 =
    content('anndaan-annapurna-kit', 'text2') ??
    'These kits are distributed during emergency relief drives, poverty support initiatives, and community welfare programs to ensure that no family sleeps hungry.';
  const kitText3 =
    content('anndaan-annapurna-kit', 'text3') ??
    'The kits are also extended to dedicated life supporters and humanitarian contributors who continuously stand with society during times of need, as a gesture of gratitude and community solidarity.';
  const kitImages =
    content('anndaan-annapurna-kit', 'images') ?? [
      { src: '/images/a1.jpeg', alt: '' },
      { src: '/images/a4.jpeg', alt: '' },
      { src: '/images/a3.jpg', alt: '' },
      { src: '/images/a2.jpg', alt: '' },
    ];

  const snackTag = content('anndaan-snack-distribution', 'tag') ?? 'COMMUNITY CARE';
  const snackHeading = content('anndaan-snack-distribution', 'heading') ?? 'Snack Distribution';
  const snackText =
    content('anndaan-snack-distribution', 'text') ??
    'Through our Snack Distribution Drive, we provide wafers, biscuits, chocolates, and other nutritious snacks to children and families living in slum areas. This initiative aims to bring joy, support, and care to underprivileged communities while ensuring that every child receives a small treat filled with happiness and hope.';
  const snackImages =
    content('anndaan-snack-distribution', 'images') ?? [
      { src: '/images/snk1.jpeg', alt: '' },
      { src: '/images/snk2.jpeg', alt: '' },
      { src: '/images/snk3.jpeg', alt: '' },
      { src: '/images/snk4.jpeg', alt: '' },
    ];

  const mealTag = content('anndaan-sevak-meal-drive', 'tag') ?? 'HUMANITY DRIVE';
  const mealHeading = content('anndaan-sevak-meal-drive', 'heading') ?? 'Sevak Meal Drive';
  const mealText1 =
    content('anndaan-sevak-meal-drive', 'text1') ??
    'Through the Sevak Nutrition Drive, we provide nutritious food support to school children by adding healthy ingredients like milk, pulses, cereals, and essential nutrition supplements to their daily meals.';
  const mealText2 =
    content('anndaan-sevak-meal-drive', 'text2') ??
    "Our mission is to improve children's health, energy, and overall development by ensuring they receive proper nutrition for a brighter and healthier future.";
  const mealPoints =
    content('anndaan-sevak-meal-drive', 'points') ?? [
      'Fresh & Hygienic Food',
      'Community Volunteer Participation',
      'Serving with Love & Respect',
    ];
  const mealImages =
    content('anndaan-sevak-meal-drive', 'images') ?? [
      { src: '/images/roti1.jpg', alt: '' },
      { src: '/images/roti2.jpg', alt: '' },
      { src: '/images/roti3.jpg', alt: '' },
      { src: '/images/roti4.jpg', alt: '' },
    ];

  const rotiTag = content('anndaan-roti-drive', 'tag') ?? 'FOOD SERVICE';
  const rotiHeading = content('anndaan-roti-drive', 'heading') ?? 'Sevak Roti Drive';
  const rotiText1 =
    content('anndaan-roti-drive', 'text1') ??
    'Our Sevak Meal Drive focuses on distributing fresh and hygienic meals to needy families, laborers, senior citizens, and homeless individuals. Through this initiative, we ensure that no person sleeps hungry.';
  const rotiText2 =
    content('anndaan-roti-drive', 'text2') ??
    'Every meal served carries compassion, hope, and humanity. Volunteers actively participate in meal preparation, packaging, and distribution.';
  const rotiStats =
    content('anndaan-roti-drive', 'stats') ?? [
      { value: '10K+', label: 'Meals Distributed' },
      { value: 'Daily', label: 'Community Support' },
    ];
  const rotiImages =
    content('anndaan-roti-drive', 'images') ?? [
      { src: '/images/meal1.jpg', alt: '' },
      { src: '/images/meal2.jpg', alt: '' },
      { src: '/images/meal3.jpg', alt: '' },
      { src: '/images/meal4.jpg', alt: '' },
    ];

  const festiveTag = content('anndaan-festive-care', 'tag') ?? 'FESTIVE CARE';
  const festiveHeading = content('anndaan-festive-care', 'heading') ?? 'Distribution of clothes and Sweets';
  const festiveText =
    content('anndaan-festive-care', 'text') ??
    'During festivals, celebrations, and special community events, we organize lunch and sweets distribution programs to spread happiness among children, elderly people, and families in need.';
  const festiveImages =
    content('anndaan-festive-care', 'images') ?? [
      { src: '/images/shi1.jpg', alt: '' },
      { src: '/images/shi2.jpg', alt: '' },
      { src: '/images/shi3.jpg', alt: '' },
      { src: '/images/shi5.jpg', alt: '' },
    ];

  const summerTag = content('anndaan-summer-drive', 'tag') ?? 'COMMUNITY CARE';
  const summerHeading = content('anndaan-summer-drive', 'heading') ?? 'Sevak Summer Drive';
  const summerText =
    content('anndaan-summer-drive', 'text') ??
    'We also provide refreshing buttermilk to help people stay hydrated and protected from the extreme heat, while promoting care, compassion, and community well-being.';
  const summerImages =
    content('anndaan-summer-drive', 'images') ?? [
      { src: '/images/snack2.jpeg', alt: '' },
      { src: '/images/snack3.jpeg', alt: '' },
      { src: '/images/snack7.jpeg', alt: '' },
      { src: '/images/snack8.jpeg', alt: '' },
      { src: '/images/snack9.jpeg', alt: '' },
    ];

  const thaliTag = content('anndaan-annapurna-thali', 'tag') ?? 'FOOD & NUTRITION SUPPORT';
  const thaliHeading = content('anndaan-annapurna-thali', 'heading') ?? 'Annapurna Thali';
  const thaliText1 =
    content('anndaan-annapurna-thali', 'text1') ??
    'The Annapurna Thali initiative is dedicated to serving nutritious, freshly prepared meals to underprivileged children, women, elderly individuals, and families struggling with food insecurity.';
  const thaliText2 =
    content('anndaan-annapurna-thali', 'text2') ??
    'Each thali is designed to provide a balanced diet including essential nutrients, helping improve health, reduce hunger, and restore dignity to those in need.';
  const thaliMiniCards =
    content('anndaan-annapurna-thali', 'miniCards') ?? [
      { title: 'Nutritious', description: 'Balanced Meals' },
      { title: 'Hunger-Free', description: 'Community Support' },
    ];
  const thaliImages =
    content('anndaan-annapurna-thali', 'images') ?? [
      { src: '/images/Thali1.jpg', alt: 'Annapurna Thali Meal Distribution' },
      { src: '/images/Thali2.jpg', alt: 'Food Distribution Drive' },
      { src: '/images/Thali3.jpg', alt: 'Community Meal Service' },
      { src: '/images/Thali4.jpg', alt: 'Volunteers Serving Food' },
    ];

  const testimonialTag = content('anndaan-testimonials', 'tag') ?? 'DONOR TESTIMONIALS';
  const testimonialHeading = content('anndaan-testimonials', 'heading') ?? 'What Supporters Say';
  const testimonials =
    content('anndaan-testimonials', 'items') ?? [
      { quote: '"Aadhar initiative is doing amazing work by helping needy families with food support."', name: 'Riya Sharma' },
      { quote: '"Very transparent and impactful work. Happy to support this mission."', name: 'Rahul Mehta' },
      { quote: '"They truly bring hope to families struggling for basic needs."', name: 'Anjali Verma' },
    ];

  return (
    <>
      <style>{`
        .anndaan-page * { margin: 0; padding: 0; box-sizing: border-box; }
        .anndaan-page { font-family: 'Montserrat', sans-serif; background: #fff; color: #111827; overflow-x: hidden; }
        .anndaan-page img { width: 100%; display: block; }
        .anndaan-page section { overflow: hidden; }

        .anndaan-page .anndaan-hero-banner { position: relative; width: 100%; height: 700px; overflow: hidden; }
        .anndaan-page .anndaan-hero-banner img { width: 100%; height: 700px; object-fit: cover; display: block; }
        .anndaan-page .anndaan-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.55)); }
        .anndaan-page .anndaan-content {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          text-align: center; width: 100%; padding: 20px; z-index: 5;
        }
        .anndaan-page .anndaan-content h1 { font-size: 120px; color: #fff; font-weight: 900; letter-spacing: 5px; text-shadow: 0 15px 35px rgba(0,0,0,0.4); animation: adZoomfade 1.5s ease; }
        .anndaan-page .anndaan-content p { color: #fff; font-size: 26px; margin-top: 15px; letter-spacing: 2px; text-shadow: 0 10px 25px rgba(0,0,0,0.4); }
        @keyframes adZoomfade { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }

        .anndaan-page .sevak-food-main-wrap { width: 100%; background: #fff; }
        .anndaan-page .annaseva-hero-zone {
          position: relative; min-height: 100vh; display: flex; justify-content: center; align-items: center;
          text-align: center; padding: 80px 8% 50px; overflow: hidden;
          background: linear-gradient(to bottom right, #ffffff, #f3fbff);
        }
        .anndaan-page .annaseva-hero-content { max-width: 900px; position: relative; z-index: 5; }
        .anndaan-page .annaseva-mini-title {
          display: inline-block; background: #00a3da15; color: #00a3da; padding: 12px 25px;
          border-radius: 50px; font-weight: 700; letter-spacing: 2px; margin-bottom: 25px;
        }
        .anndaan-page .annaseva-hero-content h1 { font-size: 75px; line-height: 1.1; font-weight: 900; color: #111; margin-bottom: 25px; }
        .anndaan-page .annaseva-hero-content p { font-size: 20px; line-height: 1.8; color: #555; margin-bottom: 40px; }
        .anndaan-page .annaseva-hero-buttons { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .anndaan-page .annaseva-btn-main {
          padding: 18px 38px; border-radius: 60px; text-decoration: none; font-weight: 700; transition: 0.4s;
          background: #00a3da; color: #fff; box-shadow: 0 15px 40px #00a3da50;
        }
        .anndaan-page .annaseva-btn-main:hover { transform: translateY(-8px); }
        .anndaan-page .annaseva-floating-circle { position: absolute; border-radius: 50%; background: #00a3da12; animation: adFloatmove 8s infinite ease-in-out; }
        .anndaan-page .annaseva-floating-circle.one { width: 320px; height: 320px; top: -100px; left: -80px; }
        .anndaan-page .annaseva-floating-circle.two { width: 250px; height: 250px; bottom: 40px; right: -50px; }
        .anndaan-page .annaseva-floating-circle.three { width: 180px; height: 180px; bottom: 120px; left: 20%; }
        @keyframes adFloatmove { 50% { transform: translateY(-30px); } }

        .anndaan-page .kitcare-wrapper,
        .anndaan-page .rotiseva-zone,
        .anndaan-page .mealwave-section,
        .anndaan-page .snackdrive-container,
        .anndaan-page .nutritioncare-wrap {
          padding: 110px 8%; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .anndaan-page .kitcare-wrapper { padding-top: 40px; padding-bottom: 40px; }
        .anndaan-page .rotiseva-zone { padding: 30px 8%; }
        .anndaan-page .mealwave-section { padding: 60px 8%; }
        .anndaan-page .snackdrive-container { padding: 40px 8%; }
        .anndaan-page .nutritioncare-wrap { padding: 30px 8%; }
        .anndaan-page .kitcare-tag, .anndaan-page .rotiseva-tag, .anndaan-page .mealwave-tag,
        .anndaan-page .snackdrive-tag, .anndaan-page .nutritioncare-tag, .anndaan-page .sweetmeal-tag {
          display: inline-block; padding: 10px 22px; background: #00a3da15; color: #00a3da;
          border-radius: 40px; font-weight: 700; margin-bottom: 25px;
        }
        .anndaan-page .kitcare-content h2, .anndaan-page .rotiseva-content h2, .anndaan-page .mealwave-left h2,
        .anndaan-page .snackdrive-content h2, .anndaan-page .nutritioncare-content h2, .anndaan-page .sweetmeal-top h2 {
          font-size: 52px; margin-bottom: 25px; color: #111; line-height: 1.2;
        }
        .anndaan-page .kitcare-content p, .anndaan-page .rotiseva-content p, .anndaan-page .mealwave-left p,
        .anndaan-page .snackdrive-content p, .anndaan-page .nutritioncare-content p, .anndaan-page .sweetmeal-top p {
          color: #666; line-height: 1.9; margin-bottom: 20px; font-size: 17px;
        }

        .anndaan-page .kitcare-gallery, .anndaan-page .rotiseva-gallery, .anndaan-page .mealwave-gallery,
        .anndaan-page .sweetmeal-grid, .anndaan-page .snackdrive-images, .anndaan-page .nutritioncare-gallery {
          display: grid; gap: 20px;
        }
        .anndaan-page .kitcare-gallery { grid-template-columns: repeat(2,1fr); }
        .anndaan-page .rotiseva-gallery { grid-template-columns: 1fr 1fr; }
        .anndaan-page .mealwave-gallery { grid-template-columns: 1fr 1fr; }
        .anndaan-page .sweetmeal-grid { grid-template-columns: repeat(4,1fr); margin-top: 50px; }
        .anndaan-page .snackdrive-container { grid-template-columns: 1fr; text-align: center; }
        .anndaan-page .snackdrive-content { max-width: 800px; margin: 0 auto; }
        .anndaan-page .snackdrive-images { grid-template-columns: repeat(3,1fr); }
        .anndaan-page .nutritioncare-gallery { grid-template-columns: 1fr 1fr; }

        .anndaan-page .kitcare-gallery img, .anndaan-page .rotiseva-gallery img, .anndaan-page .mealwave-gallery img,
        .anndaan-page .sweetmeal-grid img, .anndaan-page .snackdrive-images img, .anndaan-page .nutritioncare-gallery img {
          width: 100%; height: 260px; object-fit: cover; border-radius: 30px; transition: 0.5s;
          box-shadow: 0 20px 45px rgba(0,0,0,0.08);
        }
        .anndaan-page .kitcare-gallery img:hover, .anndaan-page .rotiseva-gallery img:hover, .anndaan-page .mealwave-gallery img:hover,
        .anndaan-page .sweetmeal-grid img:hover, .anndaan-page .snackdrive-images img:hover, .anndaan-page .nutritioncare-gallery img:hover {
          transform: translateY(-12px) scale(1.03);
        }

        .anndaan-page .mealwave-highlight-box { display: flex; justify-content: center; gap: 20px; flex-wrap: nowrap; }
        .anndaan-page .mealwave-highlight-box div {
          width: 220px; min-height: 180px; padding: 35px 25px; border-radius: 25px; background: #fff;
          transition: all 0.3s ease; cursor: pointer; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
        }
        .anndaan-page .mealwave-highlight-box div:hover { background: #00a3da; }
        .anndaan-page .mealwave-highlight-box div:hover h3, .anndaan-page .mealwave-highlight-box div:hover span { color: #fff; }

        .anndaan-page .rotiseva-content ul { margin-top: 20px; }
        .anndaan-page .rotiseva-content ul li {
          margin-bottom: 15px; list-style: none; font-weight: 600; color: #222;
          position: relative; padding-left: 30px;
        }
        .anndaan-page .rotiseva-content ul li::before { content: '✓'; position: absolute; left: 0; color: #00a3da; font-size: 20px; }

        .anndaan-page .kitcare-btn {
          display: flex; justify-content: center; align-items: center; margin-top: 20px; margin-left: auto; margin-right: auto; width: fit-content; background: #00a3da; color: #fff; text-decoration: none;
          padding: 16px 10px; border-radius: 8px; font-weight: 700; text-align: center;
          box-shadow: 0 15px 35px #00a3da45; transition: 0.4s;
        }
        .anndaan-page .kitcare-btn:hover { transform: translateY(-7px); }

        .anndaan-page .sweetmeal-section { padding: 20px 8% 40px; background: linear-gradient(to bottom, #f9fdff, #ffffff); }
        .anndaan-page .sweetmeal-top { text-align: center; max-width: 900px; margin: auto; }

        .anndaan-page .nutritioncare-card-row { display: flex; gap: 20px; margin-top: 30px; flex-wrap: wrap; }
        .anndaan-page .nutrition-mini-card { background: #fff; border-radius: 25px; padding: 30px 50px 30px 30px; min-width: 300px; box-shadow: 0 15px 40px rgba(0,0,0,0.06); }
        .anndaan-page .nutrition-mini-card h3 { color: #00a3da; font-size: 32px; margin-bottom: 10px; }

        .anndaan-page .testimonial-section { padding: 25px 5% 25px; }
        .anndaan-page .section-header { text-align: center; margin-bottom: 0; }
        .anndaan-page .section-header span { color: #00a3da; font-weight: 700; letter-spacing: 2px; }
        .anndaan-page .section-header h2 { font-size: 42px; margin: 18px 0; }
        .anndaan-page .testimonial-grid {
          width: 100%; max-width: 1200px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; align-items: stretch;
        }
        .anndaan-page .testimonial-card {
          width: 100%; background: #fff; padding: 30px; border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.07); transition: 0.4s; overflow: hidden; position: relative;
        }
        .anndaan-page .testimonial-card:hover { transform: translateY(-10px); }
        .anndaan-page .testimonial-card p { line-height: 2; color: #6c7d8e; margin-bottom: 25px; }
        .anndaan-page .testimonial-card h4 { color: #00a3da; }
        .anndaan-page .testimonial-card h4, .anndaan-page .testimonial-card p { position: relative; z-index: 3; transition: 0.4s ease; }
        .anndaan-page .testimonial-card:hover h4, .anndaan-page .testimonial-card:hover p { color: #fff !important; }
        .anndaan-page .testimonial-card::before {
          content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 0%;
          background: #00a3da; transition: 0.4s ease; z-index: 1; border-radius: 28px;
        }
        .anndaan-page .testimonial-card:hover::before { height: 100%; }
        .anndaan-page .testimonial-card > * { position: relative; z-index: 2; }

        .anndaan-page .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(135deg, #00a3da, #315270); color: #fff;
          margin: 20px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .anndaan-page .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; }
        .anndaan-page .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: adShine 6s linear infinite;
        }
        .anndaan-page .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes adShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 991px) {
          .anndaan-page .anndaan-hero-banner { height: 350px; }
          .anndaan-page .anndaan-hero-banner img { height: 350px; }
          .anndaan-page .anndaan-content h1 { font-size: 60px; }
          .anndaan-page .anndaan-content p { font-size: 18px; }
          .anndaan-page .annaseva-hero-content h1 { font-size: 48px; }
          .anndaan-page .kitcare-wrapper, .anndaan-page .rotiseva-zone, .anndaan-page .mealwave-section,
          .anndaan-page .snackdrive-container, .anndaan-page .nutritioncare-wrap { grid-template-columns: 1fr; }
          .anndaan-page .sweetmeal-grid { grid-template-columns: 1fr 1fr; }
          .anndaan-page .snackdrive-images { grid-template-columns: repeat(2,1fr); }
          .anndaan-page .nutritioncare-card-row { justify-content: center; }
          .anndaan-page .nutrition-mini-card { min-width: 0; }
        }
        @media (max-width: 600px) {
          .anndaan-page .annaseva-hero-content h1 { font-size: 38px; }
          .anndaan-page .kitcare-content h2, .anndaan-page .rotiseva-content h2, .anndaan-page .mealwave-left h2,
          .anndaan-page .snackdrive-content h2, .anndaan-page .nutritioncare-content h2, .anndaan-page .sweetmeal-top h2 { font-size: 34px; }
          .anndaan-page .sweetmeal-grid { grid-template-columns: 1fr; }
          .anndaan-page .kitcare-gallery, .anndaan-page .rotiseva-gallery, .anndaan-page .mealwave-gallery,
          .anndaan-page .nutritioncare-gallery { grid-template-columns: 1fr; }
          .anndaan-page .mealwave-highlight-box { flex-wrap: wrap; }
          .anndaan-page .mealwave-highlight-box div { width: 100%; min-height: auto; padding: 20px; }
          .anndaan-page .snackdrive-images { grid-template-columns: 1fr; }
          .anndaan-page .kitcare-wrapper { padding: 40px 8%; }
          .anndaan-page .nutritioncare-card-row { justify-content: center; }
          .anndaan-page .nutrition-mini-card { min-width: 0; width: 100%; padding: 20px 30px; text-align: center; }
        }
      `}</style>

      <div className="anndaan-page">
        <section className="anndaan-hero-banner">
          <img src={bannerImage} alt="Annदान Banner" />
          <div className="anndaan-overlay"></div>
          <div className="anndaan-content">
            <br /><br />
            <h1>{bannerHeading}</h1>
            <p>{bannerTagline}</p>
          </div>
        </section>

        <section className="sevak-food-main-wrap">
          <div className="annaseva-hero-zone">
            <div className="annaseva-floating-circle one"></div>
            <div className="annaseva-floating-circle two"></div>
            <div className="annaseva-floating-circle three"></div>
            <div className="annaseva-hero-content">
              <span className="annaseva-mini-title">{introMiniTitle}</span>
              <h1>{introLine1} <br />{introLine2}</h1>
              <p>
                {introText}
              </p>
              <div className="annaseva-hero-buttons">
                <Link to="/donate" className="annaseva-btn-main">Join The Mission</Link>
              </div>
            </div>
          </div>

          <section className="kitcare-wrapper">
            <div className="kitcare-content">
              <span className="kitcare-tag">{kitTag}</span>
              <h2>{kitHeading}</h2>
              <p>{kitText1}</p>
              <p>{kitText2}</p>
              <p>{kitText3}</p>
              <Link to="/donate" className="kitcare-btn">Support Annapurna Mission</Link>
            </div>
            <div className="kitcare-gallery">
              {kitImages.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </section>

          <section className="sweetmeal-section">
            <div className="sweetmeal-top">
              <span className="sweetmeal-tag">{snackTag}</span>
              <h2>{snackHeading}</h2>
              <p>{snackText}</p>
              <Link to="/donate" className="kitcare-btn">Support our Mission</Link>
            </div>
            <div className="sweetmeal-grid">
              {snackImages.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </section>

          <section className="rotiseva-zone">
            <div className="rotiseva-gallery">
              {mealImages.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
            <div className="rotiseva-content">
              <span className="rotiseva-tag">{mealTag}</span>
              <h2>{mealHeading}</h2>
              <p>{mealText1}</p>
              <p>{mealText2}</p>
              <ul>
                {mealPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <Link to="/donate" className="kitcare-btn">Support Annapurna Mission</Link>
            </div>
          </section>

          <section className="mealwave-section">
            <div className="mealwave-left">
              <span className="mealwave-tag">{rotiTag}</span>
              <h2>{rotiHeading}</h2>
              <p>{rotiText1}</p>
              <p>{rotiText2}</p>
              <div className="mealwave-highlight-box">
                {rotiStats.map((s, i) => (
                  <div key={i}><h3>{s.value}</h3><span>{s.label}</span></div>
                ))}
              </div>
              <Link to="/donate" className="kitcare-btn">Support Annapurna Mission</Link>
            </div>
            <div className="mealwave-gallery">
              {rotiImages.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </section>

          <section className="sweetmeal-section">
            <div className="sweetmeal-top">
              <span className="sweetmeal-tag">{festiveTag}</span>
              <h2>{festiveHeading}</h2>
              <p>{festiveText}</p>
              <Link to="/donate" className="kitcare-btn">Support Annapurna Mission</Link>
            </div>
            <div className="sweetmeal-grid">
              {festiveImages.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </section>

          <section className="snackdrive-container">
            <div className="snackdrive-content">
              <span className="snackdrive-tag">{summerTag}</span>
              <h2>{summerHeading}</h2>
              <p>{summerText}</p>
              <Link to="/donate" className="kitcare-btn">Support Annapurna Mission</Link>
            </div>
            <div className="snackdrive-images">
              {summerImages.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </section>

          <section className="nutritioncare-wrap">
            <div className="nutritioncare-content">
              <span className="nutritioncare-tag">{thaliTag}</span>
              <h2>{thaliHeading}</h2>
              <p>{thaliText1}</p>
              <p>{thaliText2}</p>
              <div className="nutritioncare-card-row">
                {thaliMiniCards.map((mc, i) => (
                  <div className="nutrition-mini-card" key={i}><h3>{mc.title}</h3><p>{mc.description}</p></div>
                ))}
              </div>
              <Link to="/donate" className="kitcare-btn">Support Annapurna Thali Mission</Link>
            </div>
            <div className="nutritioncare-gallery">
              {thaliImages.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </section>
        </section>

        <br />

        <section className="testimonial-section">
          <div className="section-header">
            <span>{testimonialTag}</span>
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

        <br /><br />

        <section className="tax-box">
          <p>Get <b>50% Tax Exemption</b> on your donation under <b>Section 80G of Income Tax Act 1961</b></p>
        </section>
      </div>
    </>
  );
}
