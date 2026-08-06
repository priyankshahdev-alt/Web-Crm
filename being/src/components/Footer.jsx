import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const DEFAULT_FOOTER_COLUMNS = [
  {
    title: 'About Us',
    links: [
      { label: 'About BSCT', url: '/about' },
      { label: 'Management', url: '/management' },
      { label: 'Mission / Vision', url: '/mission-vision' },
      { label: 'Trust Documents', url: '/trust-documents' },
      { label: 'Where We Work', url: '/where-we-work' },
      { label: 'Awards / Achievements', url: '/awards' },
    ],
  },
  {
    title: 'Our Projects',
    links: [
      { label: 'Mission Annapurna', url: '/mission-annapurna' },
      { label: 'Mission Vidhya', url: '/mission-vidhya' },
      { label: 'Mission Aurat', url: '/mission-aurat' },
      { label: 'Mission Bezubaan', url: '/mission-bezubaan' },
      { label: 'Mission Atmanirbhar', url: '/mission-atmanirbhar' },
      { label: 'Mission Arogya', url: '/mission-wellness' },
      { label: 'Sevak Seva Kendra', url: '/sevak-seva-kendra' },
      { label: 'Mission Beach Sevak', url: '/mission-beach' },
    ],
  },
  {
    title: 'GET INVOLVED',
    links: [
      { label: 'Individual Donation', url: '/individual-donation' },
      { label: 'Volunteers(SEVAK BANO)', url: '/careers' },
      { label: 'CSR', url: '/csr' },
      { label: 'School/Institute Collaboration', url: '/school-collaboration' },
      { label: 'NGO Collaboration', url: '/ngo-collaboration' },
    ],
  },
];

export default function Footer() {
  const { getSetting, getMenu } = useSite();
  const footerMenu = getMenu('footer-nav');
  const linkColumns = footerMenu?.items && footerMenu.items.length > 0
    ? footerMenu.items.map((col) => ({
        title: col.label,
        links: (col.children || []).map((link) => ({ label: link.label, url: link.url })),
      }))
    : DEFAULT_FOOTER_COLUMNS;
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
        {linkColumns.map((col, i) => {
          const isLast = i === linkColumns.length - 1;
          return (
            <div className="footer-col" key={col.title || i}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.url || link.label}>
                    <Link to={link.url}>{link.label}</Link>
                  </li>
                ))}
              </ul>
              {isLast && (
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
              )}
            </div>
          );
        })}
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
