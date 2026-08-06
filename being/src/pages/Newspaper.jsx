import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const newspaperDataInit = [
  { url: "/images/newspaperpress/1.jpg", label: "Mumbai Edition", year: 2023 },
  { url: "/images/newspaperpress/2.jpg", label: "National Daily", year: 2023 },
  { url: "/images/newspaperpress/3.jpg", label: "City Times", year: 2023 },
  { url: "/images/newspaperpress/4.jpg", label: "The Chronicle", year: 2023 },
  { url: "/images/newspaperpress/5.jpg", label: "Morning Herald", year: 2023 },
  { url: "/images/newspaperpress/6.jpg", label: "Press Gazette", year: 2023 },
  { url: "/images/newspaperpress/7.jpg", label: "Community Voice", year: 2023 },
  { url: "/images/newspaperpress/8.jpg", label: "Daily Post", year: 2023 },
  { url: "/images/newspaperpress/9.jpg", label: "Metro News", year: 2023 },
  { url: "/images/newspaperpress/10.jpg", label: "Regional Times", year: 2023 },
  { url: "/images/newspaperpress/11.jpg", label: "The Guardian Post", year: 2023 },
  { url: "/images/newspaperpress/12.jpg", label: "Front Page", year: 2023 }
];

const Newspaper = () => {
  const content = usePageContent('newspaper');

  const bannerTitle = content('newspaper-banner', 'title') ?? 'In News Paper';

  const heroTag = content('newspaper-hero', 'tag') ?? 'BEING SEVAK CHARITABLE TRUST';
  const heroTitlePrefix = content('newspaper-hero', 'titlePrefix') ?? 'As Featured In';
  const heroTitleHighlight = content('newspaper-hero', 'titleHighlight') ?? 'Newspapers';
  const heroDescription =
    content('newspaper-hero', 'description') ??
    'Browse through scanned clippings of newspaper articles featuring Being Sevak Charitable Trust\'s initiatives, achievements, and community impact across India.';
  const heroImage = content('newspaper-hero', 'image') ?? '/images/newapperhero.jpeg';

  const tickerLabel = content('newspaper-ticker', 'label') ?? 'Breaking';
  const tickerItems =
    content('newspaper-ticker', 'items') ?? [
      'Being Sevak featured across 12 major newspaper publications',
      'Mission Annapurna receives widespread media acclaim',
      'National Award coverage reaches millions of readers',
      'Save the Flag campaign highlighted in leading dailies',
      'World Record achievement celebrated in the press',
      'Paryavaran Mitra recognition covered by Raj Bhavan',
      'Diwali Anna Potli distribution featured across 7 states',
    ];

  const featuredTag = content('newspaper-featured', 'tag') ?? 'Featured Clip';
  const featuredTitlePrefix = content('newspaper-featured', 'titlePrefix') ?? 'Press Coverage That';
  const featuredTitleHighlight = content('newspaper-featured', 'titleHighlight') ?? 'Inspires Change';
  const featuredText =
    content('newspaper-featured', 'text') ??
    'Each newspaper clipping tells a story of compassion, dedication, and the collective effort to build a better tomorrow. Click on any image to explore the full article.';

  const coverageHeading = content('newspaper-coverage', 'heading') ?? 'Newspaper Coverage';

  const newspaperImages = content('newspaper-gallery', 'items') ?? newspaperDataInit;

  const [newspaperData] = useState(() => {
    const arr = [...newspaperImages];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % newspaperData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [newspaperData.length]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = useCallback((dir) => {
    setCurrentIndex(prev => (prev + dir + newspaperData.length) % newspaperData.length);
  }, [newspaperData.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, navigateLightbox]);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light-bg:#f4f7fb;--text-dark:#1a1a2e;--text-mid:#4a5568;--gold:#D4AF37;}
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
        .blur{position:absolute;width:500px;height:500px;border-radius:50%;filter:blur(120px);opacity:0.15;z-index:0;pointer-events:none;}
        .blur1{background:#00a3da;top:-100px;left:-100px;}
        .blur2{background:#315270;bottom:-100px;right:-100px;}
        .news-section{padding:20px 80px 80px;max-width:1400px;margin:auto;position:relative;}
        .news-ticker{width:100%;overflow:hidden;background:var(--navy);padding:10px 0;margin-bottom:30px;border-radius:10px;position:relative;display:flex;align-items:center;box-shadow:0 4px 15px rgba(0,0,0,0.1);}
        .news-ticker-label{flex-shrink:0;background:linear-gradient(135deg, #e74c3c, #c0392b);color:#fff;font-weight:800;font-size:12px;letter-spacing:1.5px;padding:6px 18px;margin:0 12px 0 0;font-family:'Montserrat',sans-serif;text-transform:uppercase;position:relative;z-index:2;border-radius:0 4px 4px 0;display:flex;align-items:center;gap:6px;animation:tickerPulse 1.5s ease-in-out infinite;}
        .news-ticker-label i{font-size:14px;}
        @keyframes tickerPulse{0%,100%{opacity:1;}50%{opacity:0.7;}}
        .news-ticker-track{flex:1;overflow:hidden;position:relative;}
        .news-ticker-text{display:flex;gap:60px;white-space:nowrap;animation:tickerScroll 25s linear infinite;font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);letter-spacing:0.5px;}
        .news-ticker-text span{display:inline-flex;align-items:center;gap:60px;}
        .news-ticker-text span::before{content:'◆';color:var(--cyan);font-size:10px;}
        @keyframes tickerScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        .news-ticker:hover .news-ticker-text{animation-play-state:paused;}
        .news-featured{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:50px;align-items:center;background:linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);border-radius:20px;padding:40px;border:1px solid #e8edf4;position:relative;overflow:hidden;}
        .news-featured::before{content:'';position:absolute;top:-50%;right:-30%;width:400px;height:400px;background:radial-gradient(circle, rgba(0,163,218,0.06) 0%, transparent 70%);border-radius:50%;}
        .news-featured-content h3{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
        .news-featured-content h3 i{font-size:16px;}
        .news-featured-content h2{font-family:'Montserrat',sans-serif;font-size:32px;font-weight:800;color:var(--navy);line-height:1.25;margin-bottom:14px;}
        .news-featured-content h2 span{color:var(--cyan);position:relative;}
        .news-featured-content h2 span::after{content:'';position:absolute;bottom:2px;left:0;right:0;height:4px;background:var(--cyan);opacity:0.3;border-radius:2px;}
        .news-featured-content p{font-size:15px;line-height:1.7;color:var(--text-mid);margin-bottom:0;}
        .news-featured-image{position:relative;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);cursor:pointer;transition:transform 0.4s ease;}
        .news-featured-image:hover{transform:scale(1.02);}
        .news-featured-image img{width:100%;display:block;border-radius:12px;transition:opacity 0.3s;}
        .news-featured-image .play-overlay{position:absolute;bottom:0;left:0;right:0;padding:30px 16px 14px;background:linear-gradient(transparent, rgba(3,22,62,0.7));display:flex;align-items:center;justify-content:space-between;color:#fff;font-size:13px;font-weight:600;opacity:0;transition:opacity 0.3s;}
        .news-featured-image:hover .play-overlay{opacity:1;}
        .news-featured-image .play-overlay i{font-size:20px;color:var(--cyan);}
        .news-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;margin-bottom:30px;position:relative;z-index:1;}
        .section-title{text-align:left;font-size:34px;font-weight:800;margin:0;color:var(--navy);font-family:'Montserrat',sans-serif;position:relative;}
        .section-title::after{content:'';position:absolute;bottom:-4px;left:0;width:50px;height:4px;background:linear-gradient(to right, var(--cyan), transparent);border-radius:2px;}
        .news-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:20px;position:relative;z-index:1;}
        .news-item{position:relative;border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid #e4e9f0;box-shadow:0 6px 18px rgba(0,0,0,0.05);background:#fff;transition:transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;opacity:0;animation:fadeScaleIn 0.5s ease forwards;}
        .news-item:hover{transform:translateY(-6px) rotateX(2deg);box-shadow:0 20px 45px rgba(0,163,218,0.15);border-color:rgba(0,163,218,0.3);}
        @keyframes fadeScaleIn{from{opacity:0;transform:scale(0.9) translateY(15px);}to{opacity:1;transform:scale(1) translateY(0);}}
        .news-item::after{position:absolute;bottom:0;right:0;width:30px;height:30px;background:linear-gradient(225deg, #fff 30%, #e4e9f0 50%, #d0d6df 70%, #fff 100%);z-index:3;border-radius:0 0 14px 0;transition:all 0.3s ease;box-shadow:-3px -3px 8px rgba(0,0,0,0.05);}
        .news-item:hover::after{width:40px;height:40px;background:linear-gradient(225deg, #fff 25%, var(--cyan) 50%, #007d94 75%, #fff 100%);box-shadow:-4px -4px 12px rgba(0,163,218,0.15);}
        .news-item-inner{position:relative;width:100%;padding-top:135%;overflow:hidden;background:#f8fafc;}
        .news-item-inner img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:transform 0.6s ease;}
        .news-item:hover .news-item-inner img{transform:scale(1.08);}
        .news-item-overlay{position:absolute;bottom:0;left:0;right:0;padding:50px 18px 18px;background:linear-gradient(to top, rgba(0,163,218,0.95) 0%, rgba(0,163,218,0.7) 50%, rgba(255,255,255,0) 100%);opacity:0;transition:opacity 0.35s ease;z-index:2;}
        .news-item:hover .news-item-overlay{opacity:1;}
        .news-item-overlay span{display:inline-flex;align-items:center;gap:8px;color:#fff;font-size:13px;font-weight:700;font-family:'Montserrat',sans-serif;transform:translateY(8px);transition:transform 0.3s ease 0.05s;}
        .news-item:hover .news-item-overlay span{transform:translateY(0);}
        .news-item-overlay span i{font-size:14px;color:var(--cyan);transition:transform 0.3s;}
        .news-item:hover .news-item-overlay span i{transform:translateX(4px) scale(1.1);}
        .news-item-badge{position:absolute;top:12px;left:12px;background:rgba(3,22,62,0.85);backdrop-filter:blur(8px);color:#fff;font-size:10px;font-weight:700;padding:5px 12px;border-radius:20px;letter-spacing:0.8px;text-transform:uppercase;z-index:2;border:1px solid rgba(255,255,255,0.1);transition:all 0.3s;}
        .news-item:hover .news-item-badge{background:var(--cyan);border-color:var(--cyan);transform:translateY(-2px);}
        .news-item-stamp{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%) rotate(-15deg);font-size:11px;font-weight:900;color:rgba(231,76,60,0.15);text-transform:uppercase;letter-spacing:3px;font-family:'Montserrat',sans-serif;border:2px solid rgba(231,76,60,0.12);padding:4px 14px;border-radius:4px;pointer-events:none;z-index:1;transition:all 0.4s;}
        .news-item:hover .news-item-stamp{color:rgba(0,163,218,0.2);border-color:rgba(0,163,218,0.15);transform:translate(-50%, -50%) rotate(-10deg) scale(1.05);}
        .lightbox{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(3,22,62,0.95);backdrop-filter:blur(12px);z-index:10000;align-items:center;justify-content:center;flex-direction:column;}
        .lightbox.open{display:flex;}
        .lightbox-img{max-width:92vw;max-height:88vh;border-radius:6px;box-shadow:0 40px 100px rgba(0,0,0,0.5);object-fit:contain;animation:lightboxZoom 0.35s ease;}
        @keyframes lightboxZoom{from{transform:scale(0.82);opacity:0;}to{transform:scale(1);opacity:1;}}
        .lightbox-close{position:absolute;top:20px;right:28px;background:none;border:none;color:#fff;font-size:32px;cursor:pointer;opacity:0.7;transition:opacity 0.3s;z-index:10001;width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);}
        .lightbox-close:hover{opacity:1;background:rgba(255,255,255,0.15);}
        .lightbox-prev,.lightbox-next{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:20px;cursor:pointer;padding:14px 18px;border-radius:50%;transition:all 0.3s;z-index:10001;width:54px;height:54px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
        .lightbox-prev:hover,.lightbox-next:hover{background:rgba(255,255,255,0.2);border-color:var(--cyan);transform:translateY(-50%) scale(1.05);}
        .lightbox-prev{left:24px;}
        .lightbox-next{right:24px;}
        .lightbox-counter{position:absolute;bottom:28px;color:rgba(255,255,255,0.5);font-size:13px;font-weight:700;letter-spacing:2px;font-family:'Montserrat',sans-serif;background:rgba(255,255,255,0.06);padding:6px 18px;border-radius:20px;border:1px solid rgba(255,255,255,0.08);}
        @media(max-width:1024px){.news-featured{grid-template-columns:1fr;gap:24px;padding:28px;}.news-grid{grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:18px;}}
        @media(max-width:768px){.news-section{padding:20px 24px 50px;}.news-header{flex-direction:column;align-items:stretch;}.news-featured-content h2{font-size:24px;}.news-grid{grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:14px;}}
        @media(max-width:550px){.news-section{padding:20px 16px 40px;}.news-featured{padding:20px;}.news-featured-content h2{font-size:20px;}.news-grid{grid-template-columns:repeat(2, 1fr);gap:10px;}.news-item-inner{padding-top:120%;}.news-item::after{width:20px;height:20px;}}
        @media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center;gap:50px;}.hero h1{font-size:42px;}.hero p{font-size:16px;}.hero-buttons{justify-content:center;}.hero-image img{max-width:90%;}}
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
            <a href="#newspaper-grid" className="donate-btn">Browse Clippings</a>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Newspaper" />
        </div>
        <div className="blur blur1"></div>
        <div className="blur blur2"></div>
      </section>

      <section id="newspaper-grid" className="news-section">
        <div className="news-ticker">
          <div className="news-ticker-label"><i className="fas fa-bolt"></i> {tickerLabel}</div>
          <div className="news-ticker-track">
            <div className="news-ticker-text">
              <span>
                {tickerItems.map((s, j) => (
                  <span key={j}>{s}</span>
                ))}
              </span>
              <span>
                {tickerItems.map((s, j) => (
                  <span key={j}>{s}</span>
                ))}
              </span>
            </div>
          </div>
        </div>

        <div className="news-featured">
          <div className="news-featured-content">
            <h3><i className="fas fa-crown"></i> {featuredTag}</h3>
            <h2>{featuredTitlePrefix} <span>{featuredTitleHighlight}</span></h2>
            <p>{featuredText}</p>
          </div>
          <div className="news-featured-image" onClick={() => openLightbox(0)}>
            <img src={newspaperData[featuredIndex]?.url} alt="Featured newspaper" />
            <div className="play-overlay">
              <span>{newspaperData[featuredIndex]?.label}</span>
              <i className="fas fa-expand-alt"></i>
            </div>
          </div>
        </div>

        <div className="news-header">
          <h2 className="section-title">{coverageHeading}</h2>
        </div>
        <div className="news-grid">
          {newspaperData.map((item, i) => (
            <div key={i} className="news-item" onClick={() => openLightbox(i)} style={{animationDelay: `${(i % 12) * 0.03}s`}}>
              <div className="news-item-badge">{item.label}</div>
              <div className="news-item-stamp">PRESS</div>
              <div className="news-item-inner">
                <img src={item.url} alt={item.label} loading="lazy" />
                <div className="news-item-overlay">
                  <span><i className="fas fa-search-plus"></i> Click to view</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={`lightbox${lightboxOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}>
        <button className="lightbox-close" onClick={closeLightbox}><i className="fas fa-times"></i></button>
        <button className="lightbox-prev" onClick={() => navigateLightbox(-1)}><i className="fas fa-chevron-left"></i></button>
        <img className="lightbox-img" src={newspaperData[currentIndex]?.url} alt="newspaper scan" />
        <button className="lightbox-next" onClick={() => navigateLightbox(1)}><i className="fas fa-chevron-right"></i></button>
        <div className="lightbox-counter">{currentIndex + 1} / {newspaperData.length}</div>
      </div>
    </>
  );
};

export default Newspaper;
