import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { getSetting } from '../../lib/site';
import './Footer.css';

const DEFAULT_FOOTER_SECTIONS = [
  {
    title: 'Organization',
    links: [
      { label: 'Our Story', url: '/about' },
      { label: 'Our Mission', url: '/about' },
      { label: 'Team & Careers', url: '/about/management-team' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Donate', url: '/donate' },
      { label: 'Volunteer', url: '/volunteer' },
      { label: 'Events & Gallery', url: '/gallery' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Audited Financials', url: '/about/legal-documents' },
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' },
    ],
  },
];

const DEFAULT_SOCIALS = [
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/share/1DvP7Ne98A/?mibextid=wwXIfr',
    icon: '/images/facebook.png',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/aflf_official?igsh=ZWxjb284a2Jjem12',
    icon: '/images/instagram.png',
  },
  {
    label: 'YouTube',
    url: 'https://youtube.com/@ashrayforlifefoundation?si=Ys1DRMk-bzcjt-Or',
    icon: '/images/youtube.png',
  },
];

function parseFooterColumns(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* fall through to default */
  }
  return DEFAULT_FOOTER_SECTIONS;
}

function Footer() {
  const { site } = useSite();
  const siteName = getSetting(site, 'site.siteName', 'Ashray Foundation');
  const logoUrl =
    site?.organization?.logoUrl || '/images/Ashray Foundation logo.png';
  const copyright = getSetting(
    site,
    'footer.copyright',
    '© 2026 Ashray Foundation. All rights reserved.'
  );
  const columns = parseFooterColumns(getSetting(site, 'footer.columns', ''));
  const socials = DEFAULT_SOCIALS.map((social) => ({
    ...social,
    url: getSetting(site, `social.${social.label.toLowerCase()}`, social.url) ||
      social.url,
  }));

  return (
    <footer className="bg-tertiary border-t-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg px-gutter py-section-gap max-w-container-max mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt={siteName}
              className="h-12 w-auto object-contain rounded-lg bg-white p-1"
            />
            <span className="text-headline-sm font-headline-sm text-on-tertiary">
              {siteName}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-tertiary-container">
            {copyright}
          </p>
          <div className="flex gap-4 mt-4">
            {socials.map((social) => (
              <a
                key={social.label}
                className="text-on-tertiary-container hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <img src={social.icon} alt={social.label} className="w-6 h-6 invert" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h4 className="font-label-bold text-label-bold text-on-tertiary uppercase tracking-wider mb-2">
              {section.title}
            </h4>
            {(section.links ?? []).map((link) =>
              link.url === '#' || /^https?:/.test(link.url) ? (
                <a
                  key={link.label}
                  className="font-body-md text-body-md text-on-tertiary-container hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
                  href={link.url}
                  target={/^https?:/.test(link.url) ? '_blank' : undefined}
                  rel={/^https?:/.test(link.url) ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  className="font-body-md text-body-md text-on-tertiary-container hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
                  to={link.url}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>

      <div className="max-w-container-max mx-auto px-gutter pb-10 pt-6 border-t border-on-tertiary/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-label-bold text-label-bold text-on-tertiary-container">
          Registered Charity No. E-37237 · 80G Tax Exempt
        </p>
        <div className="flex items-center gap-4">
          <img
            src="/images/qr-code.jpeg"
            alt="Donation QR Code"
            className="w-16 h-16 rounded-xl border border-outline-variant bg-white p-1 shadow-sm object-contain"
          />
          <p className="font-label-bold text-label-bold text-on-tertiary flex items-center gap-1">
            Made with <span className="text-error">❤</span> for a better tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
