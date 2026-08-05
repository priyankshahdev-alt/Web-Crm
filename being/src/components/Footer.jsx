import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

export default function Footer() {
  const { getSetting } = useSite();
  const phone = getSetting('contact.phone', '+91 8879035035');
  const email = getSetting('contact.email', 'being.sevak@gmail.com');
  const address = getSetting('contact.address', 'MUMBAI, INDIA');
  const tagline = getSetting(
    'site.tagline',
    'Serving humanity with compassion, dignity, and hope — empowering lives through food, education, healthcare, and community support',
  );
  const copyright = getSetting(
    'footer.copyright',
    '© 2026 Copyright 2023 Being Sevak Charitable Trust. All rights reserved. Registered Charity No. E-31948',
  );
  const socialFb = getSetting('social.facebook', '');
  const socialIg = getSetting('social.instagram', '');
  const socialYt = getSetting('social.youtube', '');
  const socialLi = getSetting('social.linkedin', '');
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-logo">
            <img src="/images/logo11.png" alt="Being Sevak Logo" className="footer-logo-img" />
            <img src="/images/bs.png" alt="Text Logo" className="BS-text-logo" />
          </div>
          <p className="footer-desc"> {tagline}</p>
        </div>
        <div className="footer-col">
          <h4>About Us</h4>
          <ul>
            <li><Link to="/about">About BSCT</Link></li>
            <li><Link to="/management">Management</Link></li>
            <li><Link to="/mission-vision">Mission / Vision</Link></li>
            <li><Link to="/trust-documents">Trust Documents</Link></li>
            <li><Link to="/where-we-work">Where We Work</Link></li>
            <li><Link to="/awards">Awards / Achievements</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Our Projects</h4>
          <ul>
            <li><Link to="/mission-annapurna">Mission Annapurna</Link></li>
            <li><Link to="/mission-vidhya">Mission Vidhya</Link></li>
            <li><Link to="/mission-aurat">Mission Aurat</Link></li>
            <li><Link to="/mission-bezubaan">Mission Bezubaan</Link></li>
            <li><Link to="/mission-atmanirbhar">Mission Atmanirbhar</Link></li>
            <li><Link to="/mission-wellness">Mission Arogya</Link></li>
            <li><Link to="/sevak-seva-kendra">Sevak Seva Kendra</Link></li>
            <li><Link to="/mission-beach">Mission Beach Sevak</Link></li>
            {/* <li><Link to="/mission-eco">Mission Eco-Warriors</Link></li> */}
          </ul>
        </div>
        <div className="footer-col">
          <h4>GET INVOLVED</h4>
          <ul>
            <li><Link to="/individual-donation">Individual Donation</Link></li>
            <li><Link to="/careers">Volunteers(SEVAK BANO)</Link></li>
            <li><Link to="/csr">CSR</Link></li>
            <li><Link to="/school-collaboration">School/Institute Collaboration</Link></li>
            <li><Link to="/ngo-collaboration">NGO Collaboration</Link></li>
          </ul>
          <div className="social-icons">
            <a href={socialFb ? `https://www.facebook.com/${socialFb}` : 'https://www.facebook.com/share/1P33YzE6HM/?mibextid=wwXIfr'} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href={socialIg ? `https://www.instagram.com/${socialIg}` : 'https://www.instagram.com/beingsevak?igsh=MTRjam5nNjU4a2w1Mw=='} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href={socialYt ? `https://www.youtube.com/@${socialYt}` : 'https://youtube.com/@beingsevak?si=T_qcPUg699KmS8_2'} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
            <a href={socialLi ? `https://www.linkedin.com/company/${socialLi}` : 'https://www.linkedin.com/company/www-linkedin-cominshwetashah2658ba102/'} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="footer-contact-link"><i className="fas fa-phone"></i>{phone}</a>
          <a href={`mailto:${email}`} className="footer-contact-link"><i className="fas fa-envelope"></i>{email}</a>
          <p><i className="fas fa-map-marker-alt"></i> {address}</p>
          <div className="footer-badges">
            <a href="/brochure/BSCT E-Brochure.pdf" className="brochure-btn" download>
              <i className="fas fa-file-pdf"></i> Brochure
            </a>
            <div className="footer-qr">
              <img src="/images/Qrcode.jpeg" alt="Donation QR Code" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{copyright}</p>
        <div className="footer-links">
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
