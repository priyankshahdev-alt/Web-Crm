import { useEffect, useRef, useCallback } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const WhereWeWork = () => {
  const content = usePageContent('where-we-work');
  const activeLocRef = useRef(null);
  const countersStarted = useRef(false);

  const pageTitle = content('www-title', 'heading') ?? 'Where We Work';

  const heroTag = content('www-hero', 'tag') ?? 'BEING SEVAK CHARITABLE TRUST';
  const heroHeading = content('www-hero', 'heading') ?? 'Where We';
  const heroHighlight = content('www-hero', 'highlight') ?? 'Work';
  const heroDescription =
    content('www-hero', 'description') ??
    'Actively working across multiple states in India through initiatives focused on education, nourishment, healthcare, empowerment and social welfare.';
  const heroCard1Value = content('www-hero', 'card1Value') ?? '12';
  const heroCard1Label = content('www-hero', 'card1Label') ?? 'States';
  const heroCard2Value = content('www-hero', 'card2Value') ?? '5,000+';
  const heroCard2Label = content('www-hero', 'card2Label') ?? 'Volunteers Connected';
  const heroImage = content('www-hero', 'image') ?? '/images/Where We Work1.jpeg';

  const mapTitle = content('www-map', 'title') ?? 'Where We';
  const mapHighlight = content('www-map', 'highlight') ?? 'Work';
  const mapSubtitle =
    content('www-map', 'subtitle') ??
    'Serving communities across India through education, healthcare, empowerment, sustainability and humanitarian initiatives.';
  const counter1Num = content('www-map', 'counter1Num') ?? '12';
  const counter1Label = content('www-map', 'counter1Label') ?? 'States';
  const counter2Num = content('www-map', 'counter2Num') ?? '100';
  const counter2Label = content('www-map', 'counter2Label') ?? 'Projects';
  const counter3Num = content('www-map', 'counter3Num') ?? '1';
  const counter3Suffix = content('www-map', 'counter3Suffix') ?? 'M';
  const counter3Label = content('www-map', 'counter3Label') ?? 'Lives Impacted';
  const mapImage = content('www-map', 'mapImage') ?? '/images/Map2.jpeg';
  const legendTitle = content('www-map', 'legendTitle') ?? 'Focus Areas';
  const legendItems =
    content('www-map', 'legendItems') ?? [
      { icon: 'fa-book-open', color: '#00a3da', label: 'Education' },
      { icon: 'fa-heartbeat', color: '#ff6b00', label: 'Healthcare' },
      { icon: 'fa-female', color: '#e91e63', label: 'Women Empower' },
      { icon: 'fa-leaf', color: '#4caf50', label: 'Sustainability' },
    ];
  const listHeading = content('www-map', 'listHeading') ?? 'Our';
  const listHighlight = content('www-map', 'listHighlight') ?? 'States';
  const listSubtitle = content('www-map', 'listSubtitle') ?? 'Hover a location to see its impact';
  const locations =
    content('www-map', 'locations') ?? [
      { loc: 'maharashtra', top: '58%', left: '20%', name: 'Maharashtra', projects: 12, beneficiaries: '2.5L+', desc: 'Education, food distribution & health camps', icon: 'fas fa-city' },
      { loc: 'gujarat', top: '47%', left: '12%', name: 'Gujarat', projects: 8, beneficiaries: '1.2L+', desc: 'Women empowerment & hygiene programs', icon: 'fas fa-building' },
      { loc: 'uttarakhand', top: '26%', left: '35%', name: 'Uttarakhand', projects: 10, beneficiaries: '1.8L+', desc: 'Digital education & skill development', icon: 'fas fa-graduation-cap' },
      { loc: 'west-bengal', top: '47%', left: '67%', name: 'West Bengal', projects: 6, beneficiaries: '80K+', desc: 'Rural development & livelihood support', icon: 'fas fa-tractor' },
      { loc: 'delhi', top: '27%', left: '30%', name: 'Delhi', projects: 7, beneficiaries: '1L+', desc: 'Vocational training & self-reliance', icon: 'fas fa-industry' },
      { loc: 'rajasthan', top: '35%', left: '20%', name: 'Rajasthan', projects: 9, beneficiaries: '1.5L+', desc: 'Mid-day meals & child nutrition', icon: 'fas fa-sun' },
      { loc: 'punjab', top: '22%', left: '25%', name: 'Punjab', projects: 4, beneficiaries: '50K+', desc: 'Food distribution & community kitchens', icon: 'fas fa-wheat-awn' },
      { loc: 'haryana', top: '28%', left: '27%', name: 'Haryana', projects: 6, beneficiaries: '90K+', desc: 'School renovation & education drives', icon: 'fas fa-school' },
      { loc: 'uttar-pradesh', top: '36%', left: '41%', name: 'Uttar Pradesh', projects: 11, beneficiaries: '2L+', desc: 'Healthcare camps & hygiene kits', icon: 'fas fa-mosque' },
      { loc: 'madhya-pradesh', top: '46%', left: '32%', name: 'Madhya Pradesh', projects: 8, beneficiaries: '1.3L+', desc: 'Environment & animal welfare programs', icon: 'fas fa-tree' },
      { loc: 'odisha', top: '54%', left: '58%', name: 'Odisha', projects: 7, beneficiaries: '1.1L+', desc: 'Disaster relief & community support', icon: 'fas fa-fish' },
      { loc: 'tamil-nadu', top: '78%', left: '34%', name: 'Tamil Nadu', projects: 10, beneficiaries: '1.6L+', desc: 'Multi-focus community outreach', icon: 'fas fa-praying-hands' },
    ];

  const reachTag = content('www-reach', 'tag') ?? 'OUR REACH';
  const reachHeading = content('www-reach', 'heading') ?? 'Where We Serve';
  const reachValues =
    content('www-reach', 'items') ?? [
      { icon: 'fa-map-location-dot', title: 'Pan-India Reach', desc: 'Active across Maharashtra, Gujarat, West Bengal, Tamil Nadu, and Odisha.' },
      { icon: 'fa-city', title: 'Urban Outreach', desc: 'Working in major cities including Mumbai, Pune, Kolkata, and Rajkot.' },
      { icon: 'fa-tree', title: 'Rural Development', desc: 'Extending support to rural communities in Dwarka, Narmada, and Jalgaon.' },
      { icon: 'fa-people-group', title: '10+ Locations', desc: 'Establishing presence in multiple states to maximize community impact.' },
    ];

  const testimonialsTag = content('www-testimonials', 'tag') ?? 'TESTIMONIALS';
  const testimonialsHeading = content('www-testimonials', 'heading') ?? 'Voices from the Field';
  const testimonials =
    content('www-testimonials', 'items') ?? [
      { quote: "BSCT's work in our village has brought education and healthcare to children who had no access before.", name: 'Suresh Patil', role: 'Village Head, Jalgaon' },
      { quote: 'The impact of their midday meal program in Mumbai slums is remarkable. No child goes hungry.', name: 'Asha Devi', role: 'Community Volunteer' },
      { quote: "From Gujarat to Tamil Nadu, BSCT's reach is expanding every year. A truly national NGO.", name: 'Dr. Karthik Rao', role: 'Social Researcher' },
    ];

  const activateLocation = useCallback((loc) => {
    const pins = document.querySelectorAll('.www-pin');
    const cards = document.querySelectorAll('.www-card');
    const mapWrap = document.querySelector('.www-map-wrap');

    pins.forEach(p => p.classList.remove('active', 'faded'));
    cards.forEach(c => c.classList.remove('active-card'));

    if (!loc) return;

    const activePin = document.querySelector(`.www-pin[data-loc="${loc}"]`);
    const activeCard = document.querySelector(`.www-card[data-loc="${loc}"]`);

    if (activePin) {
      activePin.classList.add('active');
      pins.forEach(p => { if (p !== activePin) p.classList.add('faded'); });
      if (mapWrap) {
        const pinLeft = parseFloat(activePin.style.left);
        const pinTop = parseFloat(activePin.style.top);
        if (!isNaN(pinLeft) && !isNaN(pinTop)) {
          mapWrap.style.transformOrigin = `${pinLeft}% ${pinTop}%`;
        } else {
          mapWrap.style.transformOrigin = '50% 50%';
        }
        mapWrap.classList.add('zoomed');
      }
    }

    if (activeCard) {
      activeCard.classList.add('active-card');
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const deactivateAll = useCallback(() => {
    const pins = document.querySelectorAll('.www-pin');
    const cards = document.querySelectorAll('.www-card');
    const mapWrap = document.querySelector('.www-map-wrap');
    pins.forEach(p => p.classList.remove('active', 'faded'));
    cards.forEach(c => c.classList.remove('active-card'));
    if (mapWrap) {
      mapWrap.classList.remove('zoomed');
      mapWrap.style.transformOrigin = '';
    }
    activeLocRef.current = null;
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    const pins = document.querySelectorAll('.www-pin');
    const cards = document.querySelectorAll('.www-card');

    const handleCardClick = function () {
      const loc = this.getAttribute('data-loc');
      if (activeLocRef.current === loc) {
        deactivateAll();
      } else {
        activeLocRef.current = loc;
        activateLocation(loc);
      }
    };

    const handleCardEnter = function () {
      const loc = this.getAttribute('data-loc');
      if (loc) activateLocation(loc);
    };

    const handleCardLeave = function () {
      if (activeLocRef.current) {
        activateLocation(activeLocRef.current);
      } else {
        deactivateAll();
      }
    };

    const handlePinClick = function () {
      const loc = this.getAttribute('data-loc');
      if (activeLocRef.current === loc) {
        deactivateAll();
      } else {
        activeLocRef.current = loc;
        activateLocation(loc);
      }
    };

    const handlePinEnter = function () {
      const loc = this.getAttribute('data-loc');
      pins.forEach(p => p.classList.remove('active', 'faded'));
      cards.forEach(c => c.classList.remove('active-card'));
      const activePin = document.querySelector(`.www-pin[data-loc="${loc}"]`);
      const activeCard = document.querySelector(`.www-card[data-loc="${loc}"]`);
      if (activePin) activePin.classList.add('active');
      if (activeCard) activeCard.classList.add('active-card');
    };

    const handlePinLeave = function () {
      if (activeLocRef.current) {
        activateLocation(activeLocRef.current);
      } else {
        deactivateAll();
      }
    };

    cards.forEach(card => {
      card.addEventListener('click', handleCardClick);
      card.addEventListener('mouseenter', handleCardEnter);
      card.addEventListener('mouseleave', handleCardLeave);
    });

    pins.forEach(pin => {
      pin.addEventListener('click', handlePinClick);
      pin.addEventListener('mouseenter', handlePinEnter);
      pin.addEventListener('mouseleave', handlePinLeave);
    });

    const animateCounters = () => {
      if (countersStarted.current) return;
      countersStarted.current = true;
      document.querySelectorAll('.www-counter-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1500;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
      });
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const counterStrip = document.querySelector('.www-counter');
    if (counterStrip) counterObserver.observe(counterStrip);

    return () => {
      revealEls.forEach(el => revealObserver.unobserve(el));
      cards.forEach(card => {
        card.removeEventListener('click', handleCardClick);
        card.removeEventListener('mouseenter', handleCardEnter);
        card.removeEventListener('mouseleave', handleCardLeave);
      });
      pins.forEach(pin => {
        pin.removeEventListener('click', handlePinClick);
        pin.removeEventListener('mouseenter', handlePinEnter);
        pin.removeEventListener('mouseleave', handlePinLeave);
      });
      if (counterStrip) counterObserver.unobserve(counterStrip);
    };
  }, [activateLocation, deactivateAll]);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light-bg:#f4f7fb;--text-dark:#1a1a2e;--text-mid:#4a5568;--gold:#D4AF37}
        body{font-family:'Open Sans',sans-serif;color:var(--text-dark);scroll-behavior:smooth}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);color:#fff;border-radius:0;margin:20px 0;padding:10px}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;margin:0}
        .hero{min-height:80vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:0;position:relative;overflow:hidden;padding:10px 8%}
        .hero-content{position:relative;z-index:2;overflow:hidden}
        .hero-content .tag{background:transparent;color:#00a3da;padding:0;border-radius:0;display:inline-block;margin-bottom:25px;font-weight:800;font-size:30px;letter-spacing:1px}
        .hero h1{font-size:62px;line-height:1.1;margin-bottom:25px;color:var(--navy)}
        .hero h1 span{color:#00a3da}
        .hero p{font-size:18px;line-height:1.9;color:#66788a;margin-bottom:35px}
        .hero-buttons{display:flex;gap:18px;flex-wrap:wrap}
        .hero-buttons .donate-btn{display:inline-block;padding:15px 36px;background:#00a3da;color:#fff;text-decoration:none;border-radius:6px;font-weight:700;transition:0.4s;box-shadow:0 10px 25px rgba(11,77,120,0.25)}
        .hero-buttons .donate-btn:hover{background:#007d94;transform:translateY(-1px)}
        .hero-image{position:relative;z-index:2;display:flex;justify-content:center}
        .hero-image img{width:100%;max-width:500px;border-radius:30px;box-shadow:0 25px 50px rgba(0,0,0,0.15);transition:0.5s ease}
        .hero-image img:hover{transform:scale(1.02)}
        .floating-card{position:absolute;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:18px 24px;border-radius:18px;box-shadow:0 15px 35px rgba(0,0,0,0.12);text-align:center;z-index:3;animation:floatCard 3s ease-in-out infinite alternate}
        .floating-card.card1{top:5%;left:-10px}
        .floating-card.card2{bottom:10%;right:-10px;animation-delay:2s}
        .floating-card h3{font-size:28px;font-weight:800;color:#00a3da}
        .floating-card p{font-size:13px;color:#555;margin:0}
        @keyframes floatCard{0%{transform:translateY(0);}100%{transform:translateY(-15px);}}
        .blur{position:absolute;width:500px;height:500px;border-radius:50%;filter:blur(120px);opacity:0.15;z-index:0;pointer-events:none}
        .blur1{background:#00a3da;top:-100px;left:-100px}
        .blur2{background:#315270;bottom:-100px;right:-100px}
        @media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center}.hero h1{font-size:42px}.hero p{font-size:16px}.hero-buttons{justify-content:center}.hero-image img{max-width:90%}.floating-card.card1{left:5%}.floating-card.card2{right:5%}}
        @media(max-width:550px){.hero h1{font-size:28px}.hero p{font-size:13px}.hero-image img{max-width:100%;border-radius:16px}.floating-card{padding:6px 10px;border-radius:12px}.floating-card h3{font-size:14px}.floating-card p{font-size:10px}.floating-card.card1{top:0;left:0;border-radius:0 0 12px 0}.floating-card.card2{bottom:0;right:0;border-radius:12px 0 0 0}.blur{display:none}}
        .www-section{width:100%;background:#ffffff;padding:80px 24px;position:relative;overflow:hidden}
        .www-container{max-width:1300px;margin:0 auto}
        .www-header{text-align:center;margin-bottom:50px}
        .www-title{font-family:'Montserrat',sans-serif;font-size:3rem;font-weight:900;color:var(--navy,#03163E);margin-bottom:16px;letter-spacing:1px}
        .www-title span{color:#00a3da}
        .www-subtitle{font-size:1.1rem;color:#4a5568;max-width:750px;margin:0 auto;line-height:1.8}
        .www-counter{display:flex;align-items:center;justify-content:center;gap:40px;margin-bottom:50px;padding:30px 40px;background:linear-gradient(135deg,#f0f8ff,#e8f4fd);border-radius:20px;box-shadow:0 8px 30px rgba(0,163,218,0.1)}
        .www-counter-item{display:flex;align-items:baseline;gap:2px;flex-wrap:wrap;justify-content:center}
        .www-counter-num{font-family:'Montserrat',sans-serif;font-size:2.8rem;font-weight:900;color:#00a3da;line-height:1}
        .www-counter-plus{font-family:'Montserrat',sans-serif;font-size:2rem;font-weight:700;color:#ff6b00}
        .www-counter-suffix{font-family:'Montserrat',sans-serif;font-size:1.8rem;font-weight:700;color:#00a3da}
        .www-counter-label{display:block;width:100%;font-size:0.9rem;font-weight:600;color:#4a5568;text-align:center;margin-top:4px}
        .www-counter-divider{width:2px;height:50px;background:linear-gradient(180deg,transparent,#00a3da,transparent)}
        .www-grid{display:grid;grid-template-columns:1.8fr 1fr;gap:40px;align-items:start}
        .www-map-col{position:relative}
        .www-map-wrap{position:relative;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.1);background:#f8fafc;transition:transform 0.5s ease,overflow 0s}
        .www-map-wrap.zoomed{transform:scale(1.3);overflow:visible;transition:transform 0.5s ease,overflow 0s}
        .www-map-img{width:100%;display:block}
        .www-pin{position:absolute;width:18px;height:18px;transform:translate(-50%,-50%);cursor:pointer;z-index:5;transition:opacity 0.4s ease}
        .www-pin-dot{width:100%;height:100%;border-radius:50%;background:#00a3da;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,163,218,0.5);position:relative;z-index:2;transition:all 0.3s ease}
        .www-pin-pulse{position:absolute;top:50%;left:50%;width:100%;height:100%;border-radius:50%;background:rgba(0,163,218,0.3);transform:translate(-50%,-50%) scale(1);animation:wwwPulse 2s ease-out infinite;z-index:1;pointer-events:none}
        @keyframes wwwPulse{0%{transform:translate(-50%,-50%) scale(1);opacity:0.8}70%{transform:translate(-50%,-50%) scale(2.5);opacity:0}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}
        .www-pin.active .www-pin-dot{background:#ff6b00;box-shadow:0 0 20px rgba(255,107,0,0.6);transform:scale(1.3)}
        .www-pin.active .www-pin-pulse{background:rgba(255,107,0,0.4);animation-duration:1.2s}
        .www-pin.faded{opacity:0.3}
        .www-pin-tooltip{position:absolute;bottom:calc(100% + 14px);left:50%;transform:translateX(-50%) translateY(8px);background:#fff;padding:14px 18px;border-radius:14px;box-shadow:0 12px 35px rgba(0,0,0,0.18);min-width:170px;opacity:0;visibility:hidden;transition:all 0.35s ease;z-index:20;pointer-events:none}
        .www-pin-tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:8px solid transparent;border-top-color:#fff}
        .www-pin.active .www-pin-tooltip{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
        .www-pin-tooltip h4{font-family:'Montserrat',sans-serif;font-size:1rem;font-weight:800;color:#00a3da;margin-bottom:8px}
        .www-pin-tooltip p{font-size:0.82rem;color:#4a5568;margin-bottom:4px;line-height:1.4}
        .www-pin-tooltip p strong{color:#1a1a2e}
        .www-legend{position:absolute;bottom:16px;left:16px;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:14px 18px;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,0.08);z-index:10}
        .www-legend-title{display:block;font-size:0.8rem;font-weight:700;color:#1a1a2e;margin-bottom:8px;letter-spacing:0.5px}
        .www-legend-items{display:flex;flex-wrap:wrap;gap:10px}
        .www-legend-item{font-size:0.72rem;font-weight:600;color:#4a5568;display:flex;align-items:center;gap:5px}
        .www-legend-item i{font-size:0.8rem}
        .www-list-col{background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);border:1px solid #eef2f6}
        .www-list-header{padding:24px 24px 16px;border-bottom:1px solid #e8ecf0;background:#fafcfe}
        .www-list-header h3{font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:800;color:#03163E;margin-bottom:4px}
        .www-list-header h3 span{color:#00a3da}
        .www-list-header p{font-size:0.85rem;color:#6b7f8f}
        .www-list-scroll{max-height:520px;overflow-y:auto;padding:8px 12px;background:#ffffff}
        .www-list-scroll::-webkit-scrollbar{width:5px}
        .www-list-scroll::-webkit-scrollbar-track{background:#f0f2f5;border-radius:8px}
        .www-list-scroll::-webkit-scrollbar-thumb{background:#c0c8d0;border-radius:8px}
        .www-card{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;transition:all 0.35s ease;cursor:pointer;margin-bottom:8px;position:relative;background:#f4f8fb;border:1px solid #d0d8e0;min-height:60px}
        .www-card-icon{width:44px;height:44px;border-radius:12px;background:#00a3da;display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:1.2rem;flex-shrink:0;transition:all 0.35s ease;box-shadow:0 3px 10px rgba(0,163,218,0.2)}
        .www-card-text{flex:1;min-width:0}
        .www-card-text h4{font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#0a1a2a;margin-bottom:3px;transition:color 0.35s ease;line-height:1.3;letter-spacing:0.3px}
        .www-card-text p{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#445566;line-height:1.4;transition:color 0.35s ease;margin:0}
        .www-card:hover,.www-card.active-card{background:#00a3da;transform:translateX(8px);box-shadow:0 8px 25px rgba(0,163,218,0.3);border-color:#00a3da}
        .www-card:hover .www-card-icon,.www-card.active-card .www-card-icon{background:rgba(255,255,255,0.3);color:#fff;box-shadow:none}
        .www-card:hover .www-card-text h4,.www-card:hover .www-card-text p,.www-card.active-card .www-card-text h4,.www-card.active-card .www-card-text p{color:#ffffff}
        @media(max-width:1024px){.www-grid{grid-template-columns:1fr;gap:30px}.www-title{font-size:2.4rem}.www-counter{gap:20px;padding:20px;flex-wrap:wrap}.www-counter-num{font-size:2.2rem}.www-counter-divider{display:none}.www-counter-item{flex:1;min-width:120px}}
        @media(max-width:768px){.www-section{padding:50px 16px}.www-title{font-size:1.8rem}.www-subtitle{font-size:0.95rem}.www-counter{flex-direction:row;gap:20px;padding:20px}.www-counter-num{font-size:2rem}.www-list-scroll{max-height:350px}.www-legend{position:relative;bottom:auto;left:auto;margin-top:12px;border-radius:12px;padding:12px 14px}}
        @media(max-width:600px){.www-section{padding:40px 14px}.www-title{font-size:1.6rem}.www-subtitle{font-size:0.9rem}.www-counter{padding:16px;gap:14px}.www-counter-num{font-size:1.6rem}.www-counter-label{font-size:0.78rem}.www-list-header h3{font-size:1.1rem}.www-card{padding:10px 12px;min-height:50px;gap:10px}.www-card-icon{width:36px;height:36px;font-size:1rem}.www-card-text h4{font-size:14px}.www-card-text p{font-size:11px}.www-list-scroll{max-height:320px;padding:6px 8px}.www-pin{width:14px;height:14px}.www-pin-dot{border-width:2px}.www-map-wrap.zoomed{transform:scale(1.1)}}
        .values-section{background:var(--light-bg);padding:30px 24px}
        .values-inner{max-width:1200px;margin:0 auto}
        .values-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;margin-top:50px}
        .value-card{background:#fff;padding:35px 28px;border-radius:28px;box-shadow:0 20px 40px rgba(0,0,0,0.05);text-align:center;position:relative;overflow:hidden;cursor:pointer;transition:0.5s ease}
        .value-card::before{content:'';position:absolute;left:0;bottom:0;width:100%;height:0%;background:var(--cyan);transition:0.5s ease;z-index:1}
        .value-card:hover::before{height:100%}
        .value-card:hover{transform:translateY(-12px)}
        .value-card>*{position:relative;z-index:2;transition:0.4s ease}
        .value-card .val-icon{font-size:2.4rem;color:var(--cyan);margin-bottom:16px}
        .value-card h3{font-family:'Montserrat',sans-serif;font-size:1.15rem;color:var(--navy);margin-bottom:12px}
        .value-card p{font-size:0.88rem;line-height:1.7;color:var(--text-mid)}
        .value-card:hover .val-icon,.value-card:hover h3,.value-card:hover p{color:#fff}
        .testimonials-section{padding:80px 24px;background:#fff}
        .testimonials-inner{max-width:1200px;margin:0 auto}
        .testimonial-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px;margin-top:50px;align-items:stretch}
        .testimonial-card{background:#fff;padding:30px;border-radius:28px;box-shadow:0 20px 40px rgba(0,0,0,0.07);transition:0.4s ease;overflow:hidden;position:relative;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between}
        .testimonial-card::before{content:'';position:absolute;left:0;bottom:0;width:100%;height:0%;background:var(--cyan);transition:0.4s ease;z-index:1;border-radius:28px}
        .testimonial-card:hover::before{height:100%}
        .testimonial-card:hover{transform:translateY(-10px)}
        .testimonial-card>*{position:relative;z-index:2}
        .testimonial-card p{line-height:1.9;color:var(--text-mid);margin-bottom:20px;font-size:0.92rem}
        .testimonial-card h4{font-family:'Montserrat',sans-serif;color:var(--cyan);font-size:1rem}
        .testimonial-card span{font-size:0.8rem;color:var(--text-mid)}
        .testimonial-card:hover p,.testimonial-card:hover h4,.testimonial-card:hover span{color:#fff !important}
        .testimonial-card .quote-icon{font-size:1.6rem;color:var(--cyan-light);margin-bottom:12px;opacity:0.5}
        .testimonial-card:hover .quote-icon{color:rgba(255,255,255,0.6)}
        .reveal{opacity:0;transform:translateY(40px);transition:opacity 0.7s ease,transform 0.7s ease}
        .reveal.visible{opacity:1;transform:translateY(0);width:fit-content}
        @media(max-width:768px){.values-grid{grid-template-columns:1fr}.testimonial-grid{grid-template-columns:1fr}}
      `}</style>

      <section className="tax-box"><h1>{pageTitle}</h1></section>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tag">{heroTag}</span>
          <h1>{heroHeading} <span>{heroHighlight}</span></h1>
          <p>{heroDescription}</p>
          <div className="hero-buttons"><a href="#locations" className="donate-btn">Explore Locations</a></div>
          <div className="blur blur1"></div><div className="blur blur2"></div>
        </div>
        <div className="hero-image">
          <div className="floating-card card1"><h3>{heroCard1Value}</h3><p>{heroCard1Label}</p></div>
          <div className="floating-card card2"><h3>{heroCard2Value}</h3><p>{heroCard2Label}</p></div>
          <img src={heroImage} alt="Where We Work" />
        </div>
      </section>

      <section className="www-section">
        <div className="www-container">
          <div className="www-header"><h2 className="www-title">{mapTitle} <span>{mapHighlight}</span></h2><p className="www-subtitle">{mapSubtitle}</p></div>
          <div className="www-counter">
            <div className="www-counter-item"><span className="www-counter-num" data-target={counter1Num}>0</span><span className="www-counter-plus">+</span><span className="www-counter-label">{counter1Label}</span></div>
            <div className="www-counter-divider"></div>
            <div className="www-counter-item"><span className="www-counter-num" data-target={counter2Num}>0</span><span className="www-counter-plus">+</span><span className="www-counter-label">{counter2Label}</span></div>
            <div className="www-counter-divider"></div>
            <div className="www-counter-item"><span className="www-counter-num" data-target={counter3Num}>0</span><span className="www-counter-suffix">{counter3Suffix}</span><span className="www-counter-plus">+</span><span className="www-counter-label">{counter3Label}</span></div>
          </div>
          <div className="www-grid">
            <div className="www-map-col">
              <div className="www-map-wrap">
                <img src={mapImage} alt="India Map" className="www-map-img" />
                {locations.map(loc => (
                  <div key={loc.loc} className="www-pin" data-loc={loc.loc} style={{ top: loc.top, left: loc.left }}>
                    <div className="www-pin-dot"></div>
                    <div className="www-pin-pulse"></div>
                    <div className="www-pin-tooltip">
                      <h4>{loc.name}</h4>
                      <p><strong>Projects:</strong> {loc.projects}</p>
                      <p><strong>Beneficiaries:</strong> {loc.beneficiaries}</p>
                    </div>
                  </div>
                ))}
                <div className="www-legend"><span className="www-legend-title">{legendTitle}</span><div className="www-legend-items">{legendItems.map((item, i) => (
                  <span className="www-legend-item" key={i}><i className={`fas ${item.icon}`} style={{ color: item.color }}></i> {item.label}</span>
                ))}</div></div>
              </div>
            </div>
            <div className="www-list-col" id="locations">
              <div className="www-list-header"><h3>{listHeading} <span>{listHighlight}</span></h3><p>{listSubtitle}</p></div>
              <div className="www-list-scroll">
                {locations.map(loc => (
                  <div key={loc.loc} className="www-card" data-loc={loc.loc}>
                    <div className="www-card-icon"><i className={loc.icon}></i></div>
                    <div className="www-card-text"><h4>{loc.name}</h4><p>{loc.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="values-inner">
          <div style={{ textAlign: 'center' }}><span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, display: 'block', marginBottom: 8 }}>{reachTag}</span><h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', color: 'var(--navy)' }}>{reachHeading}</h2></div>
          <div className="values-grid">
            {reachValues.map((v, i) => (
              <div className="value-card reveal" key={i}><div className="val-icon"><i className={`fas ${v.icon}`}></i></div><h3>{v.title}</h3><p>{v.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div style={{ textAlign: 'center' }}><span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, display: 'block', marginBottom: 8 }}>{testimonialsTag}</span><h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', color: 'var(--navy)' }}>{testimonialsHeading}</h2></div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card reveal" key={i}><div><div className="quote-icon"><i className="fas fa-quote-left"></i></div><p>{t.quote}</p></div><div><h4>{t.name}</h4><span>{t.role}</span></div></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhereWeWork;
