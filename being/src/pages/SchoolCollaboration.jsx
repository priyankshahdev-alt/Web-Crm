import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';

export default function SchoolCollaboration() {
  const content = usePageContent('school-collaboration');

  const heading = content('school-heading', 'heading') ?? 'School & Institute';
  const headingSpan = content('school-heading', 'headingSpan') ?? 'Collaboration';
  const text1 =
    content('school-heading', 'text1') ??
    'At Being Sevak Charitable Trust, we believe that children are not only the future of our nation but also powerful agents of positive change within society.';
  const text2 =
    content('school-heading', 'text2') ??
    'Instilling compassion, empathy, and social responsibility at an early age helps shape responsible individuals and future leaders.';
  const jogTitle = content('school-jog', 'title') ?? 'Joy Of Giving (JOG) Program';
  const jogText =
    content('school-jog', 'text') ??
    'Launched in 2022, the JOG Program is a unique student engagement initiative designed to create awareness about social inequalities and encourage kindness, gratitude, and community participation among students.';
  const text3 =
    content('school-engagement', 'text1') ??
    'Through interactive sessions, awareness activities, and meaningful engagements conducted in schools and educational institutions, the JOG Program helps students understand the realities faced by underprivileged communities.';
  const text4 =
    content('school-engagement', 'text2') ??
    'The initiative encourages children to value their privileges, develop empathy for others, and contribute positively towards society.';
  const points =
    content('school-points', 'items') ?? [
      { number: '01', title: 'Empathy Building', description: 'Helping students understand social realities and humanity.' },
      { number: '02', title: 'Community Participation', description: 'Encouraging kindness, gratitude, and the spirit of giving.' },
      { number: '03', title: 'Future Leaders', description: 'Nurturing socially conscious and responsible citizens.' },
    ];
  const bottomText =
    content('school-bottom', 'text') ??
    'BSCT collaborates with schools, colleges, and educational institutes to conduct impactful sessions and activities that inspire students to embrace humanity, kindness, and social responsibility.';
  const bottomHeading =
    content('school-bottom', 'heading') ??
    'Together, let us inspire the next generation to become compassionate and socially aware citizens.';
  const cards =
    content('school-cards', 'items') ?? [
      { title: 'Awareness Sessions', description: 'Interactive activities that create awareness about social inequalities and community welfare.' },
      { title: 'Student Engagement', description: 'Meaningful participation programs that encourage kindness and empathy among students.' },
      { title: 'Social Responsibility', description: 'Inspiring children to become responsible citizens dedicated to building a better society.' },
    ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #03163E;
          --mid: #315371;
          --cyan: #00A2D9;
          --cyan-light: #33bce8;
          --green: #2eb85c;
          --gold: #D4AF37;
          --white: #ffffff;
          --light-bg: #f4f7fb;
          --text-dark: #1a1a2e;
          --text-mid: #4a5568;
        }
        body { font-family: 'Open Sans', sans-serif; color: var(--text-dark); overflow-x: hidden; }
        .school-collab-section {
          width: 100%;
          padding: 100px 8%;
          background: #fff;
          overflow: hidden;
          position: relative;
        }
        .school-collab-section::before {
          content: "";
          position: absolute;
          width: 420px; height: 420px;
          background: #00a3d4;
          opacity: 0.08;
          border-radius: 50%;
          top: -150px; right: -120px;
          filter: blur(20px);
        }
        .school-collab-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
        }
        .school-tag {
          display: inline-block;
          padding: 10px 22px;
          background: #00a3d4;
          color: #fff;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          box-shadow: 0 10px 25px rgba(0,163,212,0.35);
        }
        .school-collab-left h2 {
          font-size: 55px;
          line-height: 1.2;
          margin-bottom: 25px;
          color: #111;
          font-weight: 800;
        }
        .school-collab-left h2 span {
          color: #00a3d4;
          text-shadow: 0 5px 15px rgba(0,163,212,0.25);
        }
        .school-collab-left p {
          font-size: 17px;
          line-height: 1.9;
          color: #555;
          margin-bottom: 18px;
        }
        .school-highlight-box {
          background: #fff;
          border-left: 6px solid #00a3d4;
          padding: 30px;
          border-radius: 25px;
          margin: 35px 0;
          box-shadow: 0 12px 30px rgba(0,0,0,0.05), 0 0 25px rgba(0,163,212,0.10);
          transition: 0.4s;
        }
        .school-highlight-box:hover { transform: translateY(-8px); }
        .school-highlight-box h3 {
          font-size: 28px;
          color: #00a3d4;
          margin-bottom: 15px;
        }
        .school-points {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .school-point {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          background: #fff;
          padding: 22px;
          border-radius: 25px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 0 20px rgba(0,163,212,0.08);
          transition: 0.4s;
        }
        .school-point:hover { transform: translateX(10px); }
        .school-icon {
          min-width: 65px;
          height: 65px;
          background: #00a3d4;
          color: #fff;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 12px 25px rgba(0,163,212,0.35);
        }
        .school-point h4 { font-size: 22px; margin-bottom: 8px; color: #111; }
        .school-point p { margin: 0; font-size: 15px; }
        .school-bottom-box {
          margin-top: 45px;
          background: linear-gradient(135deg, #00a3d4, #0085ad);
          padding: 40px;
          border-radius: 30px;
          color: #fff;
          box-shadow: 0 20px 40px rgba(0,163,212,0.30);
        }
        .school-bottom-box p { color: #fff; margin-bottom: 18px; }
        .school-bottom-box h4 { font-size: 28px; line-height: 1.5; font-weight: 700; }
        .school-collab-right {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .school-card {
          background: #fff;
          padding: 40px 35px;
          border-radius: 30px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.06), 0 0 25px rgba(0,163,212,0.08);
          transition: 0.4s;
        }
        .school-card::before {
          content: "";
          position: absolute;
          width: 140px; height: 140px;
          background: #00a3d4;
          opacity: 0.08;
          border-radius: 50%;
          top: -50px; right: -50px;
        }
        .school-card:hover { transform: translateY(-10px); }
        .school-card h3 {
          font-size: 30px;
          margin-bottom: 15px;
          color: #00a3d4;
          position: relative;
          z-index: 2;
        }
        .school-card p {
          font-size: 16px;
          line-height: 1.8;
          color: #555;
          position: relative;
          z-index: 2;
        }
        .school-card-one { margin-top: 40px; }
        .school-card-two { margin-left: 40px; }
        .school-card-three { margin-top: 10px; }
        @media(max-width: 991px) {
          .school-collab-container { grid-template-columns: 1fr; }
          .school-collab-left h2 { font-size: 40px; }
          .school-card-two { margin-left: 0; }
          .school-card-one { margin-top: 0; }
        }
        @media(max-width: 600px) {
          .school-collab-section { padding: 80px 5%; }
          .school-collab-left h2 { font-size: 32px; }
          .school-highlight-box, .school-card, .school-bottom-box, .school-point { padding: 25px; }
          .school-bottom-box h4 { font-size: 22px; }
        }
      `}</style>

      <section className="school-collab-section">
        <div className="school-collab-container">
          <div className="school-collab-left">
            <h2>
              {heading} <span>{headingSpan}</span>
            </h2>

            <p>
              {text1}
            </p>

            <p>
              {text2}
            </p>

            <div className="school-highlight-box">
              <h3>{jogTitle}</h3>
              <p>
                {jogText}
              </p>
            </div>

            <p>
              {text3}
            </p>

            <p>
              {text4}
            </p>

            <div className="school-points">
              {points.map((point, i) => (
                <div className="school-point" key={i}>
                  <div className="school-icon">{point.number}</div>
                  <div>
                    <h4>{point.title}</h4>
                    <p>{point.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="school-bottom-box">
              <p>
                {bottomText}
              </p>
              <h4>
                {bottomHeading}
              </h4>
            </div>
          </div>

          <div className="school-collab-right">
            <div className="school-card school-card-one">
              <h3>{cards[0].title}</h3>
              <p>
                {cards[0].description}
              </p>
            </div>
            <div className="school-card school-card-two">
              <h3>{cards[1].title}</h3>
              <p>
                {cards[1].description}
              </p>
            </div>
            <div className="school-card school-card-three">
              <h3>{cards[2].title}</h3>
              <p>
                {cards[2].description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
