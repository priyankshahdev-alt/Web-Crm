import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const UNIT_PRICE = { annapurna: 500, vidhya: 400, aurat: 300, atma: 600, bezubaan: 200 };

export default function QuickDonate() {
  const content = usePageContent('quick-donate');

  const bannerText = content('quick-banner', 'text') ?? 'Being Sevak Charitable Trust';
  const missions =
    content('quick-missions', 'items') ?? [
      { key: 'annapurna', icon: '\u{1F33E}', name: 'Mission Annapurna', desc: 'Dry Ration Kits & Mid-Day Meals for Visually Impaired & Underprivileged Individuals' },
      { key: 'vidhya', icon: '\u{1F4DA}', name: 'Mission Vidhya', desc: 'D.E.C \u2013 Digital Education Centre, Free digital education, Writing Pad & Stationery Kit Distribution' },
      { key: 'aurat', icon: '\u{1F469}', name: 'Mission Aurat', desc: 'Sanitary Pad Distribution & Hygiene Kit Distribution for underprivileged women' },
      { key: 'atma', icon: '\u{1F4AA}', name: 'Mission Atma Nirbhar', desc: 'Rozgaar Booth, Wheelchair & Tricycle Distribution, Sewing Machine & Flour Mill Distribution' },
      { key: 'bezubaan', icon: '\u{1F43E}', name: 'Mission Bezubaan', desc: 'Animal Feeding Center, Biscuit, Milk & Pedigree Distribution for stray animals' },
    ];

  const [searchParams] = useSearchParams();
  const [quickAmt, setQuickAmt] = useState(200);
  const [activePreset, setActivePreset] = useState(200);
  const [quickCategory, setQuickCategory] = useState('Mission Annapurna');
  const [basketOpen, setBasketOpen] = useState(false);
  const [cartQty, setCartQty] = useState({ annapurna: 0, vidhya: 0, aurat: 0, atma: 0, bezubaan: 0 });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showEmptyMsg, setShowEmptyMsg] = useState(false);

  useEffect(() => {
    const amt = searchParams.get('amount');
    if (amt) {
      setQuickAmt(Number(amt));
      setActivePreset(Number(amt));
    }
    // Auto-open basket
    setTimeout(() => setBasketOpen(true), 300);
  }, [searchParams]);

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

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; background: #f0f8fc; }
        .page-blur-wrap { filter: blur(4px); pointer-events: none; user-select: none; }
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
          background: none; border: none;
          color: #e53935; font-size: 11px;
          font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 3px;
          padding: 2px 0;
          font-family: 'Montserrat', sans-serif;
        }
        .remove-btn:hover { text-decoration: underline; }
        .mission-card.in-cart .remove-btn { display: flex !important; }
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
        @media (max-width: 500px) {
          .basket-panel { width: 100vw; }
        }
      `}</style>

      {/* Blurred page background */}
      <div className="page-blur-wrap">
        <div style={{background: '#00a3da', color: '#fff', textAlign: 'center', padding: '10px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 14}}>
          {bannerText}
        </div>
        <div style={{background: '#fff', borderBottom: '2px solid #e6f7fd', padding: '14px 8%', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 15px rgba(0,0,0,0.06)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, background: '#f0f8fc', border: '1.5px solid #c8dce6', borderRadius: 8, padding: '8px 14px', fontSize: 14, fontWeight: 600, color: '#315371'}}>
              <span>&#127470;&#127475;</span> INR <i className="fas fa-chevron-down" style={{fontSize: 10}}></i>
            </div>
            <input type="number" placeholder="Amount" value={quickAmt} onChange={e => setQuickAmt(Number(e.target.value))}
              style={{width: 120, border: '1.5px solid #c8dce6', borderRadius: 8, padding: '8px 12px', fontSize: 14, outline: 'none'}} />
            {[100, 150, 200, 500].map(val => (
              <button key={val} onClick={() => handlePreset(val)}
                style={{background: activePreset === val ? '#00A3DA' : '#f0f8fc', color: activePreset === val ? '#fff' : '#315371', border: `1.5px solid ${activePreset === val ? '#00A3DA' : '#c8dce6'}`, borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer'}}>
                &#8377;{val} INR
              </button>
            ))}
            <button onClick={() => setBasketOpen(true)} style={{background: 'linear-gradient(135deg, #00A3DA, #0088bb)', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 28px', fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 8px 25px rgba(0,163,218,0.35)'}}>
              QUICK DONATE
            </button>
          </div>
        </div>
      </div>

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
              <input type="tel" className="basket-input phone-inp" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
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
