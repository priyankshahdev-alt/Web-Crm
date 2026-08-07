import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const Careers = () => {
  const content = usePageContent('careers');

  const bannerHeading = content('careers-banner', 'heading') ?? 'Careers';
  const sectionHeading = content('careers-heading', 'heading') ?? 'Join Our';
  const sectionHeadingSpan = content('careers-heading', 'headingSpan') ?? 'Mission';
  const sectionText =
    content('careers-heading', 'description') ??
    'Be part of a team dedicated to selfless service and social change. Explore career opportunities or volunteer with us.';
  const whyTitle = content('careers-why', 'title') ?? 'Why Join Us?';
  const whyText =
    content('careers-why', 'description') ??
    'Being Sevak Charitable Trust offers a meaningful work environment where you can make a real difference. We value passion, integrity, and a commitment to serving communities.';
  const openingsTitle = content('careers-openings', 'title') ?? 'Current Openings';
  const openings =
    content('careers-openings', 'items') ?? [
      'Program Manager',
      'Social Media Coordinator',
      'Field Volunteer',
      'Fundraising Associate',
      'Content Writer',
    ];
  const benefitsTitle = content('careers-benefits', 'title') ?? 'Volunteer Benefits';
  const benefits =
    content('careers-benefits', 'items') ?? [
      { icon: 'fas fa-award', title: 'Certificate', description: 'Official recognition for your service' },
      { icon: 'fas fa-graduation-cap', title: 'Skill Dev', description: 'Learn & grow through real work' },
      { icon: 'fas fa-users', title: 'Network', description: 'Connect with like-minded people' },
      { icon: 'fas fa-hand-holding-heart', title: 'Impact', description: 'Directly contribute to social change' },
    ];
  const formTitle = content('careers-form', 'title') ?? 'Volunteer Application';
  const formText = content('careers-form', 'description') ?? 'Fill out the form below and our team will get back to you.';
  const popupTitle = content('careers-popup', 'title') ?? 'Form Submitted!';
  const popupText =
    content('careers-popup', 'description') ?? 'Thank you for your interest. Our team will get back to you soon.';

  const [showSuccess, setShowSuccess] = useState(false);
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volNameErr, setVolNameErr] = useState('');
  const [volEmailErr, setVolEmailErr] = useState('');
  const [volPhoneErr, setVolPhoneErr] = useState('');

  const showError = (setter) => {
    setTimeout(() => setter(''), 2000);
  };

  const handleVolNameChange = (e) => {
    const val = e.target.value;
    if (/^[A-Za-z\s]*$/.test(val)) {
      setVolName(val);
      setVolNameErr('');
    } else {
      setVolNameErr('Invalid name');
      showError(setVolNameErr);
    }
  };

  const handleVolEmailChange = (e) => {
    const val = e.target.value;
    if (val && !/^[A-Za-z0-9@.]+$/.test(val)) {
      setVolEmailErr('Invalid email');
      showError(setVolEmailErr);
      return;
    }
    setVolEmail(val);
    setVolEmailErr('');
  };

  const handleVolPhoneChange = (e) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) {
      setVolPhoneErr('Only numeric characters accept');
      showError(setVolPhoneErr);
      return;
    }
    if (val.length > 10) {
      setVolPhoneErr('Only 10 digits allowed');
      showError(setVolPhoneErr);
      return;
    }
    setVolPhone(val);
    if (val.length === 10 && !/^[6-9]/.test(val)) {
      setVolPhoneErr('Mobile number must start with 6, 7, 8 or 9');
      showError(setVolPhoneErr);
    } else if (val.length > 0 && val.length < 10) {
      setVolPhoneErr('10 digit number accept only');
    } else {
      setVolPhoneErr('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setVolName('');
    setVolEmail('');
    setVolPhone('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Open Sans',sans-serif;color:#1a1a2e;overflow-x:hidden}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);color:#fff;border-radius:0px;margin:20px 0;padding:10px}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;margin:0}
        .careers-section{padding:60px 6%;background:#f4f7fb}
        .careers-inner{max-width:1100px;margin:0 auto}
        .section-title{text-align:center;margin-bottom:50px}
        .section-title h2{font-family:'Montserrat',sans-serif;font-size:38px;font-weight:800;color:#03163E;margin-bottom:10px}
        .section-title h2 span{color:#00A2D9}
        .section-title p{font-size:16px;color:#4a5568;max-width:600px;margin:0 auto;line-height:1.6}
        .careers-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
        .info-card{background:#fff;border-radius:20px;padding:35px;box-shadow:0 10px 30px rgba(0,0,0,0.06);margin-bottom:24px;transition:0.4s ease}
        .info-card:hover{background:#00a3da;transform:translateY(-4px);box-shadow:0 15px 40px rgba(0,163,218,0.2)}
        .info-card:hover h3,.info-card:hover p,.info-card:hover ul li,.info-card:hover ul li i{color:#fff}
        .info-card:hover h3 i{background:rgba(255,255,255,0.2)}
        .info-card h3{font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700;color:#03163E;margin-bottom:12px;display:flex;align-items:center;gap:12px}
        .info-card h3 i{width:44px;height:44px;background:linear-gradient(135deg,#00A2D9,#0072a0);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px}
        .info-card p{font-size:14px;color:#4a5568;line-height:1.7;margin-left:56px}
        .info-card ul{list-style:none;margin-left:56px}
        .info-card ul li{font-size:14px;color:#4a5568;padding:6px 0;display:flex;align-items:center;gap:10px}
        .info-card ul li i{color:#00A2D9;font-size:12px}
        .form-card{background:#fff;border-radius:20px;padding:35px;box-shadow:0 10px 30px rgba(0,0,0,0.06)}
        .form-card h3{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:700;color:#03163E;margin-bottom:8px;text-align:center}
        .form-card > p{text-align:center;font-size:14px;color:#4a5568;margin-bottom:28px}
        .form-group{margin-bottom:20px}
        .form-group label{display:block;font-size:13px;font-weight:600;color:#03163E;margin-bottom:6px}
        .form-group label span{color:#e74c3c}
        .form-group input,.form-group select,.form-group textarea{width:100%;padding:12px 16px;border:2px solid #e8edf2;border-radius:10px;font-size:14px;font-family:'Open Sans',sans-serif;color:#1a1a2e;transition:0.3s;background:#fafbfc}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#00A2D9;outline:none;box-shadow:0 0 0 3px rgba(0,163,218,0.1);background:#fff}
        .form-group textarea{resize:vertical;min-height:100px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .submit-btn{width:100%;padding:14px;background:linear-gradient(135deg,#00A2D9,#0072a0);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:16px;border:none;border-radius:12px;cursor:pointer;transition:0.4s;letter-spacing:0.5px}
        .submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,163,218,0.3)}
        .field-error{color:#e74c3c;font-size:12px;margin-top:4px;display:block}
        .volunteer-benefits{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}
        .benefit-item{background:#f4f7fb;border-radius:12px;padding:16px;text-align:center;transition:0.3s}
        .benefit-item i{font-size:24px;color:#00A2D9;margin-bottom:8px;display:block}
        .benefit-item h4{font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#03163E;margin-bottom:4px}
        .benefit-item p{font-size:12px;color:#4a5568;margin:0}
        .benefit-item:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,0.12);background:linear-gradient(135deg,#00a3da,#315270)}
        .benefit-item:hover h4,.benefit-item:hover p,.benefit-item:hover i{color:#fff}
        @media(max-width:860px){.careers-grid{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}.volunteer-benefits{grid-template-columns:1fr}.section-title h2{font-size:28px}}
        .popup-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;visibility:hidden;transition:all 0.3s ease}
        .popup-overlay.show{opacity:1;visibility:visible}
        .popup-box{background:#fff;border-radius:16px;padding:40px 50px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.2);transform:scale(0.8);transition:transform 0.3s ease;max-width:400px}
        .popup-overlay.show .popup-box{transform:scale(1)}
        .popup-box .popup-icon{width:60px;height:60px;border-radius:50%;background:#2eb85c;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;color:#fff}
        .popup-box h3{font-family:'Montserrat',sans-serif;font-size:1.4rem;color:#03163E;margin-bottom:8px}
        .popup-box p{font-size:0.95rem;color:#4a5568;margin:0}
      `}</style>

      <section className="tax-box">
        <h1>{bannerHeading}</h1>
      </section>

      <section className="careers-section">
        <div className="careers-inner">
          <div className="section-title">
            <h2>{sectionHeading} <span>{sectionHeadingSpan}</span></h2>
            <p>{sectionText}</p>
          </div>

          <div className="careers-grid">
            <div>
              <div className="info-card">
                <h3><i className="fas fa-bullseye"></i> {whyTitle}</h3>
                <p>{whyText}</p>
              </div>

              <div className="info-card">
                <h3><i className="fas fa-check-circle"></i> {openingsTitle}</h3>
                <ul>
                  {openings.map((item, i) => (
                    <li key={i}><i className="fas fa-chevron-right"></i> {item}</li>
                  ))}
                </ul>
              </div>

              <div className="info-card">
                <h3><i className="fas fa-heart"></i> {benefitsTitle}</h3>
                <div className="volunteer-benefits">
                  {benefits.map((benefit, i) => (
                    <div className="benefit-item" key={i}>
                      <i className={benefit.icon}></i>
                      <h4>{benefit.title}</h4>
                      <p>{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-card">
              <h3>{formTitle}</h3>
              <p>{formText}</p>

              <form id="volunteerForm" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span>*</span></label>
                    <input type="text" required placeholder="Your full name" value={volName} onChange={handleVolNameChange} />
                    {volNameErr && <span className="field-error">{volNameErr}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email <span>*</span></label>
                    <input type="email" required placeholder="Your email address" value={volEmail} onChange={handleVolEmailChange} />
                    {volEmailErr && <span className="field-error">{volEmailErr}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone <span>*</span></label>
                    <input type="tel" required placeholder="Your phone number" value={volPhone} onChange={handleVolPhoneChange} />
                    {volPhoneErr && <span className="field-error">{volPhoneErr}</span>}
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" placeholder="Your city" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Area of Interest <span>*</span></label>
                  <select required>
                    <option value="">Select an option</option>
                    <option>Program Management</option>
                    <option>Field Volunteering</option>
                    <option>Fundraising</option>
                    <option>Content &amp; Social Media</option>
                    <option>Teaching &amp; Education</option>
                    <option>Healthcare Support</option>
                    <option>Administrative Support</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Weekends Only</option>
                    <option>Flexible</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Why do you want to join us? <span>*</span></label>
                  <textarea required placeholder="Tell us about your motivation and experience..."></textarea>
                </div>
                <button type="submit" className="submit-btn">SUBMIT APPLICATION</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className={`popup-overlay ${showSuccess ? 'show' : ''}`} onClick={() => setShowSuccess(false)}>
        <div className="popup-box">
          <div className="popup-icon"><i className="fas fa-check"></i></div>
          <h3>{popupTitle}</h3>
          <p>{popupText}</p>
        </div>
      </div>
    </>
  );
};

export default Careers;
