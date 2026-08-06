import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';

export default function SevakNivash() {
  const content = usePageContent('sevak-nivash');

  const bannerImage = content('sevak-nivash-hero', 'image') ?? '/images/sevaknivash.jpeg';
  const bannerHeading = content('sevak-nivash-hero', 'heading') ?? 'Sevakनिवास';
  const bannerTagline =
    content('sevak-nivash-hero', 'tagline') ?? 'Providing Shelter, Care & Opportunities for Independent Living';

  const introMiniTitle = content('sevak-nivash-intro', 'miniTitle') ?? 'Being Sevak Charitable Trust';
  const introLine1 = content('sevak-nivash-intro', 'headingLine1') ?? 'Providing Shelter';
  const introLine2 = content('sevak-nivash-intro', 'headingLine2') ?? '& Support Through Sevak Nivas';
  const introText =
    content('sevak-nivash-intro', 'description') ??
    'Sevak Nivas offers a safe, accessible, and supportive temporary accommodation facility for visually impaired students. By providing a comfortable living environment, we help students focus on their education, skill development, personal growth, and journey toward an independent and dignified future.';

  const visionMission =
    content('sevak-nivash-vision-mission', 'items') ?? [
      {
        title: 'OUR VISION',
        description:
          'To build an inclusive society where every individual, regardless of ability or background, gets equal opportunity to learn, grow, and live with dignity.',
      },
      {
        title: 'OUR MISSION',
        description:
          'To provide education, skill training, employment opportunities, health care, and a supportive environment for overall development and independence.',
      },
    ];

  const aboutHeading = content('sevak-nivash-about', 'heading') ?? 'Sevak Niwas';
  const aboutText =
    content('sevak-nivash-about', 'text') ??
    'Sevak Seva Kendra is a one-stop hub with 12 dedicated facilities aimed at education, skill development, employment, wellness, and independent living. We envision a society where every individual is respected, empowered, and included.';
  const facilitiesTitle = content('sevak-nivash-about', 'facilitiesTitle') ?? 'OUR 12 FACILITIES & PROGRAMS';

  const facilitiesTag = content('sevak-nivash-facilities', 'tag') ?? 'OUR FACILITY';
  const facilities =
    content('sevak-nivash-facilities', 'items') ?? [
      {
        title: 'Help, Support & Counseling Center',
        desc: 'Professional guidance, emotional support and counseling services for individuals in need.',
        fullDesc:
          'Your support helps us provide professional counseling, emotional assistance, guidance, and rehabilitation services for visually impaired, disabled, and underprivileged individuals. Through this facility, we empower beneficiaries to overcome challenges, build confidence, and lead independent lives with dignity and hope.',
        amount: '₹1,50,000',
        img: '/images/nivash9.jpeg',
        side: 'left',
      },
      {
        title: 'Vocational Training & Youth Skill Development Unit',
        desc: 'Supporting skill development and livelihood opportunities for a brighter future.',
        fullDesc:
          'This facility provides vocational education, practical skill training, and career guidance to youth and individuals from underserved communities. Your contribution helps create employment opportunities, encourage self-reliance, and empower beneficiaries with the skills needed for a sustainable future.',
        amount: '₹3,00,000',
        img: '/images/nivash6.jpeg',
        side: 'right',
      },
      {
        title: 'Library – Study and Explore',
        desc: 'Providing accessible books, learning resources, and educational opportunities for all.',
        fullDesc:
          'This facility provides an inclusive learning space equipped with books, study materials, Braille resources, audio learning tools, and digital educational content. Your support helps visually impaired, disabled, and underprivileged individuals access knowledge, enhance their education, and unlock new opportunities for personal and professional growth.',
        amount: '₹2,00,000',
        img: '/images/nivash1.jpeg',
        side: 'left',
      },
      {
        title: 'BPO & Employment Training Unit',
        desc: 'Creating employment opportunities through professional training and workplace readiness.',
        fullDesc:
          'This facility equips visually impaired, disabled, and underprivileged individuals with professional communication, computer, and workplace skills required for BPO and corporate employment opportunities. Your support helps beneficiaries gain industry-relevant training, improve employability, and achieve financial independence through sustainable careers.',
        amount: '₹3,00,000',
        img: '/images/nivash3.jpeg',
        side: 'right',
      },
      {
        title: 'Computer Training Lab',
        desc: 'Providing digital education, computer skills, and technology-based learning opportunities.',
        fullDesc:
          "This facility equips visually impaired, disabled, and underprivileged individuals with essential computer and digital skills required in today's technology-driven world. Your support helps provide access to computers, assistive technologies, software training, and digital literacy programs, enabling beneficiaries to pursue education, employment, and greater independence.",
        amount: '₹5,00,000',
        img: '/images/nivash2.jpeg',
        side: 'left',
      },
      {
        title: 'Communication & Personality Development Center',
        desc: 'Building confidence, communication skills, and leadership qualities for a brighter future.',
        fullDesc:
          'This facility helps individuals enhance their communication, leadership, confidence, and interpersonal skills through structured training and personal development programs. Your support empowers beneficiaries to build self-confidence, improve public interaction, and prepare for educational, professional, and social success.',
        amount: '₹3,00,000',
        img: '/images/nivash7.jpeg',
        side: 'right',
      },
      {
        title: 'Career Guidance & Placement Center',
        desc: 'Guiding individuals towards meaningful careers and sustainable employment opportunities.',
        fullDesc:
          'This facility provides career counseling, job readiness training, placement support, and professional guidance for visually impaired, disabled, and underprivileged individuals. Your support helps beneficiaries identify suitable career paths, develop workplace skills, and connect with employment opportunities, paving the way for financial independence and long-term success.',
        amount: '₹3,50,000',
        img: '/images/nivash6.jpeg',
        side: 'left',
      },
      {
        title: 'AI & Digital Innovation Lab',
        desc: 'Empowering future innovators through AI, technology, and digital skill development.',
        fullDesc:
          'This facility provides access to emerging technologies, artificial intelligence, digital tools, and innovation-driven learning opportunities. Your support helps individuals develop future-ready skills, explore digital careers, and participate in a technology-enabled world with confidence and independence.',
        amount: '₹4,00,000',
        img: '/images/nivash4.jpeg',
        side: 'right',
      },
      {
        title: 'Physiotherapy & Wellness Room',
        desc: 'Supporting physical well-being, mobility, and rehabilitation through specialized care.',
        fullDesc:
          'This facility provides physiotherapy, rehabilitation support, and wellness services for visually impaired, disabled, and underprivileged individuals. Your contribution helps improve mobility, physical health, independence, and overall quality of life by ensuring access to essential therapeutic care and wellness resources.',
        amount: '₹2,00,000',
        img: '/images/nivash10.jpeg',
        side: 'left',
      },
      {
        title: 'Women Empowerment & Self Employment Unit',
        desc: 'Empowering women with skills, confidence, and opportunities for self-reliance.',
        fullDesc:
          'This facility supports women through skill development, entrepreneurship training, and livelihood opportunities. Your contribution helps women become financially independent, build self-confidence, and create sustainable sources of income for themselves and their families.',
        amount: '₹2,00,000',
        img: '/images/nivash12.jpeg',
        side: 'right',
      },
      {
        title: 'Community Kitchen (Rasoi Ghar)',
        desc: 'Providing nutritious meals and food support to those in need with dignity and care.',
        fullDesc:
          'This facility serves freshly prepared and nutritious meals to visually impaired individuals, persons with disabilities, underprivileged families, and those facing food insecurity. Your support helps ensure that no one goes hungry while promoting health, dignity, and community care through regular meal assistance programs.',
        amount: '₹3,00,000',
        img: '/images/nivash5.jpeg',
        side: 'left',
      },
      {
        title: 'Sevak Nivas (Temporary Accommodation for Blind Students)',
        desc: 'Providing a safe and supportive home for visually impaired students.',
        fullDesc:
          'This facility provides safe, accessible, and comfortable temporary accommodation for visually impaired students pursuing education and skill development opportunities. Your support helps create a secure living environment where students can focus on learning, personal growth, and building a brighter future with dignity and independence.',
        amount: '₹4,00,000',
        img: '/images/nivash11.jpeg',
        side: 'right',
      },
    ];

  return (
    <>
      <style>{`
        .sevak-nivash * { margin: 0; padding: 0; box-sizing: border-box; }
        .sevak-nivash { font-family: 'Montserrat', sans-serif; background: #fff; color: #111827; overflow-x: hidden; }
        .sevak-nivash img { width: 100%; display: block; }

        .sevak-nivash .tax-box {
          width: 100%; height: 70px; display: flex; justify-content: center; align-items: center;
          text-align: center; background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff; margin: 20px 0; padding: 10px; position: relative; overflow: hidden; transition: 0.4s ease;
        }
        .sevak-nivash .tax-box h1 { font-size: 1.4rem; font-weight: 700; font-family: 'Montserrat', sans-serif; position: relative; z-index: 2; }
        .sevak-nivash .tax-box::before {
          content: ""; position: absolute; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%; animation: snShine 6s linear infinite;
        }
        .sevak-nivash .tax-box:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 25px 60px rgba(0,163,218,0.35); }
        @keyframes snShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .sevak-nivash .anndaan-hero-banner { position: relative; width: 100%; height: 700px; overflow: hidden; }
        .sevak-nivash .anndaan-hero-banner img { width: 100%; height: 700px; object-fit: cover; display: block; }
        .sevak-nivash .anndaan-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.55)); }
        .sevak-nivash .anndaan-content {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          text-align: center; width: 100%; padding: 20px; z-index: 5;
        }
        .sevak-nivash .anndaan-content h1 { font-size: 40px; color: #fff; font-weight: 900; letter-spacing: 5px; text-shadow: 0 15px 35px rgba(0,0,0,0.4); animation: snZoomfade 1.5s ease; }
        .sevak-nivash .anndaan-content p { color: #fff; font-size: 26px; margin-top: 15px; letter-spacing: 2px; text-shadow: 0 10px 25px rgba(0,0,0,0.4); }
        @keyframes snZoomfade { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }

        .sevak-nivash .sevak-food-main-wrap { width: 100%; background: #fff; }
        .sevak-nivash .annaseva-hero-zone {
          position: relative; min-height: 100vh; display: flex; justify-content: center; align-items: center;
          text-align: center; padding: 80px 8%; overflow: hidden;
          background: linear-gradient(to bottom right, #ffffff, #f3fbff);
        }
        .sevak-nivash .annaseva-hero-content { max-width: 900px; position: relative; z-index: 5; }
        .sevak-nivash .annaseva-mini-title {
          display: inline-block; background: #00a3da15; color: #00a3da; padding: 12px 25px;
          border-radius: 50px; font-weight: 700; letter-spacing: 2px; margin-bottom: 25px;
        }
        .sevak-nivash .annaseva-hero-content h1 { font-size: 75px; line-height: 1.1; font-weight: 900; color: #111; margin-bottom: 25px; }
        .sevak-nivash .annaseva-hero-content p { font-size: 20px; line-height: 1.8; color: #555; margin-bottom: 40px; }
        .sevak-nivash .annaseva-hero-buttons { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .sevak-nivash .annaseva-btn-main {
          padding: 18px 38px; border-radius: 60px; text-decoration: none; font-weight: 700; transition: 0.4s;
          background: #00a3da; color: #fff; box-shadow: 0 15px 40px #00a3da50;
        }
        .sevak-nivash .annaseva-btn-main:hover { transform: translateY(-8px); }
        .sevak-nivash .annaseva-floating-circle { position: absolute; border-radius: 50%; background: #00a3da12; animation: snFloatmove 8s infinite ease-in-out; }
        .sevak-nivash .annaseva-floating-circle.one { width: 320px; height: 320px; top: -100px; left: -80px; }
        .sevak-nivash .annaseva-floating-circle.two { width: 250px; height: 250px; bottom: 40px; right: -50px; }
        .sevak-nivash .annaseva-floating-circle.three { width: 180px; height: 180px; bottom: 120px; left: 20%; }
        @keyframes snFloatmove { 50% { transform: translateY(-30px); } }

        .sevak-nivash .sevak-section { padding: 20px 15px; text-align: center; }
        .sevak-nivash .sevak-container { display: flex; justify-content: center; gap: 15px; margin-top: 20px; flex-wrap: wrap; }
        .sevak-nivash .sevak-box {
          background: #ffffff; border: 1px solid #ddd; padding: 15px; width: 500px;
          border-radius: 8px; transition: 0.3s ease; cursor: pointer;
        }
        .sevak-nivash .sevak-box:hover { background: #00a3da; color: #fff; transform: translateY(-5px); }
        .sevak-nivash .sevak-box:hover h3, .sevak-nivash .sevak-box:hover p { color: #fff; }
        .sevak-nivash .sevak-box h3 { margin-bottom: 30px; }
        .sevak-nivash .sevak-box p { font-size: 20px; line-height: 1.5; }

        .sevak-nivash .about-sevak { padding: 20px 4%; background: #fff; }
        .sevak-nivash .section-heading { text-align: center; max-width: 1000px; margin: auto; }
        .sevak-nivash .section-heading h2 { color: #00a3da; font-size: 42px; margin-bottom: 15px; font-weight: 700; }
        .sevak-nivash .section-heading p { color: #555; line-height: 1.8; font-size: 16px; }
        .sevak-nivash .facility-title { text-align: center; margin: 40px 0 25px; }
        .sevak-nivash .facility-title h2 { color: #00a3da; font-size: 36px; font-weight: 700; }
        .sevak-nivash .facility-wrapper { display: flex; gap: 30px; align-items: flex-start; }

        .sevak-nivash .donation-card {
          width: 320px; flex-shrink: 0; background: #fff; border-radius: 20px; padding: 20px;
          box-shadow: 0 15px 35px rgba(0,58,189,0.08), 0 5px 15px rgba(0,0,0,0.05);
          transition: 0.4s; position: sticky; top: 20px;
        }
        .sevak-nivash .donation-card:hover { transform: translateY(-8px); }
        .sevak-nivash .facility-image { overflow: hidden; border-radius: 16px; margin-bottom: 18px; transform: perspective(1000px) rotateX(4deg); box-shadow: 0 20px 35px rgba(0,58,189,0.15); }
        .sevak-nivash .facility-image img { width: 100%; display: block; transition: 0.5s; }
        .sevak-nivash .donation-card:hover .facility-image img { transform: scale(1.08); }
        .sevak-nivash .donation-card h3 { color: #00a3da; font-size: 22px; margin-bottom: 12px; }
        .sevak-nivash .donation-card p { color: #666; line-height: 1.7; }
        .sevak-nivash .amount { font-size: 34px; font-weight: 700; color: #00a3da; margin: 20px 0; }
        .sevak-nivash .donate-btn {
          display: block; text-align: center; background: #00a3da; color: #fff; text-decoration: none;
          padding: 14px; border-radius: 10px; font-weight: 600; transition: 0.3s;
        }

        .sevak-nivash .facility-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .sevak-nivash .facility-tag {
          display: inline-block; width: fit-content; background: #eef4ff; color: #00a3da;
          padding: 8px 18px; border-radius: 30px; font-size: 14px; font-weight: 600; margin-bottom: 15px;
        }
        .sevak-nivash .facility-content h3 { font-size: 42px; color: #00a3da; line-height: 1.2; margin-bottom: 20px; font-weight: 700; }
        .sevak-nivash .facility-content h2 { font-size: 42px; color: #00a3da; line-height: 1.2; margin-bottom: 18px; font-weight: 700; }
        .sevak-nivash .facility-content p { font-size: 18px; line-height: 1.9; color: #555; max-width: 700px; }

        .sevak-nivash .facility-section { padding: 50px 6%; background: #fff; }
        .sevak-nivash .facility-section .facility-wrapper { align-items: center; justify-content: space-between; gap: 40px; }
        .sevak-nivash .facility-section .facility-content { padding-right: 20px; }
        .sevak-nivash .facility-section .donation-card { width: 360px; border: 1px solid #eee; }
        .sevak-nivash .facility-section .donation-card h3 { font-size: 22px; }
        .sevak-nivash .facility-section .amount { font-size: 32px; }

        @media (max-width: 991px) {
          .sevak-nivash .anndaan-hero-banner { height: 350px; }
          .sevak-nivash .anndaan-hero-banner img { height: 350px; }
          .sevak-nivash .anndaan-content h1 { font-size: 40px; }
          .sevak-nivash .anndaan-content p { font-size: 18px; }
          .sevak-nivash .annaseva-hero-content h1 { font-size: 48px; }
          .sevak-nivash .facility-wrapper { flex-direction: column; overflow: visible; }
          .sevak-nivash .donation-card { width: 100%; position: relative; top: 0; overflow: visible; }
          .sevak-nivash .facility-content h3, .sevak-nivash .facility-content h2 { font-size: 30px; }
          .sevak-nivash .facility-section .facility-wrapper { gap: 25px; }
          .sevak-nivash .facility-section .donation-card { width: 100%; overflow: visible; }
        }
        @media (max-width: 768px) {
          .sevak-nivash .facility-wrapper { align-items: stretch; overflow: visible; }
          .sevak-nivash .facility-content { width: 100%; padding-right: 0; }
          .sevak-nivash .facility-content h3, .sevak-nivash .facility-content h2 { font-size: 30px; }
          .sevak-nivash .facility-content p { font-size: 16px; }
          .sevak-nivash .facility-section .donation-card { width: 100%; }
          .sevak-nivash .about-sevak .facility-wrapper { overflow: visible; }
          .sevak-nivash .about-sevak { overflow: visible; }
          .sevak-nivash .facility-section { overflow: visible; }
        }
        @media (max-width: 600px) {
          .sevak-nivash .annaseva-hero-content h1 { font-size: 38px; }
          .sevak-nivash .sevak-box { width: 100%; }
          .sevak-nivash .donation-card { position: relative; top: 0; overflow: visible; display: block; visibility: visible; opacity: 1; width: 100%; max-width: 100%; height: auto; transform: none; }
          .sevak-nivash .donation-card .facility-image { overflow: visible; transform: none; height: auto; }
          .sevak-nivash .donation-card .facility-image img { height: auto; }
          .sevak-nivash .donation-card h3 { display: block; visibility: visible; opacity: 1; overflow: visible; }
          .sevak-nivash .donation-card p { display: block; visibility: visible; opacity: 1; overflow: visible; }
          .sevak-nivash .donation-card .amount { display: block; visibility: visible; opacity: 1; overflow: visible; }
          .sevak-nivash .donation-card .donate-btn { display: block; visibility: visible; opacity: 1; overflow: visible; }
          .sevak-nivash .facility-section .donation-card { width: 100%; border: 1px solid #eee; }
          .sevak-nivash .facility-section .facility-wrapper { flex-direction: column; gap: 25px; overflow: visible; }
          .sevak-nivash .about-sevak .facility-wrapper { flex-direction: column; gap: 25px; overflow: visible; }
          .sevak-nivash { overflow-x: visible; overflow-y: visible; }
        }
      `}</style>

      <div className="sevak-nivash">
        <section className="anndaan-hero-banner">
          <img src={bannerImage} alt="Sevak Nivas Banner" />
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
                <Link to="/donate" className="annaseva-btn-main">Support Sevak Nivas</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="sevak-section">
          <div className="sevak-container">
            {visionMission.map((vm, i) => (
              <div className="sevak-box" key={i}>
                <h3>{vm.title}</h3>
                <p>{vm.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-sevak">
          <div className="section-heading">
            <h2>{aboutHeading}</h2>
            <p>
              {aboutText}
            </p>
          </div>
          <div className="facility-title">
            <h2>{facilitiesTitle}</h2>
          </div>
        </section>

        {facilities.map((f, i) => {
          const sectionClass = i % 2 === 0 ? 'about-sevak' : 'facility-section';
          return (
            <section key={i} className={sectionClass}>
              <div className="facility-wrapper">
                {f.side === 'left' ? (
                  <>
                    <div className="donation-card">
                      <div className="facility-image">
                        <img src={f.img} alt={f.title} />
                      </div>
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                      <div className="amount">{f.amount}</div>
                      <Link to="/donate" className="donate-btn">Donate Now</Link>
                    </div>
                    <div className="facility-content">
                      <span className="facility-tag">{facilitiesTag}</span>
                      <h3>{f.title}</h3>
                      <p>{f.fullDesc}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="facility-content">
                      <span className="facility-tag">{facilitiesTag}</span>
                      <h2>{f.title}</h2>
                      <p>{f.fullDesc}</p>
                    </div>
                    <div className="donation-card">
                      <div className="facility-image">
                        <img src={f.img} alt={f.title} />
                      </div>
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                      <div className="amount">{f.amount}</div>
                      <Link to="/donate" className="donate-btn">Donate Now</Link>
                    </div>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
