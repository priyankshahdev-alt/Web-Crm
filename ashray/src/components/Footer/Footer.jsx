import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import './Footer.css';

const footerSections = [
  {
    title: 'About Us',
    links: [
      { label: 'Management Team', path: '/about/management-team' },
      { label: 'Legal Documents', path: '/about/legal-documents' },
      { label: 'Gallery', path: '/gallery' },
    ],
  },
  {
    title: 'Our Projects',
    links: [
      { label: 'Vidhyalaya', path: '/programs/education' },
      { label: 'Nari Tarang', path: '/programs/women-empowerment' },
      { label: 'Zero Hunger Drive', path: '/programs/zero-hunger-drive' },
      { label: 'Project JAL', path: '/programs/jal-project' },
      { label: 'Ashray Ka Aashra', path: '/programs/orphanage' },
      { label: 'Sahara', path: '/programs/medical' },
      { label: 'Ashray Ka Aashram', path: '/programs/old-age-home' },
      { label: 'Pashu Premi', path: '/programs/pashu-premi' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Volunteer', path: '/volunteer' },
      { label: 'Donate', path: '/donate' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { label: 'Get in Touch', path: '/ContactUs' },
    ],
  },
];

const socialLinks = [
  { label: 'Facebook', url: 'https://www.facebook.com/share/1DvP7Ne98A/?mibextid=wwXIfr', icon: <img src="/images/facebook.png" alt="Facebook" className="footer-social-img" /> },
  { label: 'Instagram', url: 'https://www.instagram.com/aflf_official?igsh=ZWxjb284a2Jjem12', icon: <img src="/images/instagram.png" alt="Instagram" className="footer-social-img" /> },
  { label: 'YouTube', url: 'https://youtube.com/@ashrayforlifefoundation?si=Ys1DRMk-bzcjt-Or', icon: <img src="/images/youtube.png" alt="YouTube" className="footer-social-img" /> },
];

function Footer() {
  const { getSetting } = useSite();
  const regNumber = getSetting('contact.regNumber', 'Reg. No. E-37237, Mumbai, Maharashtra');
  const copyright = getSetting('footer.copyright', '© 2022 Ashray for Life Foundation');
  return (
    <footer className="footer">
      <div className="footer-inner">
        {footerSections.map((section) => (
          <div key={section.title} className="footer-col">
            <h5>{section.title}</h5>
            <ul>
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="footer-col footer-qr-col">
          <div className="footer-qr">
            <img src="/images/qr-code.jpeg" alt="QR Code" />
          </div>
        </div>
      </div>

      <div className="footer-social-bar">
        {socialLinks.map((platform) => (
          <a key={platform.label} href={platform.url} target="_blank" rel="noopener noreferrer" aria-label={platform.label}>{platform.icon}</a>
        ))}
      </div>

      <div className="footer-bottom">
        <p>{regNumber}</p>
        <p>{copyright}</p>
        <div className="footer-links">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms &amp; Conditions</Link>
          {/* <Link to="#">Safeguarding policy</Link>
          <Link to="#">Donor rights</Link>
          <Link to="#">Sitemap</Link> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
