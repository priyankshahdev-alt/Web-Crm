import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';

export default function Home() {
  const { getSetting, getSection, getSlides, getStats } = useSite();

  // Live WebCrm content (falls back to the static sections when unavailable)
  const cmsSlides = getSlides();
  const liveHero = cmsSlides.length > 0;
  const siteName = getSetting('site.siteName', 'Being Sevak Charitable Trust');
  const waNumber = (getSetting('whatsapp.number', '') || getSetting('contact.phone', '')).replace(/\D+/g, '') || '918879035035';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${siteName}, I would like to know more.`)}`;
  const storySection = getSection('about', 'story');
  const storyParagraphs = (storySection?.content?.paragraphs || []).filter(
    (p) => p && p.trim(),
  );
  const aboutDesc =
    storyParagraphs.join(' ') || getSetting('site.description', '');
  const cmsStats = getStats();
  const staticStats = [
    { value: '20000', label: 'Women Supported' },
    { value: '12', label: 'States Connected' },
    { value: '4500', label: 'Support Programs' },
    { value: '300000', label: 'Supported Children' },
    { value: '1000000', label: 'Beneficiaries Reached' },
  ];
  const statsItems = cmsStats || staticStats;

  // Mobile menu


  // Quick Donate
  const [quickAmt, setQuickAmt] = useState(200);

  const [activePreset, setActivePreset] = useState(200);

  // Donation Basket
  const [basketOpen, setBasketOpen] = useState(false);
  const [cartQty, setCartQty] = useState({ annapurna: 0, vidhya: 0, aurat: 0, atma: 0, bezubaan: 0 });
  const [basketName, setBasketName] = useState('');
  const [basketPhone, setBasketPhone] = useState('');
  const [basketEmail, setBasketEmail] = useState('');
  const [showEmptyMsg, setShowEmptyMsg] = useState(false);
  const [basketPhoneErr, setBasketPhoneErr] = useState('');
  const [basketNameErr, setBasketNameErr] = useState('');
  const [basketEmailErr, setBasketEmailErr] = useState('');

  // Hero Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = liveHero ? cmsSlides.length : 8;

  // Impact Stories
  const [currentImpact, setCurrentImpact] = useState(0);
  const totalImpactSlides = 10;

  // Latest Updates Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);

  // Featured Projects
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const totalFeaturedSlides = 3;
  const featuredSliderRef = useRef(null);

  useEffect(() => {
    const box = featuredSliderRef.current;
    if (!box) return;
    const isMobile = () => window.innerWidth <= 768;
    let ticking = false;
    const onScroll = () => {
      if (!isMobile() || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollLeft = box.scrollLeft;
        const slideWidth = box.offsetWidth;
        if (slideWidth > 0) {
          const idx = Math.round(scrollLeft / slideWidth);
          setCurrentFeatured(Math.max(0, Math.min(idx, totalFeaturedSlides - 1)));
        }
        ticking = false;
      });
    };
    box.addEventListener('scroll', onScroll, { passive: true });
    return () => box.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToFeaturedSlide = (idx) => {
    const box = featuredSliderRef.current;
    if (!box || window.innerWidth > 768) return;
    const slideWidth = box.offsetWidth;
    box.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
  };

  // Impact Stats
  const impactRef = useRef(null);
  const [impactAnimated, setImpactAnimated] = useState(false);

  // Month data for modal
  const monthData = [
    { id: 'month-jan', label: 'Jan 2026', img: 'latesUpdates/JAN 2026.jpg' },
    { id: 'month-feb', label: 'Feb 2026', img: 'latesUpdates/FEB 2026.jpg' },
    { id: 'month-mar', label: 'Mar 2026', img: 'latesUpdates/MARCH 2026.jpg' },
    { id: 'month-apr', label: 'Apr 2026', img: 'latesUpdates/APRIL 2026.jpg' },
    { id: 'month-may', label: 'May 2026', img: '' }
  ];

  // Hero Slider Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // Impact Stats Animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !impactAnimated) {
            setImpactAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (impactRef.current) observer.observe(impactRef.current);
    return () => observer.disconnect();
  }, [impactAnimated]);

  const handlePresetClick = (val) => {
    setQuickAmt(val);
    setActivePreset(val);
  };

  const handleQuickDonate = () => {
    setBasketOpen(true);
  };

  // Donation Basket logic
  const UNIT_PRICE = { annapurna: 500, vidhya: 400, aurat: 300, atma: 600, bezubaan: 200 };
  const basketMissions = [
    { key: 'annapurna', icon: '\u{1F33E}', name: 'Mission Annapurna', desc: 'Dry Ration Kits & Mid-Day Meals for Visually Impaired & Underprivileged Individuals' },
    { key: 'vidhya', icon: '\u{1F4DA}', name: 'Mission Vidhya', desc: 'D.E.C \u2013 Digital Education Centre, Free digital education, Writing Pad & Stationery Kit Distribution' },
    { key: 'aurat', icon: '\u{1F469}', name: 'Mission Aurat', desc: 'Sanitary Pad Distribution & Hygiene Kit Distribution for underprivileged women' },
    { key: 'atma', icon: '\u{1F4AA}', name: 'Mission Atma Nirbhar', desc: 'Rozgaar Booth, Wheelchair & Tricycle Distribution, Sewing Machine & Flour Mill Distribution' },
    { key: 'bezubaan', icon: '\u{1F43E}', name: 'Mission Bezubaan', desc: 'Animal Feeding Center, Biscuit, Milk & Pedigree Distribution for stray animals' },
  ];
  const addMission = (key) => setCartQty(prev => ({ ...prev, [key]: 1 }));
  const removeMission = (key) => setCartQty(prev => ({ ...prev, [key]: 0 }));
  const changeQty = (key, delta) => setCartQty(prev => ({ ...prev, [key]: Math.max(1, prev[key] + delta) }));
  const basketTotal = Object.keys(cartQty).reduce((s, k) => s + cartQty[k] * UNIT_PRICE[k], 0);
  const proceedDonate = () => {
    if (basketTotal === 0) { setShowEmptyMsg(true); setTimeout(() => setShowEmptyMsg(false), 3000); return; }
    if (!basketName) { alert('Please enter your name.'); return; }
    if (!basketEmail) { alert('Please enter your email.'); return; }
    if (!basketPhone || basketPhone.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    const items = Object.entries(cartQty).filter(([, q]) => q > 0).map(([k, q]) => k + 'x' + q).join(', ');
    const rzp = new window.Razorpay({
      key: 'rzp_live_StUN8QoR2STezo',
      amount: basketTotal * 100,
      currency: 'INR',
      name: 'Being Sevak Charitable Trust',
      description: 'Donation - ' + items,
      image: '../logo11.png',
      handler: function (response) {
        window.location.href = 'payment/success.html?payment_id=' + response.razorpay_payment_id + '&amount=' + basketTotal + '&name=' + encodeURIComponent(basketName);
      },
      prefill: { name: basketName, email: basketEmail, contact: '+91' + basketPhone },
      notes: { missions: items },
      theme: { color: '#315371' }
    });
    rzp.on('payment.failed', function (response) {
      window.location.href = 'payment/failure.html?error=' + encodeURIComponent(response.error.description);
    });
    rzp.open();
  };

  const handleGooglePay = () => {
    if (basketTotal === 0) { setShowEmptyMsg(true); setTimeout(() => setShowEmptyMsg(false), 3000); return; }
    if (!basketName) { alert('Please enter your name.'); return; }
    if (!basketEmail) { alert('Please enter your email.'); return; }
    if (!basketPhone || basketPhone.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    const items = Object.entries(cartQty).filter(([, q]) => q > 0).map(([k, q]) => k + 'x' + q).join(', ');
    const rzp = new window.Razorpay({
      key: 'rzp_live_StUN8QoR2STezo',
      amount: basketTotal * 100,
      currency: 'INR',
      name: 'Being Sevak Charitable Trust',
      description: 'Donation - ' + items,
      image: '../logo11.png',
      handler: function (response) {
        window.location.href = 'payment/success.html?payment_id=' + response.razorpay_payment_id + '&amount=' + basketTotal + '&name=' + encodeURIComponent(basketName);
      },
      prefill: { name: basketName, email: basketEmail, contact: '+91' + basketPhone },
      notes: { missions: items },
      theme: { color: '#315371' },
      config: { display: { blocks: { upi: { instruments: [{ method: 'upi' }] } }, preferences: { show_default_blocks: true } } }
    });
    rzp.on('payment.failed', function (response) {
      window.location.href = 'payment/failure.html?error=' + encodeURIComponent(response.error.description);
    });
    rzp.open();
  };

  const handleBasketPhoneChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 10) {
      val = val.slice(0, 10);
      setBasketPhoneErr('Phone number must contain 10 digits.');
      setTimeout(() => setBasketPhoneErr(''), 2000);
      return;
    }
    setBasketPhone(val);
    setBasketPhoneErr('');
  };

  const handleBasketNameChange = (e) => {
    const val = e.target.value;
    if (/[^a-zA-Z\s]/.test(val)) {
      setBasketNameErr('Invalid name');
      setTimeout(() => setBasketNameErr(''), 2000);
      return;
    }
    setBasketName(val);
    setBasketNameErr('');
  };

  const handleBasketEmailChange = (e) => {
    const val = e.target.value;
    if (/[^a-zA-Z0-9@.]/.test(val)) {
      return;
    }
    setBasketEmail(val);
    setBasketEmailErr('');
  };

  const openModal = (idx) => {
    const data = monthData[idx];
    if (!data || !data.img) return;
    setCurrentMonthIdx(idx);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const prevMonth = () => {
    let idx = currentMonthIdx;
    do {
      idx = idx === 0 ? monthData.length - 1 : idx - 1;
    } while (!monthData[idx].img && idx !== currentMonthIdx);
    if (monthData[idx].img) {
      setCurrentMonthIdx(idx);
    }
  };

  const nextMonth = () => {
    let idx = currentMonthIdx;
    do {
      idx = idx === monthData.length - 1 ? 0 : idx + 1;
    } while (!monthData[idx].img && idx !== currentMonthIdx);
    if (monthData[idx].img) {
      setCurrentMonthIdx(idx);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = monthData[currentMonthIdx].img;
    link.download = monthData[currentMonthIdx].label.replace(/\s+/g, '_') + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevMonth();
      if (e.key === 'ArrowRight') nextMonth();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  // Animated counter helper
  const animateCounter = (target) => {
    if (!impactAnimated) return '0';
    return target;
  };

  return (
    <>
      <style>{`
        .basket-overlay{position:fixed;inset:0;background:rgba(30,51,71,0.45);z-index:10001}
        .basket-panel{position:fixed;top:0;right:-480px;width:460px;max-width:100vw;height:100vh;background:#fff;z-index:10002;display:flex;flex-direction:column;box-shadow:-4px 0 30px rgba(0,0,0,0.18);transition:right 0.35s cubic-bezier(.4,0,.2,1);font-family:'Open Sans',sans-serif;overflow:hidden}
        .basket-panel.open{right:0}
        .basket-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:2px solid #e6f7fd;flex-shrink:0;background:#fff}
        .basket-title{font-family:'Montserrat',sans-serif;font-size:16px;font-weight:800;color:#315371;letter-spacing:1px;margin:0}
        .basket-close{background:none;border:none;font-size:18px;color:#315371;cursor:pointer;padding:4px 8px;border-radius:4px;transition:background 0.15s}
        .basket-close:hover{background:#e6f7fd}
        .basket-scroll{flex:1;overflow-y:auto;display:flex;flex-direction:column}
        .b-mission-card{display:flex;align-items:flex-start;gap:12px;padding:14px 20px;border-bottom:1px solid #eef5f8;transition:background 0.15s}
        .b-mission-card:hover{background:#f6fbfc}
        .b-mission-card.in-cart{background:#e6f7fd;border-left:3px solid #00A3DA}
        .b-mission-icon{font-size:22px;flex-shrink:0;width:42px;height:42px;background:#e6f7fd;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .b-mission-info{flex:1;min-width:0}
        .b-mission-name{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:#315371;margin-bottom:4px}
        .b-mission-desc{font-size:11.5px;color:#666;line-height:1.5}
        .b-mission-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;min-width:80px}
        .b-mission-price{font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#315371}
        .b-mission-qty-row{display:none;align-items:center;gap:8px;background:white;border:1.5px solid #00A3DA;border-radius:20px;padding:3px 8px}
        .b-mission-card.in-cart .b-mission-qty-row{display:flex}
        .b-qty-btn{background:none;border:none;color:#315371;font-size:10px;cursor:pointer;padding:2px 3px;border-radius:3px;transition:background 0.1s}
        .b-qty-btn:hover{background:#e6f7fd}
        .b-qty-val{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:#315371;min-width:20px;text-align:center}
        .b-add-btn{background:#00A3DA;color:white;border:none;padding:6px 14px;border-radius:4px;font-size:12px;font-weight:700;font-family:'Montserrat',sans-serif;cursor:pointer;transition:background 0.15s}
        .b-add-btn:hover{background:#0088bb}
        .b-mission-card.in-cart .b-add-btn{display:none}
        .b-remove-btn{background:none;border:none;color:#e53935;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:3px;padding:2px 0;font-family:'Montserrat',sans-serif}
        .b-remove-btn:hover{text-decoration:underline}
        .b-mission-card.in-cart .b-remove-btn{display:flex !important}
        .basket-divider{height:1px;background:#e6f7fd;margin:0 20px;flex-shrink:0}
        .basket-personal{padding:14px 20px 8px;flex-shrink:0}
        .basket-section-title{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:#315371;margin-bottom:10px}
        .basket-input{width:100%;border:1.5px solid #c8dce6;border-radius:6px;padding:9px 12px;font-size:13px;font-family:'Open Sans',sans-serif;color:#333;margin-bottom:8px;outline:none;transition:border-color 0.2s;box-sizing:border-box}
        .basket-input:focus{border-color:#00A3DA}
        .basket-phone-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
        .phone-flag{background:#f0f8fc;border:1.5px solid #c8dce6;border-radius:6px;padding:9px 10px;font-size:13px;white-space:nowrap;flex-shrink:0}
        .phone-inp{margin-bottom:0 !important;flex:1}
        .basket-checkboxes{padding:6px 20px 10px;flex-shrink:0}
        .basket-check{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:#555;margin-bottom:7px;cursor:pointer;line-height:1.5}
        .basket-check input[type="checkbox"]{accent-color:#00A3DA;width:14px;height:14px;flex-shrink:0;margin-top:2px}
        .basket-footer{padding:16px 20px 28px;border-top:2px solid #e6f7fd;background:#f6fbfc;margin-top:auto}
        .basket-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
        .basket-total-label{font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:#315371}
        .basket-total-amt{font-family:'Montserrat',sans-serif;font-size:20px;font-weight:800;color:#315371}
        .gpay-btn{width:100%;background:#000;color:white;border:none;padding:14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-bottom:10px;transition:background 0.2s;letter-spacing:0.5px}
        .gpay-btn:hover{background:#1a1a1a}
        .basket-donate-btn{width:100%;background:#315371;color:white;border:none;padding:14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background 0.2s;letter-spacing:0.5px}
        .basket-donate-btn:hover{background:#00A3DA}
        .basket-empty-msg{display:none;text-align:center;color:#e53935;font-size:12px;margin-top:8px;font-family:'Montserrat',sans-serif}
        .basket-empty-msg.show{display:block}
        .basket-field-err{display:block;color:#e53935;font-size:11px;margin-top:4px;font-family:'Open Sans',sans-serif;padding-left:80px}
        .slide-content{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 8%;text-align:left;background:linear-gradient(to right,rgba(3,22,62,0.66),rgba(3,22,62,0.18) 60%,transparent)}
        .slide-title{font-family:'Montserrat',sans-serif;font-size:2.6rem;font-weight:900;color:#fff;text-transform:uppercase;line-height:1.15;margin-bottom:10px;max-width:760px}
        .slide-subtitle{font-family:'Open Sans',sans-serif;font-size:1.1rem;color:#eaf4fb;max-width:640px;margin-bottom:18px;line-height:1.6}
        .slide-cta{display:inline-block;background:#00A3DA;color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:0.9rem;padding:12px 28px;border-radius:4px;text-transform:uppercase;letter-spacing:1px;text-decoration:none;transition:background 0.2s}
        .slide-cta:hover{background:#315371}
        .slide-bg-mobile{display:none}
        @media(max-width:768px){.slide-title{font-size:1.5rem}.slide-subtitle{font-size:0.95rem}.slide-content{padding:0 6%}.slide-bg-mobile{display:block}}
        @media(max-width:500px){.basket-panel{width:100vw}}
      `}</style>

      {/* BEING SEVAK CHARITABLE TRUST ALERT BANNER */}
      <div className="alert-banner">
        <span className="alert-text">{siteName}</span>
        <Link to="/about" className="alert-link">Learn More</Link>
      </div>

      {/* QUICK DONATE BAR */}
      <div className="quick-donate-bar">
        <div className="qd-inner">
          <div className="currency-select">
            <span className="flag">🇮🇳</span>
            <span className="cur-code">INR</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="amount-input-wrap">
            <input
              type="number"
              placeholder="Amount"
              className="amount-input"
              value={quickAmt}
              onChange={(e) => setQuickAmt(e.target.value)}
            />
          </div>
          <button className={`preset-amt ${activePreset === 100 ? 'active' : ''}`} onClick={() => handlePresetClick(100)}>₹100 INR</button>
          <button className={`preset-amt ${activePreset === 150 ? 'active' : ''}`} onClick={() => handlePresetClick(150)}>₹150 INR</button>
          <button className={`preset-amt ${activePreset === 200 ? 'active' : ''}`} onClick={() => handlePresetClick(200)}>₹200 INR</button>
          <button className={`preset-amt ${activePreset === 500 ? 'active' : ''}`} onClick={() => handlePresetClick(500)}>₹500 INR</button>
          <div className="payment-icons">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="PayPal" className="pay-icon"
              onError={(e) => { e.target.outerHTML = '<span class="pay-icon-fb">PayPal</span>'; }} />
            <span className="pay-icon-text">VISA</span>
            <span className="pay-icon-text mc">MC</span>
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applepay.svg" alt="Apple Pay"
              className="pay-icon" onError={(e) => { e.target.outerHTML = '<span class="pay-icon-fb">Apple Pay</span>'; }} />
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlepay.svg" alt="Google Pay"
              className="pay-icon" onError={(e) => { e.target.outerHTML = '<span class="pay-icon-fb">G Pay</span>'; }} />
          </div>
          <div className="quick-donate-pulse-wrap">
            <div className="quick-donate-pulse-ring"></div>
            <div className="quick-donate-pulse-ring ring2"></div>
            <button className="quick-donate-btn" onClick={handleQuickDonate}>QUICK DONATE</button>
          </div>
        </div>
      </div>

      {/* HERO BANNER / SLIDESHOW */}
      <section className="hero-slider">
        {liveHero
          ? cmsSlides.map((s, i) => (
              <div className={`slide ${currentSlide === i ? 'active' : ''}`} key={s.id || i}>
                <div
                  className="slide-bg"
                  style={{ backgroundImage: `url(${s.imageUrl})` }}
                ></div>
                {s.mobileImageUrl && (
                  <div
                    className="slide-bg slide-bg-mobile"
                    style={{ backgroundImage: `url(${s.mobileImageUrl})` }}
                  ></div>
                )}
                {(s.title || s.subtitle || s.ctaLabel) && (
                  <div className="slide-content">
                    {s.title && <h2 className="slide-title">{s.title}</h2>}
                    {s.subtitle && <p className="slide-subtitle">{s.subtitle}</p>}
                    {s.ctaLabel && s.ctaUrl && (
                      <a href={s.ctaUrl} className="slide-cta">{s.ctaLabel}</a>
                    )}
                  </div>
                )}
              </div>
            ))
          : (
            <>
        <div className={`slide ${currentSlide === 0 ? 'active' : ''}`} id="slide1">
          <div className="slide-bg slide-bg-1"></div>
        </div>
        <div className={`slide ${currentSlide === 1 ? 'active' : ''}`} id="slide2">
          <div className="slide-bg slide-bg-2"></div>
        </div>
        <div className={`slide ${currentSlide === 2 ? 'active' : ''}`} id="slide3">
          <div className="slide-bg slide-bg-3"></div>
        </div>
        <div className={`slide ${currentSlide === 3 ? 'active' : ''}`} id="slide4">
          <div className="slide-bg slide-bg-4"></div>
        </div>
        <div className={`slide ${currentSlide === 4 ? 'active' : ''}`} id="slide5">
          <div className="slide-bg slide-bg-5"></div>
        </div>
        <div className={`slide ${currentSlide === 5 ? 'active' : ''}`} id="slide6">
          <div className="slide-bg slide-bg-6"></div>
        </div>
        <div className={`slide ${currentSlide === 6 ? 'active' : ''}`} id="slide7">
          <div className="slide-bg slide-bg-7"></div>
        </div>
        <div className={`slide ${currentSlide === 7 ? 'active' : ''}`} id="slide8">
          <div className="slide-bg slide-bg-8"></div>
        </div>
            </>
          )}
        <div className="slider-controls">
          <button className="slider-arrow prev" onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-dots">
            {[...Array(totalSlides)].map((_, i) => (
              <span
                key={i}
                className={`dot ${currentSlide === i ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              ></span>
            ))}
          </div>
          <button className="slider-arrow next" onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="about-left">
          <div className="single-image-box">
            <img src="images/about1.png" alt="Being Sevak" className="about-img" />
          </div>
        </div>
        <div className="about-right">
          <h2>ABOUT BEING SEVAK CHARITABLE TRUST</h2>
          <p>
            {aboutDesc ||
              'Being Sevak Charitable Trust is a national non-profit organization serving society since 2015 through healthcare, education, women empowerment, vocational training, and child development, inspired by the vision of "Sevak Bano" and selfless service.'}
          </p>
          <div className="about-boxes">
            <div className="about-box">
              <h3>Our Vision</h3>
              <p>To create a world where visually impaired, underprivileged children and education</p>
            </div>
            <div className="about-box">
              <h3>Our Mission</h3>
              <p>To empower and uplift the lives of visually impaired individuals livelihood</p>
            </div>
          </div>
          <Link to="/about" className="read-btn">Read More</Link>
        </div>
      </section>

      {/* CIRCLE MARQUEE SECTION */}
      <section className="logo-marquee-section">
        <div className="marquee">
          <div className="marquee-content">
            <div className="circle-box">
              <div className="circle">
                <img src="images/09.png" alt="" />
              </div>
              <h2>180000+</h2>
              <p>Mid-Day Meal</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/03.png" alt="" />
              </div>
              <h2>2500+</h2>
              <p>Medical Relief</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/02.png" alt="" />
              </div>
              <h2>40000+</h2>
              <p>Eye Care</p>
            </div>
            {/* DUPLICATE FOR SEAMLESS LOOP */}
            <div className="circle-box">
              <div className="circle">
                <img src="images/09.png" alt="" />
              </div>
              <h2>375000+</h2>
              <p>Sevak Meal</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/03.png" alt="" />
              </div>
              <h2>2500+</h2>
              <p>Medical Relief</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/04.png" alt="" />
              </div>
              <h2>650000+</h2>
              <p>Annapurna Kit</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/05.png" alt="" />
              </div>
              <h2>195000+</h2>
              <p>Vidhya Kit</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/06.png" alt="" />
              </div>
              <h2>125000+</h2>
              <p>Mission Aurat</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/07.png" alt="" />
              </div>
              <h2>3500+</h2>
              <p>Mission Bezubaan</p>
            </div>
            <div className="circle-box">
              <div className="circle">
                <img src="images/08.png" alt="" />
              </div>
              <h2>1200+</h2>
              <p>Digital Education Centre</p>
            </div>
          </div>
        </div>
      </section>

      {/* URGENT APPEALS */}
      <section className="causes-section">
        <div className="section-header">
          <h2>Urgent <span className="accent">Appeals</span></h2>
          <p>Every moment matters—people are struggling without basic needs</p>
        </div>
        <div className="causes-marquee">
          <div className="causes-track">
            <div className="cause-card">
              <div className="cause-img cause-img-1"></div>
              <div className="cause-body">
                <h3>Mission Annapurna</h3>
                <p>Dry Ration Kit , Mid-Day Meal , Snacks kit. Meals With Care.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '78%' }}></div>
                </div>
                <div className="cause-meta"><span>78% Funded</span><span>₹2,34,000 raised</span></div>
                <Link to="/mission-annapurna" className="cause-btn">Donate Now</Link>
              </div>
            </div>
            <div className="cause-card">
              <div className="cause-img cause-img-2"></div>
              <div className="cause-body">
                <h3>Mission Vidhya</h3>
                <p>Digital Education Center, Writing Pad Distribution, and Stationery Kit Distribution.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '55%' }}></div>
                </div>
                <div className="cause-meta"><span>55% Funded</span><span>₹1,12,000 raised</span></div>
                <Link to="/mission-vidhya" className="cause-btn">Donate Now</Link>
              </div>
            </div>
            <div className="cause-card">
              <div className="cause-img cause-img-3"></div>
              <div className="cause-body">
                <h3>Medical Emergency</h3>
                <p>Financial aid for critical treatments, surgeries, and emergency care.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '91%' }}></div>
                </div>
                <div className="cause-meta"><span>91% Funded</span><span>₹3,08,000 raised</span></div>
                <Link to="/mission-wellness" className="cause-btn">Donate Now</Link>
              </div>
            </div>
            <div className="cause-card">
              <div className="cause-img cause-img-4"></div>
              <div className="cause-body">
                <h3>Mission Atmanirbhar</h3>
                <p>Empowering lives through livelihood support and essential assistive tools.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '63%' }}></div>
                </div>
                <div className="cause-meta"><span>63% Funded</span><span>₹1,74,000 raised</span></div>
                <Link to="/mission-atmanirbhar" className="cause-btn">Donate Now</Link>
              </div>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="cause-card">
              <div className="cause-img cause-img-1"></div>
              <div className="cause-body">
                <h3>Mission Annapurna</h3>
                <p>Dry Ration Kit , Mid-Day Meal , Snacks kit. Meals With Care.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '78%' }}></div>
                </div>
                <div className="cause-meta"><span>78% Funded</span><span>₹2,34,000 raised</span></div>
                <Link to="/mission-annapurna" className="cause-btn">Donate Now</Link>
              </div>
            </div>
            <div className="cause-card">
              <div className="cause-img cause-img-2"></div>
              <div className="cause-body">
                <h3>Mission Vidhya</h3>
                <p>Digital Education Center, Writing Pad Distribution, and Stationery Kit Distribution.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '55%' }}></div>
                </div>
                <div className="cause-meta"><span>55% Funded</span><span>₹1,12,000 raised</span></div>
                <Link to="/mission-vidhya" className="cause-btn">Donate Now</Link>
              </div>
            </div>
            <div className="cause-card">
              <div className="cause-img cause-img-3"></div>
              <div className="cause-body">
                <h3>Medical Emergency</h3>
                <p>Financial aid for critical treatments, surgeries, and emergency care.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '91%' }}></div>
                </div>
                <div className="cause-meta"><span>91% Funded</span><span>₹3,08,000 raised</span></div>
                <Link to="/mission-wellness" className="cause-btn">Donate Now</Link>
              </div>
            </div>
            <div className="cause-card">
              <div className="cause-img cause-img-4"></div>
              <div className="cause-body">
                <h3>Mission Atmanirbhar</h3>
                <p>Empowering lives through livelihood support and essential assistive tools.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '63%' }}></div>
                </div>
                <div className="cause-meta"><span>63% Funded</span><span>₹1,74,000 raised</span></div>
                <Link to="/mission-atmanirbhar" className="cause-btn">Donate Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STORIES */}
      <section className="being-impact-slider">
        <div className="section-header">
          <h2>Impact <span className="accent">Stories</span></h2>
          <p>Real Change Through Our Work</p>
        </div>
        <div className="being-slider-box">
          <Link to="/impact/rozgaar-booth" className={`being-slide ${currentImpact === 0 ? 'active' : ''}`}>
            <img src="images/i8.jpg" alt="Rozgaar Booth" />
            <div className="being-text">
              <h3>Rozgaar Booth</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/baby-feeding" className={`being-slide ${currentImpact === 1 ? 'active' : ''}`}>
            <img src="images/i6.jpg" alt="Baby Feeding Centre" />
            <div className="being-text">
              <h3>Baby Feeding Centre</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/tricycle" className={`being-slide ${currentImpact === 2 ? 'active' : ''}`}>
            <img src="images/i7.jpg" alt="Tricycle To Lifecycle" />
            <div className="being-text">
              <h3>Tricycle To Lifecycle</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/sewing-machine" className={`being-slide ${currentImpact === 3 ? 'active' : ''}`}>
            <img src="images/i9.png" alt="Sewing Machine" />
            <div className="being-text">
              <h3>Sewing Machine</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/flour-mill" className={`being-slide ${currentImpact === 4 ? 'active' : ''}`}>
            <img src="images/floormill.png" alt="Flour Mill distribution" />
            <div className="being-text">
              <h3>Flour Mill distribution</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/emergency-medical" className={`being-slide ${currentImpact === 5 ? 'active' : ''}`}>
            <img src="images/i5.jpg" alt="Medical Support" />
            <div className="being-text">
              <h3>Medical Support</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/health-to-hygiene" className={`being-slide ${currentImpact === 6 ? 'active' : ''}`}>
            <img src="images/i4.jpg" alt="Health To Hygiene(H2)" />
            <div className="being-text">
              <h3>Health To Hygiene(H2)</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/sanitary-pad" className={`being-slide ${currentImpact === 7 ? 'active' : ''}`}>
            <img src="images/i1.jpg" alt="Sanitary Pad Vending Machine" />
            <div className="being-text">
              <h3>Sanitary Pad Vending Machine</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/dialysis-center" className={`being-slide ${currentImpact === 8 ? 'active' : ''}`}>
            <img src="images/dialysis.png" alt="Dialysis Center" />
            <div className="being-text">
              <h3>Dialysis Center</h3>
              <p>Read More</p>
            </div>
          </Link>
          <Link to="/impact/bottle-crusher" className={`being-slide ${currentImpact === 9 ? 'active' : ''}`}>
            <img src="images/i2.jpg" alt="Bottle crusher Machine" />
            <div className="being-text">
              <h3>Bottle crusher Machine</h3>
              <p>Read More</p>
            </div>
          </Link>
        </div>
        <div className="being-dots">
          {[...Array(totalImpactSlides)].map((_, i) => (
            <span
              key={i}
              className={`being-dot ${currentImpact === i ? 'active' : ''}`}
              onClick={() => setCurrentImpact(i)}
            ></span>
          ))}
        </div>
      </section>

      {/* MOST NEEDED CAUSES */}
      <section className="causes-section">
        <div className="section-header">
          <h2>Most <span className="accent">Needed</span></h2>
          <p>Every moment matters—people are struggling without basic needs</p>
        </div>
        <div className="causes-grid">
          <div className="cause-card">
            <div className="cause-img cause-img-5"></div>
            <div className="cause-body">
              <h3>Mission Bezubaan</h3>
              <p>Animal feeding support, paw care services, and Pedigree distribution.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '78%' }}></div>
              </div>
              <div className="cause-meta"><span>78% Funded</span><span>₹2,34,000 raised</span></div>
              <Link to="/mission-bezubaan" className="cause-btn">Donate Now</Link>
            </div>
          </div>
          <div className="cause-card">
            <div className="cause-img cause-img-6"></div>
            <div className="cause-body">
              <h3>Project H2</h3>
              <p>Clean water and washroom facilities for schools.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '55%' }}></div>
              </div>
              <div className="cause-meta"><span>55% Funded</span><span>₹1,12,000 raised</span></div>
              <Link to="/mission-wellness" className="cause-btn">Donate Now</Link>
            </div>
          </div>
          <div className="cause-card">
            <div className="cause-img cause-img-7"></div>
            <div className="cause-body">
              <h3>Baby Feeding Booth</h3>
              <p>Safe and hygienic baby feeding booths for mothers and child care in government hospitals.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '91%' }}></div>
              </div>
              <div className="cause-meta"><span>91% Funded</span><span>₹3,08,000 raised</span></div>
              <Link to="/mission-aurat" className="cause-btn">Donate Now</Link>
            </div>
          </div>
          <div className="cause-card">
            <div className="cause-img cause-img-8"></div>
            <div className="cause-body">
              <h3>Sevak Niwas</h3>
              <p>provides housing, care and dignity to visually impaired individuals and families in need.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '63%' }}></div>
              </div>
              <div className="cause-meta"><span>63% Funded</span><span>₹1,74,000 raised</span></div>
              <Link to="/sevak-nivash" className="cause-btn">Donate Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT EDUCATION */}
      <section className="donation-section">
        <div className="donation-images">
          <div className="img-box img1">
            <img src="images/supportedu.png" alt="" />
          </div>
        </div>
        <div className="donation-content">
          <span className="small-title">
            <h3>Support Education</h3>
          </span>
          <h1>
            Help Us Transform <br />
            A Child's Life
          </h1>
          <div className="info-card">
            <h3>For only Rs.1250/- per month,</h3>
            <p>you can keep a child in school.</p>
          </div>
          <div className="info-card second-card">
            <p>Your support can give education, hope and a brighter future to a needy child.</p>
          </div>
          <a href="#" className="give-btn-btn">Give Now</a>
        </div>
      </section>

      {/* EYE HEALTH PROGRAMME */}
      <section className="eye-health-slide">
        <div className="eye-img">
          <img src="images/eye.jpeg" alt="Eye Health" />
        </div>
        <div className="eye-content">
          <span className="tag">Sevak Eye Health Programme</span>
          <h2>
            Protecting Vision <br />
            With Compassion
          </h2>
          <p>
            Being Sevak Charitable Trust believes prevention is better than cure.
            Through eye screenings, spectacles and cataract surgeries,
            we help thousands restore better eyesight.
          </p>
          <div className="stats">
            <div className="stat-box">
              <h3>9225+</h3>
              <span>Eye Screenings</span>
            </div>
            <div className="stat-box">
              <h3>5156+</h3>
              <span>People Refracted</span>
            </div>
            <div className="stat-box">
              <h3>4389+</h3>
              <span>Spectacles Dispensed</span>
            </div>
            <div className="stat-box">
              <h3>767+</h3>
              <span>Cataract Surgeries</span>
            </div>
          </div>
          <Link to="/donate" className="donate-btn">
            Donate Now
          </Link>
        </div>
      </section>

      {/* CELEBRITY NOTES */}
      <section className="celebrity-section">
        <div className="section-header">
          <h2>Celebrity <span className="accent">Notes</span></h2>
          <p>Recognitions and appreciation from notable personalities</p>
        </div>
        <div className="celebrity-slider-box">
          <div className={`celebrity-slide ${currentSlide % 2 === 0 ? 'active' : ''}`}>
            <div className="celebrity-card">
              <img src="images/celebritynote/1.jpg" alt="Celebrity Note 1" />
            </div>
            <div className="celebrity-card">
              <img src="images/celebritynote/2.jpg" alt="Celebrity Note 2" />
            </div>
          </div>
          <div className={`celebrity-slide ${currentSlide % 2 === 1 ? 'active' : ''}`}>
            <div className="celebrity-card">
              <img src="images/celebritynote/3.jpg" alt="Celebrity Note 3" />
            </div>
            <div className="celebrity-card">
              <img src="images/celebritynote/4.jpg" alt="Celebrity Note 4" />
            </div>
          </div>
        </div>
        <div className="celebrity-dots">
          <span className={`celebrity-dot ${currentSlide % 2 === 0 ? 'active' : ''}`}></span>
          <span className={`celebrity-dot ${currentSlide % 2 === 1 ? 'active' : ''}`}></span>
        </div>
      </section>

      {/* METRO STATION INITIATIVE */}
      <section className="metro-section">
        <div className="metro-box">
          <div className="metro-images">
            <div className="metro-hero-img">
              <img src="images/bottelmetro.jpeg" alt="Metro Station Initiative" />
              <div className="metro-hero-overlay"></div>
            </div>
            <div className="metro-image-grid">
              <div className="metro-img-box">
                <div className="metro-img-wrapper">
                  <img src="images/bottle.JPG" alt="Bottle Crusher Machine" />
                  <span className="metro-img-label">Bottle Crusher Machine</span>
                </div>
                <div className="metro-img-footer">
                  <h3 className="metro-price">₹1,80,000</h3>
                  <Link to="/donate" className="metro-donate-btn">DONATE NOW</Link>
                </div>
              </div>
              <div className="metro-img-box">
                <div className="metro-img-wrapper">
                  <img src="images/sanitary.JPG" alt="Sanitary Pad Vending Machine" />
                  <span className="metro-img-label">Sanitary Pad Vending Machine</span>
                </div>
                <div className="metro-img-footer">
                  <h3 className="metro-price">₹7,000</h3>
                  <Link to="/donate" className="metro-donate-btn">DONATE NOW</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="metro-content">
            <h2>Transforming Metro Stations with Care & Community</h2>
            <div className="metro-line"></div>
            <p>
              In partnership with metro authorities, Being Sevak Charitable Trust is dedicated Is to transformed metro
              stations into cleaner, safer, and more compassionate public spaces for every commuter. With a vision rooted in
              social responsibility and community well-being, we strive to make everyday travel more dignified, sustainable,
              and accessible for all.
            </p>
            <p>
              Through impactful urban welfare initiatives, we have installed
              <strong>Bottle Crusher Machines</strong>
              at metro stations to encourage responsible plastic disposal and promote environmental awareness among
              thousands of daily passengers. By turning waste management into a community movement, we aim to inspire
              cleaner habits and contribute towards a greener future.
            </p>
            <p>
              Understanding the importance of
              <strong>women's health, dignity, and hygiene</strong>,
              we have also introduced
              <strong>Digital Sanitary Pad Vending Machines</strong>
              to provide easy and reliable access to essential hygiene products within metro premises. This initiative
              supports women commuters with convenience, care, and confidence during their daily journeys.
            </p>
            <p>
              Every initiative we undertake is a step towards creating
              <strong>people-centric infrastructure</strong>
              that not only serves commuters but also nurtures
              <strong>social awareness, environmental responsibility, and inclusive urban development</strong>.
              Through compassion-driven action, we continue working towards a future where public spaces reflect care,
              humanity, and sustainability for every citizen.
            </p>
          </div>
        </div>
      </section>

      {/* OUR PROMISE */}
      <section className="promise-xection">
        <div className="promise-box">
          <div className="promise-logo">
            <img src="logo11.png" alt="NGO Logo" />
          </div>
          <div className="promise-content">
            <h2>OUR PROMISE TO YOU :</h2>
            <div className="promise-line"></div>
            <p>
              Every donation you make helps us serve people with dignity,
              compassion, and transparency. Our mission is to bring hope,
              support, and positive change to communities in need through
              food distribution, healthcare, education, and humanitarian aid.
            </p>
            <p>
              We believe in creating impact with honesty and care. Together,
              we can build a better future and spread kindness to every life
              we touch.
            </p>
          </div>
        </div>
      </section>

      {/* OUR ACTIVITIES */}
      <section className="how-we-work">
        <div className="section-header">
          <h2>Our <span className="accent">Activities</span></h2>
          <p>Your donation reaches those who need it most</p>
        </div>
        <div className="slider-wrapper">
          <div className="slider-track">
            <div className="circle-card">
              <img src="images/Hospitalization&HealthCareIMG.jpg" alt="" />
              <h3>Hospitalization & Health Care</h3>
              <p className="circle-desc">Due to the low financial condition, no proper health care</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/NewClothingDistribution.jpg" alt="" />
              <h3>New Clothing Distribution</h3>
              <p className="circle-desc">For someone who cannot even afford daily meals, even a</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/CelebrationofNationalPrograms.jpg" alt="" />
              <h3>Celebration of National Program</h3>
              <p className="circle-desc">To keep the fire of patriotism burning in the hearts</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/ReliefforDialysisPatients.jpg" alt="" />
              <h3>Relief for Dialysis Patients</h3>
              <p className="circle-desc">To add happiness to the lives of dialysis patients, we</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/SwachhBharatAwarenessCampaign.jpg" alt="" />
              <h3>Awareness for Swatch Bharat</h3>
              <p className="circle-desc">In this program we try to motivate people by organizing</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/BLIND.jpg" alt="" />
              <h3>Blind Widow Care</h3>
              <p className="circle-desc">Our organization takes special care for the widow as they</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/AwarenessCampaign.jpg" alt="" />
              <h3>Public Awareness</h3>
              <p className="circle-desc">Road Safety Awareness Campaign - Our main motto of this</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/EducationFacilitiesforBlind&UnderprivilegedChildren.jpg" alt="" />
              <h3>Education Facilities for Blind & Underprivileged Children</h3>
              <p className="circle-desc">Education at grass-root level is the need of the hour!</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/SevakGameswithMembers.jpg" alt="" />
              <h3>Sevak Games with Members</h3>
              <p className="circle-desc">Our organization celebrates "SEVAK GAMES" every year for specially abled</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/sevakMemCard.jpg" alt="" />
              <h3>Sevak Membership Card</h3>
              <p className="circle-desc">At present our organization has many registered members. To provide</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/Matrimonial.jpeg" alt="" />
              <h3>Matrimonial Program</h3>
              <p className="circle-desc">As we all know couples are made in heaven and</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/houserepair.jpg" alt="" />
              <h3>House Repairing Activity</h3>
              <p className="circle-desc">Sevak team arranged house repairing activities for our Blind and</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/EyeCamp.jpg" alt="" />
              <h3>Eye Camp</h3>
              <p className="circle-desc">The reality is that most of the blind people in</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/Pandemic-1.jpg" alt="" />
              <h3>Pandemic relief support for Covid-19</h3>
              <p className="circle-desc">Starting April 2020, Being Sevak Charitable Trust has organized programs</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/DryRationKitDistribution.jpg" alt="" />
              <h3>Dry Ration Kit</h3>
              <p className="circle-desc">Providing essential food supplies to needy families.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/Mid-DayMealProgram.jpg" alt="" />
              <h3>Mid-Day Meal</h3>
              <p className="circle-desc">Nutritious meals for underprivileged and visually impaired individuals.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/SNACKSKit.jpg" alt="" />
              <h3>Snacks Kit</h3>
              <p className="circle-desc">Distributing healthy snack kits to underserved communities.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/D.E.C2.jpg" alt="" />
              <h3>Digital Education Centre</h3>
              <p className="circle-desc">Empowering children through free digital learning access.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/stationarykit.jpg" alt="" />
              <h3>Stationery Kit Distribution</h3>
              <p className="circle-desc">Providing school stationery kits to needy students.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/Rozgharnew.jpeg" alt="" />
              <h3>Rozgaar Booth</h3>
              <p className="circle-desc">Creating employment opportunities for financially struggling families.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/activity1.jpg" alt="" />
              <h3>Wheelchair & Tricycle Distribution</h3>
              <p className="circle-desc">Restoring mobility and independence for specially-abled individuals.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/SewingMachineDistribution.jpg" alt="" />
              <h3>Sewing Machine Distribution</h3>
              <p className="circle-desc">Empowering women through self-employment and skill support.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/FlourMillDistribution.jpg" alt="" />
              <h3>Floor Mill Distribution</h3>
              <p className="circle-desc">Supporting sustainable income generation for needy families.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/SchoolRenovationProject.jpg" alt="" />
              <h3>School Renovation</h3>
              <p className="circle-desc">Improving school infrastructure for better student learning.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/FinancialAssistanceProgram.jpg" alt="" />
              <h3>Financial assistance Program</h3>
              <p className="circle-desc">Supporting sustainable income generation for needy families.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/HandwashingStationInstallation.jpg" alt="" />
              <h3>Handwashing Station</h3>
              <p className="circle-desc">Promoting hygiene and cleanliness among school children.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/TreePlantationDrive.jpg" alt="" />
              <h3>Tree Plantation</h3>
              <p className="circle-desc">Creating a greener and healthier environment for future generations.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/bloodDonation.jpg" alt="" />
              <h3>Blood Donation camp</h3>
              <p className="circle-desc">Saving lives through voluntary blood donation and promoting community health awareness.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/BottleCrusherMachineInitiative.jpg" alt="" />
              <h3>Bottle Crusher Machine</h3>
              <p className="circle-desc">Encouraging plastic recycling and environmental sustainability.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/AnimalFeedingCenter.jpg" alt="" />
              <h3>Animal Feeding Center</h3>
              <p className="circle-desc">Providing food and care for stray and abandoned animals.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/sanitarypadkit.jpg" alt="" />
              <h3>Sanitary Pad Distribution</h3>
              <p className="circle-desc">Promoting menstrual hygiene awareness among women and girls.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/HygieneKitDistribution.jpg" alt="" />
              <h3>Hygiene Kit Distribution</h3>
              <p className="circle-desc">Providing essential hygiene kits to underprivileged communities.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/BabyCare.jpg" alt="" />
              <h3>Baby Care Center</h3>
              <p className="circle-desc">Supporting mothers and newborns with safe care facilities.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/Dialysis Centre.png" alt="" />
              <h3>Dialysis Centre</h3>
              <p className="circle-desc">Providing affordable dialysis treatment for needy patients.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
            <div className="circle-card">
              <img src="images/BEACHcleaning.png" alt="" />
              <h3>Beach Cleaning Drives</h3>
              <p className="circle-desc">Organizing cleanliness drives to protect marine environments.</p>
              <a href="#" className="circle-read-more">Read More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PARTNERS */}
      <section className="projects-section">
        <div className="projects-hero">
          <img src="banner.jpg" alt="Our Partners" />
          <div className="overlay">
            <h1>OUR <span>PARTNERS</span></h1>
            <p>Together with our partners, we work to bring hope, care, and support to those in need</p>
          </div>
        </div>
        <div className="partners-marquee">
          <div className="partners-track">
            <div className="projects-grid">
              {['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png','20.png','21.png','22.png','23.png','24.png','25.png'].map((src,i)=>(
                <div className="project-card" key={i}><img src={'images/'+src} alt="" /></div>
              ))}
            </div>
            <div className="projects-grid duplicate">
              {['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png','20.png','21.png','22.png','23.png','24.png','25.png'].map((src,i)=>(
                <div className="project-card" key={'d'+i}><img src={'images/'+src} alt="" /></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="impact-section" ref={impactRef}>
        <div className="impact-inner">
          <div className="impact-title">
            <h2>11 Years of <span className="accent-light">Impact</span></h2>
            <p>Since 2015, Being Sevak has been serving communities across India</p>
          </div>
          <div className="stats-grid">
            {statsItems.map((it, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-num" data-target={it.value}>{impactAnimated ? it.value : '0'}</span>
                <span className="stat-label">{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <br />

      {/* DONOR TESTIMONIALS */}
      <section className="donor-testimonial-section">
        <div className="section-title">
          <h2>What Our Donors Says</h2>
          <p>Voices of kindness that inspire our mission</p>
        </div>
        <div className="testimonial-track">
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>Supporting this NGO has been one of the most meaningful decisions of my life. Seeing smiles on children's faces and families getting support gives real happiness.</p>
            <div className="donor-info">
              <h4>Riya Sharma</h4>
              <span>Supportive Donor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>This organization is truly changing lives with honesty and dedication. Every donation reaches people who genuinely need help and care.</p>
            <div className="donor-info">
              <h4>Rahul Mehta</h4>
              <span>Monthly Contributor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>I feel proud to be connected with such a beautiful cause. The impact they create in education, food distribution, and healthcare is inspiring.</p>
            <div className="donor-info">
              <h4>Neha Patel</h4>
              <span>Kind Heart Donor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>Being part of this mission has been a blessing. The transparency and dedication of Being Sevak is remarkable.</p>
            <div className="donor-info">
              <h4>Amit Verma</h4>
              <span>Proud Donor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>I have seen the ground work they do. Every rupee is used wisely for those who truly need it.</p>
            <div className="donor-info">
              <h4>Priya Singh</h4>
              <span>Regular Contributor</span>
            </div>
          </div>
          {/* Duplicates for seamless loop */}
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>Supporting this NGO has been one of the most meaningful decisions of my life. Seeing smiles on children's faces and families getting support gives real happiness.</p>
            <div className="donor-info">
              <h4>Riya Sharma</h4>
              <span>Supportive Donor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>This organization is truly changing lives with honesty and dedication. Every donation reaches people who genuinely need help and care.</p>
            <div className="donor-info">
              <h4>Rahul Mehta</h4>
              <span>Monthly Contributor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>I feel proud to be connected with such a beautiful cause. The impact they create in education, food distribution, and healthcare is inspiring.</p>
            <div className="donor-info">
              <h4>Neha Patel</h4>
              <span>Kind Heart Donor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>Being part of this mission has been a blessing. The transparency and dedication of Being Sevak is remarkable.</p>
            <div className="donor-info">
              <h4>Amit Verma</h4>
              <span>Proud Donor</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">❝</div>
            <p>I have seen the ground work they do. Every rupee is used wisely for those who truly need it.</p>
            <div className="donor-info">
              <h4>Priya Singh</h4>
              <span>Regular Contributor</span>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST UPDATES */}
      <section className="how-we-work">
        <div className="section-header">
          <h2>Latest <span className="accent">Updates</span></h2>
          <p>Stay informed with our recent activities and announcements</p>
        </div>
        <div className="month-updates">
          <div className="month-tabs">
            {monthData.map((m, idx) => (
              <button
                key={m.id}
                className={`month-tab ${currentMonthIdx === idx && modalOpen ? 'checked' : ''}`}
                onClick={() => openModal(idx)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MONTH MODAL */}
      <div className={`month-modal ${modalOpen ? 'open' : ''}`}>
        <div className="month-modal-overlay" onClick={closeModal}></div>
        <div className="month-modal-content">
          <button className="month-modal-close" onClick={closeModal}><i className="fas fa-times"></i></button>
          <button className="month-modal-download" title="Download Image" onClick={handleDownload}><i className="fas fa-download"></i></button>
          <button className="month-modal-nav prev" onClick={prevMonth}><i className="fas fa-chevron-left"></i></button>
          <button className="month-modal-nav next" onClick={nextMonth}><i className="fas fa-chevron-right"></i></button>
          <img src={monthData[currentMonthIdx].img} alt="Monthly Update" />
          <div className="month-modal-caption">{monthData[currentMonthIdx].label}</div>
        </div>
      </div>

      {/* FEATURED PROJECTS */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured <span className="accent">Projects</span></h2>
          <p>Make a direct impact with these urgent campaigns</p>
        </div>
        <div className="featured-slider-box" ref={featuredSliderRef}>
          <div className={`featured-slide ${currentFeatured === 0 ? 'active' : ''}`}>
            <div className="featured-card">
              <div className="feat-img" style={{ backgroundImage: "url('images/Matrimonial.jpeg')" }}></div>
              <div className="feat-overlay">
                <span className="feat-tag">EMPOWERMENT</span>
                <h3>Blind Vivah</h3>
                <p>Empowering visually impaired individuals through skill development and independent living.</p>
                <Link to="/donate" className="feat-btn">Give Now</Link>
              </div>
            </div>
            <div className="featured-card">
              <div className="feat-img" style={{ backgroundImage: "url('images/rasaoighar.jpeg')" }}></div>
              <div className="feat-overlay">
                <span className="feat-tag">FOOD</span>
                <h3>Rasoi Ghar</h3>
                <p>Providing nutritious meals to underprivileged communities with dignity and care.</p>
                <Link to="/donate" className="feat-btn">Give Now</Link>
              </div>
            </div>
          </div>
          <div className={`featured-slide ${currentFeatured === 1 ? 'active' : ''}`}>
            <div className="featured-card">
              <div className="feat-img" style={{ backgroundImage: "url('images/D.E.C.jpg')" }}></div>
              <div className="feat-overlay">
                <span className="feat-tag">EDUCATION</span>
                <h3>Digital Education Centre</h3>
                <p>Bridging the digital divide with free computer literacy and online learning access.</p>
                <Link to="/donate" className="feat-btn">Give Now</Link>
              </div>
            </div>
            <div className="featured-card">
              <div className="feat-img" style={{ backgroundImage: "url('images/physiotherepy.jpeg')" }}></div>
              <div className="feat-overlay">
                <span className="feat-tag">HEALTH</span>
                <h3>Physiotherapy Centre</h3>
                <p>Providing free physiotherapy and rehabilitation services for those in need.</p>
                <Link to="/donate" className="feat-btn">Give Now</Link>
              </div>
            </div>
          </div>
          <div className={`featured-slide ${currentFeatured === 2 ? 'active' : ''}`}>
            <div className="featured-card">
              <div className="feat-img" style={{ backgroundImage: "url('images/library.jpeg')" }}></div>
              <div className="feat-overlay">
                <span className="feat-tag">EDUCATION</span>
                <h3>Library Centre</h3>
                <p>Establishing community libraries to promote reading and self-learning among underprivileged students.</p>
                <Link to="/donate" className="feat-btn">Give Now</Link>
              </div>
            </div>
            <div className="featured-card">
              <div className="feat-img" style={{ backgroundImage: "url('images/womenempoerment.jpeg')" }}></div>
              <div className="feat-overlay">
                <span className="feat-tag">EMPOWERMENT</span>
                <h3>Women Empowerment & Self Employment Unit</h3>
                <p>Providing skill training and livelihood opportunities for women to achieve financial independence.</p>
                <Link to="/donate" className="feat-btn">Give Now</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="featured-dots">
          {[...Array(totalFeaturedSlides)].map((_, i) => (
            <span
              key={i}
              className={`featured-dot ${currentFeatured === i ? 'active' : ''}`}
              onClick={() => { setCurrentFeatured(i); scrollToFeaturedSlide(i); }}
            ></span>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="newsletter-inner">
          <div className="nl-text">
            <h2>Stay <span className="accent">Connected</span></h2>
            <p>Get updates on our projects, campaigns and impact stories</p>
          </div>
          <div className="nl-form">
            <input type="email" placeholder="Enter your email address" className="nl-input" />
            <button className="nl-btn">SUBSCRIBE</button>
          </div>
        </div>
      </section>

      {/* Donation Basket Overlay */}
      {basketOpen && <div className="basket-overlay" onClick={() => setBasketOpen(false)}></div>}

      {/* Donation Basket Panel */}
      <div className={`basket-panel${basketOpen ? ' open' : ''}`}>
        <div className="basket-header">
          <h2 className="basket-title">YOUR DONATION BASKET</h2>
          <button className="basket-close" onClick={() => setBasketOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="basket-scroll">
          {basketMissions.map(m => (
            <div key={m.key} className={`b-mission-card${cartQty[m.key] > 0 ? ' in-cart' : ''}`}>
              <div className="b-mission-icon">{m.icon}</div>
              <div className="b-mission-info">
                <div className="b-mission-name">{m.name}</div>
                <div className="b-mission-desc">{m.desc}</div>
              </div>
              <div className="b-mission-right">
                <div className="b-mission-price">{cartQty[m.key] > 0 ? `\u20B9${(cartQty[m.key] * UNIT_PRICE[m.key]).toLocaleString('en-IN')}` : '\u20B90'}</div>
                <div className="b-mission-qty-row">
                  <button className="b-qty-btn" onClick={() => changeQty(m.key, -1)}><i className="fas fa-minus"></i></button>
                  <span className="b-qty-val">{cartQty[m.key]}</span>
                  <button className="b-qty-btn" onClick={() => changeQty(m.key, 1)}><i className="fas fa-plus"></i></button>
                </div>
                <button className="b-add-btn" onClick={() => addMission(m.key)}>Add</button>
              </div>
            </div>
          ))}
          <div className="basket-divider"></div>
          <div className="basket-personal">
            <h3 className="basket-section-title">Your Details</h3>
            <input type="text" className="basket-input" placeholder="Enter your name" value={basketName} onChange={handleBasketNameChange} />
            {basketNameErr && <span className="basket-field-err">{basketNameErr}</span>}
            <div className="basket-phone-row">
              <span className="phone-flag">&#127470;&#127475; +91</span>
              <input type="tel" className="basket-input phone-inp" placeholder="Phone number" value={basketPhone} onChange={handleBasketPhoneChange} />
            </div>
            {basketPhoneErr && <span className="basket-field-err">{basketPhoneErr}</span>}
            <input type="email" className="basket-input" placeholder="Enter your email" value={basketEmail} onChange={handleBasketEmailChange} />
            {basketEmailErr && <span className="basket-field-err">{basketEmailErr}</span>}
          </div>
          <div className="basket-checkboxes">
            <label className="basket-check"><input type="checkbox" /> Send me impact updates via email</label>
            <label className="basket-check"><input type="checkbox" /> Send me WhatsApp/SMS updates</label>
            <label className="basket-check"><input type="checkbox" /> I have read and understood the <Link to="/terms" style={{color:'#00A3DA'}}>donation policy</Link></label>
          </div>
          <div className="basket-footer">
            <div className="basket-total-row">
              <span className="basket-total-label">Total</span>
              <span className="basket-total-amt">{'\u20B9'}{basketTotal.toLocaleString('en-IN')} INR</span>
            </div>
            <button className="gpay-btn" onClick={handleGooglePay}>Google Pay</button>
            <button className="basket-donate-btn" onClick={proceedDonate}>
              <i className="fas fa-heart"></i> Donate Now
            </button>
            <p className={`basket-empty-msg${showEmptyMsg ? ' show' : ''}`}>Please add at least one mission to donate.</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
}
