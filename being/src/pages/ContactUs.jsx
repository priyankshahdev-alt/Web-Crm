import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSite } from '../context/SiteContext';

const ContactUs = () => {
  const { getSetting } = useSite();
  const contactPhone = getSetting('contact.phone', '+91 8879035035');
  const contactEmail = getSetting('contact.email', 'being.sevak@gmail.com');
  const bankName = getSetting('bank.accountName', '');
  const bankAccount = getSetting('bank.accountNumber', '');
  const bankIfsc = getSetting('bank.ifsc', '');
  const mapSrc = getSetting('map.embedUrl', '');
  const socialFb = getSetting('social.facebook', '');
  const socialIg = getSetting('social.instagram', '');
  const socialYt = getSetting('social.youtube', '');
  const socialLi = getSetting('social.linkedin', '');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [messageErr, setMessageErr] = useState('');

  const showError = (setter) => {
    setTimeout(() => setter(''), 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.info-card, .contact-form-wrap').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name || e.target.id]: e.target.value });
  };

  const handleFirstNameChange = (e) => {
    const val = e.target.value;
    if (/^[A-Za-z\s]*$/.test(val)) {
      setFormData({ ...formData, firstName: val });
      setFirstNameErr('');
    } else {
      setFirstNameErr('Invalid name');
      showError(setFirstNameErr);
    }
  };

  const handleLastNameChange = (e) => {
    const val = e.target.value;
    if (/^[A-Za-z\s]*$/.test(val)) {
      setFormData({ ...formData, lastName: val });
      setLastNameErr('');
    } else {
      setLastNameErr('Invalid name');
      showError(setLastNameErr);
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    if (val && !/^[A-Za-z0-9@.]+$/.test(val)) {
      setEmailErr('Invalid email');
      showError(setEmailErr);
      return;
    }
    setFormData({ ...formData, email: val });
    setEmailErr('');
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) {
      setPhoneErr('Invalid');
      showError(setPhoneErr);
      return;
    }
    if (val.length > 10) {
      setPhoneErr('Phone number must contain 10 digits.');
      showError(setPhoneErr);
      return;
    }
    setFormData({ ...formData, phone: val });
    if (val.length === 10 && !/^[6-9]/.test(val)) {
      setPhoneErr('Mobile number must start with 6, 7, 8 or 9');
      showError(setPhoneErr);
    } else if (val.length > 0 && val.length < 10) {
      setPhoneErr('Phone number must contain 10 digits.');
    } else {
      setPhoneErr('');
    }
  };

  const handleMessageChange = (e) => {
    const val = e.target.value;
    if (val.length <= 100) {
      setFormData({ ...formData, message: val });
      setMessageErr('');
    } else {
      setMessageErr('Only 100 characters accept');
      showError(setMessageErr);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;
          --green:#2eb85c;--gold:#D4AF37;--white:#ffffff;--light-bg:#f4f7fb;
          --text-dark:#1a1a2e;--text-mid:#4a5568;
        }
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);color:#fff;border-radius:0px;margin:20px 0;padding:10px;box-shadow:0 15px 40px rgba(0,0,0,0.15);position:relative;overflow:hidden;transition:0.4s ease;}
        .tax-box::before{content:"";position:absolute;width:200%;height:200%;background:radial-gradient(circle,rgba(255,255,255,0.15),transparent);top:-50%;left:-50%;animation:shine 6s linear infinite;}
        @keyframes shine{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
        .tax-box h1{font-size:1.4rem;font-weight:700;line-height:1.6;font-family:'Montserrat',sans-serif;position:relative;z-index:2;}
        .tax-box:hover{transform:translateY(-5px) scale(1.01);box-shadow:0 25px 60px rgba(0,163,218,0.35);}
        .contact-container{max-width:1100px;margin:0 auto;padding:60px 24px;}
        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start;}
        .contact-info h2{font-family:'Montserrat',sans-serif;font-weight:800;font-size:1.6rem;color:var(--navy);margin-bottom:8px;}
        .contact-info > p{color:var(--text-mid);font-size:0.95rem;margin-bottom:30px;line-height:1.7;}
        .info-card{display:flex;align-items:flex-start;gap:16px;background:var(--white);border:1px solid #e2ecf5;border-radius:16px;padding:20px 22px;margin-bottom:16px;transition:all 0.4s cubic-bezier(0.22,1,0.36,1);box-shadow:0 2px 12px rgba(0,0,0,0.04);}
        .info-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.08);border-color:var(--cyan);background:#00a3da;}
        .info-card:hover h4,.info-card:hover p,.info-card:hover a,.info-card:hover strong,.info-card:hover .visit-item p{color:#fff;}
        .info-card:hover .icon-box{transform:scale(1.1) rotate(-5deg);}
        .info-card .icon-box{width:50px;height:50px;border-radius:12px;background:linear-gradient(135deg, var(--cyan), var(--mid));display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--white);flex-shrink:0;transition:transform 0.4s ease;}
        .info-card h4{font-family:'Montserrat',sans-serif;font-weight:700;font-size:0.95rem;color:var(--navy);margin-bottom:4px;}
        .info-card p,.info-card a{font-size:0.88rem;color:var(--text-mid);line-height:1.6;text-decoration:none;}
        .info-card a:hover{color:var(--cyan);}
        .visit-card .icon-box{align-self:flex-start;margin-top:4px;}
        .visit-accordion{margin-top:6px;}
        .visit-item{padding:8px 0;border-bottom:1px solid #eef4f8;}
        .visit-item:last-child{border-bottom:none;}
        .visit-item strong{display:block;font-family:'Montserrat',sans-serif;font-size:0.8rem;color:var(--navy);margin-bottom:2px;}
        .visit-item p{font-size:0.8rem;color:var(--text-mid);line-height:1.5;margin:0;}
        .social-section{margin-top:30px;}
        .social-section h3{font-family:'Montserrat',sans-serif;font-weight:700;font-size:1rem;color:var(--navy);margin-bottom:14px;}
        .social-links{display:flex;gap:12px;}
        .social-links a{width:44px;height:44px;border-radius:12px;background:var(--light-bg);border:1px solid #e2ecf5;display:flex;align-items:center;justify-content:center;font-size:1.15rem;color:var(--mid);text-decoration:none;transition:all 0.35s cubic-bezier(0.22,1,0.36,1);}
        .social-links a:hover{background:var(--cyan);color:var(--white);border-color:var(--cyan);transform:translateY(-4px) scale(1.05);box-shadow:0 8px 20px rgba(0,162,217,0.25);}
        .contact-form-wrap{background:var(--white);border:1px solid #e2ecf5;border-radius:20px;padding:36px 32px;box-shadow:0 8px 30px rgba(0,0,0,0.05);transition:box-shadow 0.4s ease;}
        .contact-form-wrap:hover{box-shadow:0 16px 50px rgba(0,0,0,0.08);}
        .contact-form-wrap h3{font-family:'Montserrat',sans-serif;font-weight:800;font-size:1.3rem;color:var(--navy);margin-bottom:6px;}
        .contact-form-wrap > p{font-size:0.88rem;color:var(--text-mid);margin-bottom:24px;}
        .form-group{margin-bottom:18px;}
        .form-group label{display:block;font-family:'Montserrat',sans-serif;font-weight:600;font-size:0.8rem;color:var(--navy);margin-bottom:6px;}
        .form-group label .req{color:#e53935;}
        .form-group input,.form-group select,.form-group textarea{width:100%;padding:12px 16px;border:2px solid #e2ecf5;border-radius:12px;font-size:0.88rem;font-family:'Open Sans',sans-serif;color:var(--text-dark);background:#fafcfe;outline:none;transition:all 0.3s ease;}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--cyan);box-shadow:0 0 0 4px rgba(0,162,217,0.1);background:var(--white);}
        .form-group textarea{min-height:120px;resize:vertical;}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .submit-btn{background:linear-gradient(135deg, var(--cyan), var(--mid));color:var(--white);border:none;padding:14px 36px;font-size:0.95rem;font-weight:700;font-family:'Montserrat',sans-serif;border-radius:50px;cursor:pointer;transition:all 0.35s ease;box-shadow:0 8px 25px rgba(0,162,217,0.3);width:100%;position:relative;overflow:hidden;}
        .submit-btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);transition:0.5s;}
        .submit-btn:hover::before{left:100%;}
        .submit-btn:hover{transform:translateY(-3px);box-shadow:0 12px 35px rgba(0,162,217,0.35);}
        .field-err{display:block;color:#e53935;font-size:0.75rem;margin-top:4px;font-family:'Open Sans',sans-serif;}
        .submit-btn:active{transform:translateY(-1px);}
        .map-section{background:var(--light-bg);padding:60px 24px;}
        .map-section .section-label{font-family:'Montserrat',sans-serif;font-weight:800;font-size:1.5rem;color:var(--navy);margin-bottom:24px;text-align:center;}
        .map-section .section-label::after{content:'';display:block;width:60px;height:4px;background:var(--gold);margin:10px auto 0;border-radius:2px;}
        .map-wrap{max-width:1100px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.1);}
        .map-wrap iframe{width:100%;height:400px;display:block;border:none;}
        @media(max-width:768px){.contact-grid{grid-template-columns:1fr;gap:32px;}.form-row{grid-template-columns:1fr;}.contact-form-wrap{padding:24px 18px;}.map-wrap iframe{height:280px;}}
        @media(max-width:480px){.contact-container{padding:40px 18px;}}
      `}</style>

      <section className="tax-box">
        <h1>Get in Touch</h1>
      </section>

      <section className="contact-container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Let's Connect</h2>
            <p>Whether you want to volunteer, collaborate, or learn more about our work, we're just a message away. Visit
              any of our offices across India.</p>

            <div className="info-card">
              <div className="icon-box"><i className="fas fa-phone"></i></div>
              <div>
                <h4>Phone</h4>
                <p><a href={`tel:${contactPhone.replace(/\s+/g, '')}`} style={{color:'inherit',textDecoration:'none'}}>{contactPhone}</a></p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-box"><i className="fas fa-envelope"></i></div>
              <div>
                <h4>Email</h4>
                <p><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-box"><i className="fas fa-university"></i></div>
              <div>
                <h4>Bank Details</h4>
                <p><strong>Name:</strong> {bankName || 'Being Sevak Charitable Trust'}</p>
                <p><strong>Bank:</strong> Axis Bank, Kandivali (West), Mumbai</p>
                <p><strong>A/C No:</strong> {bankAccount || '920010066029137'}</p>
                <p><strong>IFSC:</strong> {bankIfsc || 'UTIB0000201'}</p>
              </div>
            </div>

            <div className="info-card visit-card">
              <div className="icon-box"><i className="fas fa-map-marker-alt"></i></div>
              <div>
                <h4>Visit Us</h4>
                <div className="visit-accordion">
                  <div className="visit-item">
                    <strong>Mumbai Office</strong>
                    <p>New Delights CHS Ltd, A Wing, 4th Floor, Office No 401, Chandavarkar Road, Borivali West, Mumbai,
                      Maharashtra, 400092.</p>
                  </div>
                  <div className="visit-item">
                    <strong>Mumbai Office 2</strong>
                    <p>D-45/380, DEVDAYA CHS, SECTOR NO -3 CHARKOP KANDIVALI WEST,
                      MUMBAI, Maharashtra, 400067, IN,
                      D-45/380, DEVDAYA CHS, MUMBAI, 400067, IN</p>
                  </div>
                  <div className="visit-item">
                    <strong>Gujarat Office</strong>
                    <p>Bharat Min, Next to Maruti Mobile Home Guard Chowk, Home Guard Chowk Road, Dwarka, Gujarat,
                      Pin-361335</p>
                  </div>
                  <div className="visit-item">
                    <strong>Tamil Nadu Office</strong>
                    <p>No:85, Tansi, opposite G.S.T Road, Marai Malai Nagar, Chengalpattu, Tamil Nadu, Pin-603209.</p>
                  </div>
                  <div className="visit-item">
                    <strong>West Bengal Office</strong>
                    <p>Vill+po-Harishpur, P.S-Basirhat, Dist-North 24 Parganas, West Bengal, Pin-743412.</p>
                  </div>
                  <div className="visit-item">
                    <strong>Uttar Pradesh Office</strong>
                    <p>Shop no 2, Sundar Complex, Sundar City, Chandrawal Bijnor Road, Near CRPF camp Sarojni Nagar, Lucknow
                      UP, Pin-226002</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-box"><i className="fas fa-clock"></i></div>
              <div>
                <h4>Office Hours</h4>
                <p>Monday – Saturday: 10:00 AM – 6:30 PM</p>
              </div>
            </div>

            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href={socialFb ? `https://www.facebook.com/${socialFb}` : 'https://www.facebook.com/share/1P33YzE6HM/?mibextid=wwXIfr'} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href={socialIg ? `https://www.instagram.com/${socialIg}` : 'https://www.instagram.com/beingsevak?igsh=MTRjam5nNjU4a2w1Mw=='} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href={socialYt ? `https://www.youtube.com/@${socialYt}` : 'https://youtube.com/@beingsevak?si=T_qcPUg699KmS8_2'} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                <a href={socialLi ? `https://www.linkedin.com/company/${socialLi}` : 'https://www.linkedin.com/company/www-linkedin-cominshwetashah2658ba102/'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            <h3>Send Us a Message</h3>
            <p>We'll get back to you within 24 hours.</p>
            {!formSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name <span className="req">*</span></label>
                    <input type="text" id="cf_name" name="firstName" placeholder="Your first name" value={formData.firstName} onChange={handleFirstNameChange} required />
                    {firstNameErr && <span className="field-err">{firstNameErr}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" id="cf_lname" name="lastName" placeholder="Your last name" value={formData.lastName} onChange={handleLastNameChange} />
                    {lastNameErr && <span className="field-err">{lastNameErr}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email <span className="req">*</span></label>
                    <input type="email" id="cf_email" name="email" placeholder="Your email address" value={formData.email} onChange={handleEmailChange} required />
                    {emailErr && <span className="field-err">{emailErr}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone <span className="req">*</span></label>
                    <input type="tel" id="cf_phone" name="phone" placeholder="Your phone number" value={formData.phone} onChange={handlePhoneChange} required />
                    {phoneErr && <span className="field-err">{phoneErr}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject <span className="req">*</span></label>
                  <select id="cf_subject" name="subject" value={formData.subject} onChange={handleChange} required>
                    <option value="">Select a subject</option>
                    <option value="Volunteer">Volunteer Enquiry</option>
                    <option value="Donation">Donation Related</option>
                    <option value="Collaboration">Collaboration / Partnership</option>
                    <option value="Feedback">Feedback / Suggestion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message <span className="req">*</span></label>
                    <textarea id="cf_message" name="message" placeholder="Write your message here..." value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
            ) : (
              <div style={{marginTop:16,padding:16,background:'#e8f8ed',borderRadius:12,color:'var(--green)',fontWeight:600,textAlign:'center'}}>
                <i className="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="map-section">
        <h2 className="section-label">Find Us</h2>
        <div className="map-wrap">
          <iframe
            src={mapSrc || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609981036!2d72.74109991096822!3d19.082197838769528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5c0d2c4a1c8b8b0b!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2s!4v1'}
            allowFullScreen loading="lazy" title="Google Maps Mumbai"></iframe>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
