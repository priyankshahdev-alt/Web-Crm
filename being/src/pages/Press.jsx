import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const pressData = [
  { title: "Paryavaran Mitra", date: "11 September 2021", year: 2021, description: "Governor presents 'Paryavaran Mitra Samman' on National Forest Martyrs' Day", image: "/images/logos/rajbhawan.jpeg", source: "Raj Bhavan", link: "https://rajbhavan-maharashtra.gov.in/en/11-09-2021-governor-presents-paryavaran-mitra-samman-on-national-forest-martyrs-day/" },
  { title: "à¤¦à¤¿à¤µà¥à¤¯à¤¾à¤‚à¤— à¤¸à¤‚à¤—à¥€à¤¤à¤•à¤¾à¤°", date: "16 August 2021", year: 2021, description: "Shankar Mahadevan à¤¨à¥‡ à¤¦à¤¿à¤µà¥à¤¯à¤¾à¤‚à¤— à¤¸à¤‚à¤—à¥€à¤¤à¤•à¤¾à¤°à¥‹à¤‚ à¤•à¤¾ à¤¸à¤®à¤à¤¾ à¤¦à¤°à¥à¤¦, à¤¬à¤¨à¥‡ Being Sevak", image: "/images/logos/aajtak.jpeg", source: "AajTak", link: "https://www.aajtak.in/entertainment/bollywood-news/video/bollywood-singer-shankar-mahadevan-distributs-food-kit-and-mobile-phones-to-the-blind-musicians-being-sevak-1310613-2021-08-16" },
  { title: "Social Responsibility", date: "14 September 2021", year: 2021, description: "Being Sevak Charitable Trust ensuring commitments to social responsibility and humanity", image: "/images/logos/midday.jpeg", source: "Mid-Day", link: "https://www.mid-day.com/lifestyle/infotainment/article/being-sevak-charitable-trust-ensuring-commitments-to-social-responsibility-and-humanity-23192304" },
  { title: "National Award", date: "20 October 2021", year: 2021, description: "Being Sevak Charitable Trust hosts the National Awards function to recognise the talent of India's visually challenged achievers", image: "/images/logos/lokmat.jpeg", source: "Lokmat Times", link: "https://www.lokmattimes.com/business/being-sevak-charitable-trust-hosts-the-national-awards-function-to-recognise-the-talent-of-indias/" },
  { title: "Pandemic", date: "19 August 2021", year: 2021, description: "Shankar Mahadevan Joins Hands With Charitable Trust 'Being Sevak' To Help Blind Musicians During Pandemic", image: "/images/logos/zee5.jpeg", source: "Zee5", link: "https://www.zee5.com/zee5news/shankar-mahadevan-joins-hands-with-charitable-trust-being-sevak-to-help-blind-musicians-during-pandemic/" },
  { title: "National Award", date: "20 October 2021", year: 2021, description: "Being Sevak Charitable Trust hosts the National Awards function to recognise the talent of India's visually challenged achievers", image: "/images/logos/aninews.jpeg", source: "ANI News", link: "https://www.aninews.in/news/business/business/being-sevak-charitable-trust-hosts-the-national-awards-function-to-recognise-the-talent-of-indias-visually-challenged-achievers20211020170958/" },
  { title: "Business Award", date: "September 2023", year: 2023, description: "Being Sevak: Mission Annapurna With Mandar Chandwadkar From Tarak Mehta Ka Ulta Chashma", image: "/images/logos/Fsia.jpg", source: "FSIA", link: "https://www.fsia.in/best-ngo-in-mumbai-2023-award-being-sevak-charitable-trust" },
  { title: "Covid-19 Pandemic", date: "17 August 2021", year: 2021, description: "Shankar Mahadevan's charitable trust Being Sevak helps out singers, artists during Covid-19 pandemic", image: "/images/logos/indiaToday.png", source: "India Today", link: "https://www.indiatoday.in/television/video/shankar-mahadevan-s-charitable-trust-being-sevak-helps-out-singers-artists-during-covid-19-pandemic-1841881-2021-08-17" },
  { title: "Save the Flag Drive", date: "08 September 2023", year: 2023, description: "Being Sevak Charitable Trust Initiates 'Save the Flag' Drive on 16th August 2023, Promoting Respect for the National Flag", image: "/images/logos/hindustanmentro.png", source: "Hindustan Metro", link: "https://www.hindustanmetro.com/being-sevak-charitable-trust-initiates-save-the-flag-drive-on-16th-august-2023-promoting-respect-for-the-national-flag-post-independence-day-celebrations/" },
  { title: "Mission Annapurna", date: "20 January 2023", year: 2023, description: "Being Sevak: Mission Annapurna With Mandar Chandwadkar From Tarak Mehta Ka Ulta Chashma", image: "/images/logos/APNnews.jpg", source: "APN News", link: "https://www.apnnews.com/being-sevak-mission-annapurna-with-mandar-chandwadkar-from-tarak-mehta-ka-ulta-chashma/" },
  { title: "World Record", date: "10 October 2023", year: 2023, description: "Sevak Charitable Trust Empowering Visually Impaired Individuals Across India For Lasting Social Impact", image: "/images/logos/bravoword.jpg", source: "Bravo World Records", link: "https://bravoworldrecords.com/sevak-charitable-trust-empowering-visually-impaired-individuals-across-india-for-lasting-social-impact/" },
  { title: "Mission Annapurna", date: "19 January 2021", year: 2021, description: "Being Sevak: Mission Annapurna With Mandar Chandwadkar From Tarak Mehta Ka Ulta Chashma", image: "/images/logos/global.jpg", source: "Global Prime News", link: "https://globalprimenews.com/tag/being-sevak-charitable-trust/" },
  { title: "Diwali", date: "24 November 2023", year: 2023, description: "Being Sevak Charitable Trust Illuminates Diwali for Visually Impaired Across 7 States by Distributing Anna Potli", image: "/images/logos/xpress.png", source: "Xpress Times", link: "https://xpresstimes.in/being-sevak-charitable-trust-illuminates-diwali-for-visually-impaired-across-7-states-by-distributing-anna-potli/" },
  { title: "Janmashtami", date: "08 September 2023", year: 2023, description: "Being Sevak Charitable Trust Illuminates Janmashtami with Visually Impaired Celebration", image: "/images/logos/newspatrolling.png", source: "News Patrolling", link: "https://newspatrolling.com/being-sevak-charitable-trust-illuminates-janmashtami-with-visually-impaired-celebration/" }
];

const Press = () => {
  const content = usePageContent('press');

  const bannerTitle = content('press-banner', 'title') ?? 'Press Release';

  const heroTag = content('press-hero', 'tag') ?? 'BEING SEVAK CHARITABLE TRUST';
  const heroTitlePrefix = content('press-hero', 'titlePrefix') ?? 'In The';
  const heroTitleHighlight = content('press-hero', 'titleHighlight') ?? 'Press';
  const heroDescription =
    content('press-hero', 'description') ??
    'Discover the stories, milestones, and impact of Being Sevak Charitable Trust as featured in leading national and international media outlets.';
  const heroImage = content('press-hero', 'image') ?? '/images/logos/press.jpg';
  const stat1Value = content('press-hero', 'stat1Value') ?? '14+';
  const stat1Label = content('press-hero', 'stat1Label') ?? 'Media Features';
  const stat2Value = content('press-hero', 'stat2Value') ?? '10+';
  const stat2Label = content('press-hero', 'stat2Label') ?? 'News Outlets';

  const mediaHeading = content('press-media', 'heading') ?? 'Media Coverage';

  const pressItems = content('press-releases', 'items') ?? pressData;

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');

  const filtered = pressItems.filter(item => {
    if (yearFilter !== 'all' && item.year !== parseInt(yearFilter)) return false;
    if (search) {
      const s = search.toLowerCase();
      const t = item.title.toLowerCase();
      const d = item.description.toLowerCase();
      const src = item.source.toLowerCase();
      const dt = item.date.toLowerCase();
      if (!t.includes(s) && !d.includes(s) && !src.includes(s) && !dt.includes(s)) return false;
    }
    return true;
  });

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light-bg:#f4f7fb;--text-dark:#1a1a2e;--text-mid:#4a5568;--gold:#D4AF37; }
        body{font-family:'Open Sans',sans-serif;color:var(--text-dark);background:#fff;}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);color:#fff;border-radius:0px;margin:20px 0;padding:10px;}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;margin:0;}
        .hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:0px;position:relative;overflow:hidden;padding:10px 8%;}
        .hero-content{position:relative;z-index:2;}
        .hero-content .tag{background:transparent;color:#00a3da;padding:0;border-radius:0;display:inline-block;margin-bottom:25px;font-weight:800;font-size:30px;letter-spacing:1px;}
        .hero h1{font-size:62px;line-height:1.1;font-weight:800;margin-bottom:25px;color:var(--navy);}
        .hero h1 span{color:#00a3da;}
        .hero p{font-size:18px;line-height:1.9;color:#66788a;margin-bottom:35px;}
        .hero-buttons{display:flex;gap:18px;flex-wrap:wrap;}
        .hero-buttons .donate-btn{display:inline-block;padding:15px 36px;background:#00a3da;color:#fff;text-decoration:none;border-radius:6px;font-weight:700;transition:0.4s;box-shadow:0 10px 25px rgba(11,77,120,0.25);}
        .hero-buttons .donate-btn:hover{background:#007d94;transform:translateY(-1px);}
        .hero-image{position:relative;z-index:2;display:flex;justify-content:center;}
        .hero-image img{width:100%;max-width:500px;border-radius:30px;box-shadow:0 25px 50px rgba(0,0,0,0.15);transition:0.5s ease;}
        .hero-image img:hover{transform:scale(1.02);}
        .floating-card{position:absolute;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:18px 24px;border-radius:18px;box-shadow:0 15px 35px rgba(0,0,0,0.12);text-align:center;z-index:3;animation:floatCard 3s ease-in-out infinite alternate;}
        .floating-card.card1{top:5%;left:-10px;}
        .floating-card.card2{bottom:10%;right:-10px;animation-delay:2s;}
        .floating-card h3{font-size:28px;font-weight:800;color:#00a3da;}
        .floating-card p{font-size:13px;color:#555;margin:0;}
        @keyframes floatCard{0%{transform:translateY(0);}100%{transform:translateY(-15px);}}
        .blur{position:absolute;width:500px;height:500px;border-radius:50%;filter:blur(120px);opacity:0.15;z-index:0;pointer-events:none;}
        .blur1{background:#00a3da;top:-100px;left:-100px;}
        .blur2{background:#315270;bottom:-100px;right:-100px;}
        .press-section{padding:20px 80px 80px;max-width:1400px;margin:auto;}
        .press-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;margin-bottom:50px;}
        .section-title{text-align:left;font-size:34px;font-weight:800;margin:0;color:var(--cyan);font-family:'Montserrat',sans-serif;}
        .press-controls{display:flex;gap:15px;align-items:center;flex-wrap:wrap;}
        .press-search{position:relative;display:flex;align-items:center;}
        .press-search i{position:absolute;left:14px;color:#999;font-size:15px;}
        .press-search input{padding:12px 16px 12px 42px;border:2px solid #e0e6ed;border-radius:10px;font-size:15px;width:280px;outline:none;transition:border-color 0.3s;font-family:'Open Sans',sans-serif;}
        .press-search input:focus{border-color:var(--cyan);}
        .press-filter select{padding:12px 40px 12px 16px;border:2px solid #e0e6ed;border-radius:10px;font-size:15px;outline:none;background:#fff;cursor:pointer;font-family:'Open Sans',sans-serif;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234a5568' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;transition:border-color 0.3s;}
        .press-filter select:focus{border-color:var(--cyan);}
        .press-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(350px, 1fr));gap:28px;}
        .press-card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e8edf4;box-shadow:0 6px 20px rgba(0,0,0,0.06);transition:transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;display:flex;flex-direction:column;opacity:0;animation:fadeInUp 0.45s ease forwards;}
        .press-card:hover{transform:translateY(-6px);box-shadow:0 14px 35px rgba(0,163,218,0.15);border-color:rgba(0,163,218,0.2);}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        .press-card-img-wrap{width:100%;height:160px;overflow:hidden;position:relative;background:#f8fafc;display:flex;align-items:center;justify-content:center;padding:16px;}
        .press-card-img-wrap img{width:100%;height:100%;object-fit:contain;transition:transform 0.4s ease;}
        .press-card:hover .press-card-img-wrap img{transform:scale(1.04);}
        .press-card-body{padding:18px 20px 20px;flex:1;display:flex;flex-direction:column;}
        .press-card-date{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--cyan);font-weight:600;margin-bottom:6px;letter-spacing:0.4px;}
        .press-card-date i{font-size:11px;}
        .press-card-title{font-size:18px;font-weight:700;color:var(--navy);font-family:'Montserrat',sans-serif;margin-bottom:8px;line-height:1.3;}
        .press-card-desc{font-size:13px;color:var(--text-mid);line-height:1.6;flex:1;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .press-card-footer{display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid #eef2f7;margin-top:auto;}
        .press-card-source{font-size:11px;font-weight:700;color:var(--mid);text-transform:uppercase;letter-spacing:0.6px;background:#f0f4fa;padding:3px 10px;border-radius:16px;border:1px solid #e2e8f0;}
        .press-card-link{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:700;color:var(--cyan);text-decoration:none;transition:gap 0.3s;}
        .press-card-link:hover{gap:8px;color:#007d94;}
        .press-card-link i{font-size:11px;transition:transform 0.3s;}
        .press-card-link:hover i{transform:translateX(3px);}
        .press-empty{grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-mid);}
        .press-empty i{font-size:48px;color:#ddd;margin-bottom:16px;display:block;}
        .press-empty p{font-size:18px;}
        @media(max-width:1024px){.press-grid{grid-template-columns:repeat(auto-fill, minmax(310px, 1fr));gap:24px;}}
        @media(max-width:768px){.press-section{padding:20px 24px 50px;}.press-header{flex-direction:column;align-items:stretch;}.press-search input{width:100%;}.press-grid{grid-template-columns:1fr;gap:22px;}.press-card-img-wrap{height:140px;padding:12px;}.press-card-body{padding:16px 18px 18px;}.press-card-title{font-size:17px;}}
        @media(max-width:550px){.press-section{padding:20px 16px 40px;}.press-card-img-wrap{height:120px;padding:10px;}.press-card-body{padding:14px 16px 16px;}.press-card-title{font-size:16px;}}
        @media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center;gap:50px;}.hero h1{font-size:42px;}.hero p{font-size:16px;}.hero-buttons{justify-content:center;}.hero-image img{max-width:90%;}.floating-card.card1{left:5%;}.floating-card.card2{right:5%;}}
        @media(max-width:550px){.hero h1{font-size:32px;}.hero p{font-size:14px;}.floating-card{padding:12px 16px;}.floating-card h3{font-size:22px;}}
      `}</style>

      <section className="tax-box">
        <h1>{bannerTitle}</h1>
      </section>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tag">{heroTag}</span>
          <h1>{heroTitlePrefix} <span>{heroTitleHighlight}</span></h1>
          <p>{heroDescription}</p>
          <div className="hero-buttons">
            <a href="#press-grid" className="donate-btn">Explore Coverage</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card1">
            <h3>{stat1Value}</h3>
            <p>{stat1Label}</p>
          </div>
          <div className="floating-card card2">
            <h3>{stat2Value}</h3>
            <p>{stat2Label}</p>
          </div>
          <img src={heroImage} alt="Press" loading="eager" fetchPriority="high" decoding="async" width="800" height="600" />
        </div>
        <div className="blur blur1"></div>
        <div className="blur blur2"></div>
      </section>

      <section id="press-grid" className="press-section">
        <div className="press-header">
          <h2 className="section-title">{mediaHeading}</h2>
          <div className="press-controls">
            <div className="press-search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search press releases..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="press-filter">
              <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                <option value="all">All Years</option>
                <option value="2023">2023</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>
        </div>
        <div className="press-grid">
          {filtered.length === 0 ? (
            <div className="press-empty">
              <i className="fas fa-newspaper"></i>
              <p>No press releases match your criteria.</p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <div key={i} className="press-card" style={{animationDelay: `${(i % 14) * 0.05}s`}}>
                <div className="press-card-img-wrap">
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" width="800" height="600" />
                </div>
                <div className="press-card-body">
                  <div className="press-card-date">
                    <i className="far fa-calendar-alt"></i> {item.date}
                  </div>
                  <h3 className="press-card-title">{item.title}</h3>
                  <p className="press-card-desc">{item.description}</p>
                  <div className="press-card-footer">
                    <span className="press-card-source">{item.source}</span>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="press-card-link">
                      Read More <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Press;

