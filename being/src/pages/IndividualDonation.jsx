import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const UNIT_PRICE = { annapurna: 500, vidhya: 400, aurat: 300, atma: 600, bezubaan: 200 };

export default function IndividualDonation() {
  const content = usePageContent('individual-donation');

  const alertText = content('individual-alert', 'text') ?? 'Being Sevak Charitable Trust';
  const heroHeading = content('individual-hero', 'heading') ?? 'Individual';
  const heroText =
    content('individual-hero', 'description') ??
    'Every individual has the power to make a difference. Join us in our mission to serve humanity with compassion, dignity, and hope.';
  const cards =
    content('individual-cards', 'items') ?? [
      { icon: 'fas fa-hands-helping', title: 'Make an Impact', description: 'Your support helps us provide food, education, healthcare, and hope to those who need it most.' },
      { icon: 'fas fa-users', title: 'Join Our Community', description: 'Become part of a growing movement of individuals committed to positive change and compassionate service.' },
      { icon: 'fas fa-heart', title: 'Spread Kindness', description: 'Every act of kindness creates ripples. Together we can build a better future for communities in need.' },
    ];
  const missions =
    content('individual-missions', 'items') ?? [
      { key: 'annapurna', icon: '\u{1F33E}', name: 'Mission Annapurna', desc: 'Dry Ration Kits & Mid-Day Meals for Visually Impaired & Underprivileged Individuals' },
      { key: 'vidhya', icon: '\u{1F4DA}', name: 'Mission Vidhya', desc: 'D.E.C \u2013 Digital Education Centre, Free digital education, Writing Pad & Stationery Kit Distribution' },
      { key: 'aurat', icon: '\u{1F469}', name: 'Mission Aurat', desc: 'Sanitary Pad Distribution & Hygiene Kit Distribution for underprivileged women' },
      { key: 'atma', icon: '\u{1F4AA}', name: 'Mission Atma Nirbhar', desc: 'Rozgaar Booth, Wheelchair & Tricycle Distribution, Sewing Machine & Flour Mill Distribution' },
      { key: 'bezubaan', icon: '\u{1F43E}', name: 'Mission Bezubaan', desc: 'Animal Feeding Center, Biscuit, Milk & Pedigree Distribution for stray animals' },
    ];

  const [quickAmt, setQuickAmt] = useState('');
  const [activePreset, setActivePreset] = useState(200);

  const [basketOpen, setBasketOpen] = useState(false);
  const [cartQty, setCartQty] = useState({ annapurna: 0, vidhya: 0, aurat: 0, atma: 0, bezubaan: 0 });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showEmptyMsg, setShowEmptyMsg] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');

  const handlePreset = (val) => {
    setQuickAmt(val);
    setActivePreset(val);
  };

  const addMission = (key) => {
    setCartQty(prev => ({ ...prev, [key]: 1 }));
  };

  const removeMission = (key) => {
    setCartQty(prev => ({ ...prev, [key]: 0 }));
  };

  const changeQty = (key, delta) => {
    setCartQty(prev => ({ ...prev, [key]: Math.max(1, prev[key] + delta) }));
  };

  const priceOf = (key) => {
    const item = missions.find((m) => m.key === key);
    return item?.price ?? UNIT_PRICE[key] ?? 0;
  };

  const total = Object.keys(cartQty).reduce((s, k) => s + cartQty[k] * priceOf(k), 0);

  const quickDonate = () => {
    setBasketOpen(true);
  };

  const proceedDonate = () => {
    if (total === 0) {
      setShowEmptyMsg(true);
      setTimeout(() => setShowEmptyMsg(false), 3000);
      return;
    }
    if (!name) { alert('Please enter your name.'); return; }
    if (!email) { alert('Please enter your email.'); return; }
    if (!phone || phone.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    const items = Object.entries(cartQty).filter(([, q]) => q > 0).map(([k, q]) => k + 'x' + q).join(', ');
    const rzp = new window.Razorpay({
      key: 'rzp_live_StUN8QoR2STezo',
      amount: total * 100,
      currency: 'INR',
      name: 'Being Sevak Charitable Trust',
      description: 'Donation - ' + items,
      image: '../logo11.png',
      handler: function (response) {
        window.location.href = 'payment/success.html?payment_id=' + response.razorpay_payment_id + '&amount=' + total + '&name=' + encodeURIComponent(name);
      },
      prefill: { name, email, contact: '+91' + phone },
      notes: { missions: items },
      theme: { color: '#315371' }
    });
    rzp.on('payment.failed', function (response) {
      window.location.href = 'payment/failure.html?error=' + encodeURIComponent(response.error.description);
    });
    rzp.open();
  };

  const handleGooglePay = () => {
    if (total === 0) {
      setShowEmptyMsg(true);
      setTimeout(() => setShowEmptyMsg(false), 3000);
      return;
    }
    if (!name) { alert('Please enter your name.'); return; }
    if (!email) { alert('Please enter your email.'); return; }
    if (!phone || phone.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    const items = Object.entries(cartQty).filter(([, q]) => q > 0).map(([k, q]) => k + 'x' + q).join(', ');
    const rzp = new window.Razorpay({
      key: 'rzp_live_StUN8QoR2STezo',
      amount: total * 100,
      currency: 'INR',
      name: 'Being Sevak Charitable Trust',
      description: 'Donation - ' + items,
      image: '../logo11.png',
      handler: function (response) {
        window.location.href = 'payment/success.html?payment_id=' + response.razorpay_payment_id + '&amount=' + total + '&name=' + encodeURIComponent(name);
      },
      prefill: { name, email, contact: '+91' + phone },
      notes: { missions: items },
      theme: { color: '#315371' },
      config: { display: { blocks: { upi: { instruments: [{ method: 'upi' }] } }, preferences: { show_default_blocks: true } } }
    });
    rzp.on('payment.failed', function (response) {
      window.location.href = 'payment/failure.html?error=' + encodeURIComponent(response.error.description);
    });
    rzp.open();
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) {
      setPhoneErr('Only numeric characters accept');
      setTimeout(() => setPhoneErr(''), 2000);
      return;
    }
    if (val.length > 10) {
      setPhoneErr('Only 10 digits allowed');
      setTimeout(() => setPhoneErr(''), 2000);
      return;
    }
    setPhone(val);
    if (val.length === 10 && !/^[6-9]/.test(val)) {
      setPhoneErr('Mobile number must start with 6, 7, 8 or 9');
      setTimeout(() => setPhoneErr(''), 2000);
    } else {
      setPhoneErr('');
    }
  };

  return (
    <>
      <style>{`
        .alert-banner {
          background: linear-gradient(90deg, #00a3da, #315270);
          color: #fff;
          text-align: center;
          padding: 10px 20px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 1px;
        }
        .alert-banner .alert-link {
          color: #fff;
          text-decoration: underline;
          margin-left: 12px;
          font-weight: 700;
        }
        .quick-donate-bar {
          background: #fff;
          border-bottom: 2px solid #e6f7fd;
          padding: 14px 8%;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }
        .qd-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          flex-wrap: nowrap;
        }
        .currency-select {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f0f8fc;
          border: 1.5px solid #c8dce6;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          color: #000;
          cursor: pointer;
        }
        .amount-input-wrap {
          flex: 0 0 auto;
        }
        .amount-input {
          width: 120px;
          border: 1.5px solid #c8dce6;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
          font-family: 'Open Sans', sans-serif;
        }
        .amount-input:focus { border-color: #00A3DA; }
        .preset-amt {
          background: #f0f8fc;
          border: 1.5px solid #c8dce6;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #000;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Open Sans', sans-serif;
        }
        .preset-amt:hover { border-color: #00A3DA; }
        .preset-amt.active {
          background: #00A3DA;
          color: #000;
          border-color: #00A3DA;
        }
        .category-select {
          position: relative;
        }
        .category-select select {
          appearance: none;
          border: 1.5px solid #c8dce6;
          border-radius: 8px;
          padding: 8px 30px 8px 12px;
          font-size: 13px;
          font-family: 'Open Sans', sans-serif;
          color: #000;
          background: #f0f8fc;
          cursor: pointer;
          outline: none;
        }
        .category-select select:focus { border-color: #00A3DA; }
        .category-select i {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: #315371;
          pointer-events: none;
        }
        .payment-icons {
          display: flex;
          gap: 6px;
          align-items: center;
          min-width: 200px;
        }
        .pay-icon { width: 30px; height: 20px; object-fit: contain; border: none; }
        .pay-icon.visa { filter: invert(28%) sepia(88%) saturate(5000%) hue-rotate(200deg) brightness(90%) contrast(90%); }
        .pay-icon.mc { filter: invert(13%) sepia(85%) saturate(5000%) hue-rotate(-5deg) brightness(90%) contrast(110%); }
        .pay-icon-text {
          font-size: 11px;
          font-weight: 700;
          color: #315371;
          border: 1px solid #c8dce6;
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Montserrat', sans-serif;
        }
        .pay-icon-text.mc { color: #eb001b; border: none; }
        .pay-icon-fb { font-size: 9px; color: #555; }
        .quick-donate-pulse-wrap { position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 999; margin-left: 10px; }
        .quick-donate-pulse-ring {
          position: absolute;
          inset: -5px;
          border-radius: 8px;
          border: 2px solid #00a3da;
          animation: pulseRingSquare 2s ease-out infinite;
          pointer-events: none;
        }
        .quick-donate-pulse-ring.ring2 { animation-delay: 1s; }
        @keyframes pulseRingSquare {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .quick-donate-btn {
          background: linear-gradient(135deg, #00A3DA, #0088bb);
          color: white;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 13px;
          padding: 10px 22px;
          border-radius: 6px;
          letter-spacing: 0.5px;
          white-space: nowrap;
          transition: background 0.2s, transform 0.1s;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0,163,218,0.35);
        }
        .quick-donate-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,163,218,0.45); }
        .individual-hero {
          padding: 100px 8% 60px;
          text-align: center;
          background: linear-gradient(135deg, #f4f6f8, #eef8ff);
        }
        .individual-hero h1 { font-size: 42px; font-weight: 800; color: #003b73; margin-bottom: 16px; }
        .individual-hero p { font-size: 18px; color: #555; max-width: 700px; margin: 0 auto; line-height: 1.7; }
        .individual-content { padding: 60px 8%; }
        .individual-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .individual-card {
          background: #fff;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          text-align: center;
          transition: 0.3s ease;
        }
        .individual-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.12); }
        .individual-card i { font-size: 40px; color: #00a3da; margin-bottom: 16px; }
        .individual-card h3 { font-size: 20px; color: #003b73; margin-bottom: 10px; }
        .individual-card p { font-size: 15px; color: #666; line-height: 1.6; }
        @media (max-width: 600px) {
          .individual-hero { padding: 80px 5% 40px; }
          .individual-hero h1 { font-size: 30px; }
          .individual-hero p { font-size: 16px; }
          .individual-content { padding: 40px 5%; }
          .individual-grid { grid-template-columns: 1fr; }
          .quick-donate-bar { padding: 10px 12px; }
          .qd-inner { flex-wrap: nowrap; gap: 8px; justify-content: flex-start; }
          .currency-select { padding: 4px 8px; font-size: 11px; gap: 3px; }
          .amount-input-wrap { flex: 0 0 85px; }
          .amount-input { width: 100%; padding: 7px 10px; font-size: 13px; }
          .preset-amt { display: none; }
          .payment-icons { display: none; }
          .quick-donate-pulse-wrap { margin-left: 0; }
          .quick-donate-btn { width: auto; text-align: center; }
        }
        .basket-overlay {
          display: block !important;
          position: fixed;
          inset: 0;
          background: rgba(30, 51, 71, 0.45);
          z-index: 999;
        }
        .basket-panel {
          position: fixed;
          top: 0; right: -480px;
          width: 460px;
          max-width: 100vw;
          height: 100vh;
          background: #fff;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 30px rgba(0,0,0,0.18);
          transition: right 0.35s cubic-bezier(.4,0,.2,1);
          font-family: 'Open Sans', sans-serif;
          overflow: hidden;
        }
        .basket-panel.open { right: 0; }
        .basket-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px 14px;
          border-bottom: 2px solid #e6f7fd;
          flex-shrink: 0; background: #fff;
        }
        .basket-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px; font-weight: 800;
          color: #315371; letter-spacing: 1px; margin: 0;
        }
        .basket-close {
          background: none; border: none;
          font-size: 18px; color: #315371;
          cursor: pointer; padding: 4px 8px;
          border-radius: 4px; transition: background 0.15s;
        }
        .basket-close:hover { background: #e6f7fd; }
        .basket-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .mission-card {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid #eef5f8;
          transition: background 0.15s;
        }
        .mission-card:hover { background: #f6fbfc; }
        .mission-card.in-cart { background: #e6f7fd; border-left: 3px solid #00A3DA; }
        .mission-icon {
          font-size: 22px; flex-shrink: 0;
          width: 42px; height: 42px;
          background: #e6f7fd; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .mission-info { flex: 1; min-width: 0; }
        .mission-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #315371; margin-bottom: 4px;
        }
        .mission-desc { font-size: 11.5px; color: #666; line-height: 1.5; }
        .mission-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 6px;
          flex-shrink: 0; min-width: 80px;
        }
        .mission-price {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px; font-weight: 700; color: #315371;
        }
        .mission-qty-row {
          display: none; align-items: center; gap: 8px;
          background: white;
          border: 1.5px solid #00A3DA;
          border-radius: 20px; padding: 3px 8px;
        }
        .mission-card.in-cart .mission-qty-row { display: flex; }
        .qty-btn {
          background: none; border: none;
          color: #315371; font-size: 10px;
          cursor: pointer; padding: 2px 3px;
          border-radius: 3px; transition: background 0.1s;
        }
        .qty-btn:hover { background: #e6f7fd; }
        .qty-val {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #315371; min-width: 20px; text-align: center;
        }
        .add-btn {
          background: #00A3DA; color: white; border: none;
          padding: 6px 14px; border-radius: 4px;
          font-size: 12px; font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer; transition: background 0.15s;
        }
        .add-btn:hover { background: #0088bb; }
        .mission-card.in-cart .add-btn { display: none; }
        .remove-btn {
          display: none;
        }
        .basket-divider { height: 1px; background: #e6f7fd; margin: 0 20px; flex-shrink: 0; }
        .basket-personal { padding: 14px 20px 8px; flex-shrink: 0; }
        .basket-section-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #315371; margin-bottom: 10px;
        }
        .basket-input {
          width: 100%;
          border: 1.5px solid #c8dce6;
          border-radius: 6px;
          padding: 9px 12px;
          font-size: 13px;
          font-family: 'Open Sans', sans-serif;
          color: #333; margin-bottom: 8px;
          outline: none; transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .basket-input:focus { border-color: #00A3DA; }
        .basket-phone-row {
          display: flex; align-items: center;
          gap: 8px; margin-bottom: 8px;
        }
        .phone-flag {
          background: #f0f8fc;
          border: 1.5px solid #c8dce6;
          border-radius: 6px;
          padding: 9px 10px;
          font-size: 13px;
          white-space: nowrap; flex-shrink: 0;
        }
        .phone-inp { margin-bottom: 0 !important; flex: 1; }
        .basket-checkboxes { padding: 6px 20px 10px; flex-shrink: 0; }
        .basket-check {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 12px; color: #555;
          margin-bottom: 7px; cursor: pointer; line-height: 1.5;
        }
        .basket-check input[type="checkbox"] {
          accent-color: #00A3DA;
          width: 14px; height: 14px;
          flex-shrink: 0; margin-top: 2px;
        }
        .basket-footer {
          padding: 16px 20px 28px;
          border-top: 2px solid #e6f7fd;
          background: #f6fbfc;
          margin-top: auto;
        }
        .basket-total-row {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 14px;
        }
        .basket-total-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px; font-weight: 800; color: #315371;
        }
        .basket-total-amt {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px; font-weight: 800; color: #315371;
        }
        .gpay-btn {
          width: 100%; background: #000; color: white;
          border: none; padding: 14px; border-radius: 6px;
          font-family: 'Montserrat', sans-serif;
          font-size: 16px; font-weight: 600;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          margin-bottom: 10px;
          transition: background 0.2s; letter-spacing: 0.5px;
        }
        .gpay-btn:hover { background: #1a1a1a; }
        .basket-donate-btn {
          width: 100%; background: #315371; color: white;
          border: none; padding: 14px; border-radius: 6px;
          font-family: 'Montserrat', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          gap: 8px; transition: background 0.2s; letter-spacing: 0.5px;
        }
        .basket-donate-btn:hover { background: #00A3DA; }
        .basket-empty-msg {
          display: none; text-align: center;
          color: #e53935; font-size: 12px;
          margin-top: 8px;
          font-family: 'Montserrat', sans-serif;
        }
        .basket-empty-msg.show { display: block; }
        .basket-field-err{display:block;color:#e53935;font-size:11px;margin-top:4px;font-family:'Open Sans',sans-serif;padding-left:80px}
        @media (max-width: 500px) {
          .basket-panel { width: 100vw; }
        }
      `}</style>

      <div className="alert-banner">
        <span className="alert-text">{alertText}</span>
        <Link to="/about" className="alert-link">Learn More</Link>
      </div>

      <div className="quick-donate-bar">
        <div className="qd-inner">
          <div className="currency-select">
            <span className="flag">&#127470;&#127475;</span>
            <span className="cur-code">INR</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="amount-input-wrap">
            <input type="number" placeholder="Amount" className="amount-input" id="quickAmt" value={quickAmt || ''} onChange={e => setQuickAmt(e.target.value ? Number(e.target.value) : '')} />
          </div>
          {[100, 150, 200, 500].map(val => (
            <button key={val} className={`preset-amt${activePreset === val ? ' active' : ''}`} onClick={() => handlePreset(val)}>
              &#8377;{val} INR
            </button>
          ))}
          <div className="payment-icons">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="PayPal" className="pay-icon" />
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="VISA" className="pay-icon visa" />
            <span className="pay-icon-text mc">MC</span>
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applepay.svg" alt="Apple Pay" className="pay-icon" />
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlepay.svg" alt="Google Pay" className="pay-icon" />
          </div>
          <div className="quick-donate-pulse-wrap">
            <div className="quick-donate-pulse-ring"></div>
            <div className="quick-donate-pulse-ring ring2"></div>
            <button className="quick-donate-btn" onClick={quickDonate}>QUICK DONATE</button>
          </div>
        </div>
      </div>

      <section className="individual-hero">
        <h1>{heroHeading}</h1>
        <p>{heroText}</p>
      </section>

      <section className="individual-content">
        <div className="individual-grid">
          {cards.map((card, i) => (
            <div className="individual-card" key={i}>
              <i className={card.icon}></i>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Basket overlay */}
      {basketOpen && <div className="basket-overlay" onClick={() => setBasketOpen(false)}></div>}

      {/* Basket panel */}
      <div className={`basket-panel${basketOpen ? ' open' : ''}`}>
        <div className="basket-header">
          <h2 className="basket-title">YOUR DONATION BASKET</h2>
          <button className="basket-close" onClick={() => setBasketOpen(false)}><i className="fas fa-times"></i></button>
        </div>

        <div className="basket-scroll">
          {missions.map(m => (
            <div key={m.key} className={`mission-card${cartQty[m.key] > 0 ? ' in-cart' : ''}`}>
              <div className="mission-icon">{m.icon}</div>
              <div className="mission-info">
                <div className="mission-name">{m.name}</div>
                <div className="mission-desc">{m.desc}</div>
              </div>
              <div className="mission-right">
                <div className="mission-price">{cartQty[m.key] > 0 ? `\u20B9${(cartQty[m.key] * priceOf(m.key)).toLocaleString('en-IN')}` : '\u20B90'}</div>
                <div className="mission-qty-row">
                  <button className="qty-btn" onClick={() => changeQty(m.key, -1)}><i className="fas fa-minus"></i></button>
                  <span className="qty-val">{cartQty[m.key]}</span>
                  <button className="qty-btn" onClick={() => changeQty(m.key, 1)}><i className="fas fa-plus"></i></button>
                </div>
                <button className="add-btn" onClick={() => addMission(m.key)}>Add</button>
                <button className="remove-btn" onClick={() => removeMission(m.key)}><i className="fas fa-times"></i> Remove</button>
              </div>
            </div>
          ))}

          <div className="basket-divider"></div>

          <div className="basket-personal">
            <h3 className="basket-section-title">Your Details</h3>
            <input type="text" className="basket-input" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
            <div className="basket-phone-row">
              <span className="phone-flag">&#127470;&#127475; +91</span>
              <input type="tel" className="basket-input phone-inp" placeholder="Phone number" value={phone} onChange={handlePhoneChange} />
            </div>
            {phoneErr && <span className="basket-field-err">{phoneErr}</span>}
            <input type="email" className="basket-input" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="basket-checkboxes">
            <label className="basket-check"><input type="checkbox" /> Send me impact updates via email</label>
            <label className="basket-check"><input type="checkbox" /> Send me WhatsApp/SMS updates</label>
            <label className="basket-check"><input type="checkbox" /> I have read and understood the <Link to="/terms" style={{color: '#00A3DA'}}>donation policy</Link></label>
          </div>

          <div className="basket-footer">
            <div className="basket-total-row">
              <span className="basket-total-label">Total</span>
              <span className="basket-total-amt">{'\u20B9'}{total.toLocaleString('en-IN')} INR</span>
            </div>
            <button className="gpay-btn" onClick={() => handleGooglePay()}>Google Pay</button>
            <button className="basket-donate-btn" onClick={() => proceedDonate()}>
              <i className="fas fa-heart"></i> Donate Now
            </button>
            <p className={`basket-empty-msg${showEmptyMsg ? ' show' : ''}`}>Please add at least one mission to donate.</p>
          </div>
        </div>
      </div>
    </>
  );
}
