import { useSite } from '../context/SiteContext';

export default function WhatsAppFloat() {
  const { getSetting } = useSite();
  const number = (getSetting('whatsapp.number', '') || getSetting('contact.phone', '')).replace(/\D+/g, '') || '918879035035';
  const name = getSetting('site.siteName', 'Being Sevak Charitable Trust');
  const href = `https://wa.me/${number}?text=${encodeURIComponent(`Hello ${name}, I would like to know more.`)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
