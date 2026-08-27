import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const DEFAULT_NAV = [
  {
    id: 'about',
    label: 'ABOUT US',
    children: [
      { label: 'About BSCT', url: '/about' },
      { label: 'Management', url: '/management' },
      { label: 'Trust Documents', url: '/trust-documents' },
      { label: 'Where We Work', url: '/where-we-work' },
    ],
  },
  {
    id: 'what',
    label: 'WHAT WE DO',
    children: [
      { label: 'Mission Annapurna', url: '/mission-annapurna' },
      { label: 'Mission Vidhya', url: '/mission-vidhya' },
      { label: 'Mission Aurat', url: '/mission-aurat' },
      { label: 'Mission Bezubaan', url: '/mission-bezubaan' },
      { label: 'Mission Atmanirbhar', url: '/mission-atmanirbhar' },
      { label: 'Mission Arogya', url: '/mission-wellness' },
      { label: 'Sevak Seva Kendra', url: '/sevak-seva-kendra' },
      { label: 'Mission Eco-Warriors', url: '/mission-eco' },
    ],
  },
  {
    id: 'news',
    label: 'NEWS & STORIES',
    children: [
      { label: 'Awards/Achievements', url: '/awards' },
      { label: 'Press Release', url: '/press' },
      { label: 'In News Paper', url: '/newspaper' },
    ],
  },
  { id: 'contact', label: 'CONTACT US', url: '/contact' },
  {
    id: 'involved',
    label: 'GET INVOLVED',
    children: [
      { label: 'Individual Donation', url: '/individual-donation' },
      { label: 'Volunteers(SEVAK BANO)', url: '/careers' },
      { label: 'CSR', url: '/csr' },
      { label: 'School/Institute Collaboration', url: '/school-collaboration' },
      { label: 'NGO Collaboration', url: '/ngo-collaboration' },
    ],
  },
];

export default function Navbar() {
  const { getMenu } = useSite();
  const menu = getMenu('main-nav');
  const navItems = menu?.items && menu.items.length > 0 ? menu.items : DEFAULT_NAV;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const location = useLocation();
  const isAnnapurna = location.pathname.includes('annapurna');

  const closeAll = () => {
    setDesktopDropdown(null);
    setOpenDropdown(null);
    setMobileOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    closeAll();
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.nav-item.dropdown, .mobile-menu, .hamburger')) {
        setDesktopDropdown(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
    document.body.style.overflow = mobileOpen ? '' : 'hidden';
  };

  const closeMobile = () => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  const closeDesktopDropdown = () => { setDesktopDropdown(null); };

  const renderNavLink = (item) => {
    if (!item.url) return null;
    if (item.url.startsWith('/')) {
      return <Link to={item.url} onClick={closeAll}>{item.label}</Link>;
    }
    return <a href={item.url} onClick={closeAll} target={item.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{item.label}</a>;
  };

  return (
    <>
      <header className="navbar" style={{ background: isAnnapurna ? 'linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%)' : undefined, boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.3)' }}>
        <div className="navbar-inner">
          <Link to="/" className="nav-logo">
            <div className="logo-circle">
              <img src="/logo11.png" alt="MATW Logo" style={{width:'100%',height:'100%',objectFit:'contain'}} loading="lazy" decoding="async" width="48" height="48" />
            </div>
            <img src="/images/bs.png" alt="Text Logo" className="BS-text-logo" loading="lazy" decoding="async" width="48" height="48" />
          </Link>

          <div className="nav-quick">
            <div className="zakat-circle-wrap">
              <div className="zakat-pulse-ring"></div>
              <div className="zakat-pulse-ring ring2"></div>
              <Link to="/anndaan">
                <button className="zakat-circle-btn">
                  <img src="https://matwproject.org.uk/static/media/zakat.4b8e5d8777306e3a7621.png" alt="Anndaan" loading="lazy" decoding="async" width="800" height="600" />
                </button>
              </Link>
              <span className="zakat-label">Ann&#x0926;&#x093E;&#x0928;</span>
            </div>
          </div>

          <div className="nav-quick">
            <div className="zakat-circle-wrap">
              <div className="zakat-pulse-ring"></div>
              <div className="zakat-pulse-ring ring2"></div>
              <Link to="/sevak-nivash">
                <button className="zakat-circle-btn">
                  <img src="https://matwproject.org.uk/static/media/zakat.4b8e5d8777306e3a7621.png" alt="Sevak Nivas" loading="lazy" decoding="async" width="800" height="600" />
                </button>
              </Link>
              <span className="zakat-label">Sevak&#x0928;&#x093F;&#x0935;&#x093E;&#x0938;</span>
            </div>
          </div>

          <nav className="nav-links">
            {navItems.map((item) => {
              const key = item.id || item.label;
              const hasChildren = item.children && item.children.length > 0;
              if (hasChildren) {
                return (
                  <div key={key} className={`nav-item dropdown ${desktopDropdown === key ? 'open' : ''}`}
                    onMouseEnter={() => setDesktopDropdown(key)}
                    onMouseLeave={closeDesktopDropdown}>
                    <a href="#" onClick={e => { e.preventDefault(); setDesktopDropdown(desktopDropdown === key ? null : key); }}>{item.label} <i className="fas fa-chevron-down"></i></a>
                    <div className="dropdown-menu">
                      {item.children.map((child) => (
                        <span key={child.id || child.url || child.label}>{renderNavLink(child)}</span>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={key} className="nav-item">
                  {renderNavLink(item)}
                </div>
              );
            })}
          </nav>

          <div className="nav-right">
            <div className="yt-avatar">
              <a href="https://www.youtube.com/@BeingSevak" target="_blank" rel="noopener noreferrer">
                <div className="yt-icon">
                  <i className="fab fa-youtube"></i>
                </div>
              </a>
              <img className="avatar-img" src="/images/host.png" alt="host" onError={e => e.target.style.display='none'} loading="lazy" decoding="async" width="48" height="48" />
            </div>
            <Link to="/donate" className="donate-btn">DONATE</Link>
          </div>

          <Link to="/donate" className="mob-donate-btn">DONATE</Link>
          <button className="hamburger" onClick={toggleMobile} aria-label="Menu">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobileMenu">
        <button className="close-menu" onClick={closeMobile}><i className="fas fa-times"></i></button>
        <nav className="mobile-nav">
          {navItems.map((item) => {
            const key = item.id || item.label;
            const hasChildren = item.children && item.children.length > 0;
            if (hasChildren) {
              return (
                <div key={key} className={`mnav-item has-sub ${openDropdown === key ? 'open' : ''}`}>
                  <a href="#" className="mnav-link" onClick={e => { e.preventDefault(); toggleDropdown(key); }}>{item.label} <i className="fas fa-chevron-down"></i></a>
                  <div className="mnav-sub">
                    {item.children.map((child) => (
                      <span key={child.id || child.url || child.label}>{renderNavLink(child)}</span>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={key} className="mnav-item">
                <Link to={item.url} className="mnav-link" onClick={closeAll}>{item.label}</Link>
              </div>
            );
          })}
          <Link to="/donate" className="mobile-donate-btn">DONATE</Link>
        </nav>
      </div>
    </>
  );
}

