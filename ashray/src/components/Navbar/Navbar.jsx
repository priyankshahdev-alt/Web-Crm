import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { getMenu, getSetting } from '../../lib/site';
import './Navbar.css';

const DEFAULT_NAV_LINKS = [
  {
    label: 'About Us',
    path: '/about',
    dropdown: [
      { label: 'Management Team', path: '/about/management-team' },
      { label: 'Legal Documents', path: '/about/legal-documents' },
    ],
  },
  {
    label: 'Our Projects',
    path: '/programs',
    dropdown: [
      { label: 'Vidhyalaya', path: '/programs/education', icon: 'school' },
      {
        label: 'Nari Tarang',
        path: '/programs/women-empowerment',
        icon: 'female',
      },
      {
        label: 'Zero Hunger Drive',
        path: '/programs/zero-hunger-drive',
        icon: 'lunch_dining',
      },
      { label: 'Project JAL', path: '/programs/jal-project', icon: 'water_drop' },
      {
        label: 'Ashray Ka Aashra',
        path: '/programs/orphanage',
        icon: 'family_home',
      },
      { label: 'Sahara', path: '/programs/medical', icon: 'medical_services' },
      {
        label: 'Ashray Ka Aashram',
        path: '/programs/old-age-home',
        icon: 'elderly',
      },
      { label: 'Pashu Premi', path: '/programs/pashu-premi', icon: 'pets' },
    ],
  },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Get Involved', path: '/volunteer' },
  { label: 'Contact Us', path: '/ContactUs' },
];

// Convert a database menu (items with url/children) into the nav link shape.
function normalizeMenu(menu) {
  if (!menu || !Array.isArray(menu.items)) return null;
  const links = menu.items
    .filter((item) => item.url || (item.children && item.children.length > 0))
    .map((item) => ({
      label: item.label,
      path:
        item.url || (item.children?.[0]?.url ? item.children[0].url : '#'),
      dropdown:
        item.children && item.children.length > 0
          ? item.children
              .filter((c) => c.url)
              .map((c) => ({ label: c.label, path: c.url, icon: '' }))
          : null,
    }));
  return links.length > 0 ? links : null;
}

const donateFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSfhfciakVlI_lXX1m_9QcEcnEoD4SPu97rlPO6p0oGs7xGW0A/viewform?usp=dialog';

// Stacked brand lockup: icon + two-line wordmark. Text is hidden below the
// `xl` breakpoint so the desktop menu never crowds at 1024-1279px.
function Logo({ onDark = false, force = false }) {
  const { site } = useSite();
  const logoUrl =
    site?.organization?.logoUrl || '/images/Ashray Foundation logo.png';
  const siteName = getSetting(site, 'site.siteName', 'Ashray for Life');
  const line1 = siteName.endsWith('Foundation')
    ? siteName.slice(0, -'Foundation'.length).trim()
    : siteName;
  const textCls = `${force ? 'flex' : 'hidden xl:flex'} flex-col leading-none ${
    onDark ? 'text-white' : 'text-primary'
  }`;
  return (
    <Link
      to="/"
      className="flex items-center gap-3 group shrink-0"
      aria-label="Ashray for Life Foundation Home"
    >
      <img
        src={logoUrl}
        alt={siteName}
        className="h-11 w-auto xl:h-14 object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <span className={textCls}>
        <span className="font-label-bold text-[15px] font-semibold uppercase tracking-[0.08em]">
          {line1}
        </span>
        <span
          className={`mt-1 text-[10px] font-bold uppercase tracking-[0.32em] ${
            onDark ? 'text-white/70' : 'text-[#1a2a4a]/70'
          }`}
        >
          Foundation
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  const navRef = useRef(null);
  const triggerRefs = useRef({});
  const menuRefs = useRef({});
  const lastTriggerRef = useRef(null);
  const location = useLocation();
  const { site } = useSite();

  // DB-driven menu with the hardcoded template links as fallback.
  const navLinks = normalizeMenu(getMenu(site, 'main-nav')) ?? DEFAULT_NAV_LINKS;
  const donateUrl =
    getSetting(site, 'header.donateUrl', donateFormUrl) || donateFormUrl;

  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDrop(null);
  };

  // Close the drawer whenever the route changes
  useEffect(() => {
    closeMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Escape closes the mobile drawer or any open dropdown
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setOpenDrop(null);
        if (lastTriggerRef.current) {
          lastTriggerRef.current.focus();
          lastTriggerRef.current = null;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Click outside closes desktop dropdowns
  useEffect(() => {
    const onDocClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDrop(null);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const addRipple = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height) * 2.2;
    const r = document.createElement('span');
    r.className = 'ripple-ink';
    r.style.width = `${d}px`;
    r.style.height = `${d}px`;
    r.style.left = `${e.clientX - rect.left - d / 2}px`;
    r.style.top = `${e.clientY - rect.top - d / 2}px`;

    const core = document.createElement('span');
    core.className = 'ripple-core';
    r.appendChild(core);

    for (let i = 0; i < 3; i++) {
      const ring = document.createElement('span');
      ring.className = 'ripple-ring';
      ring.style.animationDelay = `${i * 0.16}s`;
      r.appendChild(ring);
    }

    el.appendChild(r);
    setTimeout(() => r.remove(), 1600);
  };

  const isChildActive = (item) =>
    item.dropdown &&
    item.dropdown.some(
      (c) =>
        location.pathname === c.path ||
        location.pathname.startsWith(c.path + '/')
    );

  // --- Keyboard navigation for desktop dropdowns ---
  const focusLinkInMenu = (path, index) => {
    const menu = menuRefs.current[path];
    if (!menu) return;
    const links = menu.querySelectorAll('a[href]');
    if (!links.length) return;
    if (index === 'first') links[0].focus();
    else if (index === 'last') links[links.length - 1].focus();
    else if (index < 0) links[(index + links.length) % links.length].focus();
    else links[index % links.length].focus();
  };

  const handleTriggerKeyDown = (e, item) => {
    if (
      e.key === 'Enter' ||
      e.key === ' ' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp'
    ) {
      e.preventDefault();
      if (openDrop === item.path) {
        setOpenDrop(null);
        return;
      }
      setOpenDrop(item.path);
      lastTriggerRef.current = e.currentTarget;
      requestAnimationFrame(() =>
        focusLinkInMenu(item.path, e.key === 'ArrowUp' ? 'last' : 'first')
      );
    }
  };

  const handleMenuLinkKeyDown = (e, item) => {
    const menu = menuRefs.current[item.path];
    if (!menu) return;
    const links = menu.querySelectorAll('a[href]');
    const idx = Array.prototype.indexOf.call(links, e.currentTarget);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusLinkInMenu(item.path, idx + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusLinkInMenu(item.path, idx - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusLinkInMenu(item.path, 'first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusLinkInMenu(item.path, 'last');
    }
  };

  const handleDropdownFocusOut = (e, item) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpenDrop((cur) => (cur === item.path ? null : cur));
    }
  };

  // ~96px at rest on desktop, ~80px once scrolled; 72px/64px on mobile.
  const navCls = `sticky top-0 w-full z-[100] isolate transition-all duration-500 border-b ${
    scrolled
      ? 'nav-scrolled nav-solid h-16 xl:h-20 border-outline-variant/40'
      : 'h-[72px] xl:h-24 border-transparent'
  }`;

  // Higher-contrast navy links (WCAG AA on white/frosted surfaces).
  const linkCls =
    'nav-link font-label-bold font-semibold text-base text-[#1a2a4a] hover:text-[#00236f] transition-colors uppercase tracking-[0.06em]';

  const triggerCls = `${linkCls} flex items-center gap-1.5 py-2`;

  const activeTriggerCls = 'is-active text-primary font-extrabold';

  const itemCls = (isActive) =>
    `flex items-center gap-3 px-4 py-3 font-label-bold font-semibold text-[13px] uppercase tracking-[0.1em] rounded-xl transition-all duration-200 ${
      isActive
        ? 'text-primary bg-secondary-fixed/50'
        : 'text-[#1a2a4a] hover:text-[#00236f] hover:bg-surface-container-high'
    }`;

  const pillCls =
    'relative overflow-hidden inline-flex items-center justify-center gap-2 bg-primary text-white font-label-bold font-semibold text-sm uppercase px-8 py-4 rounded-full hover:bg-primary-container transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30';

  return (
    <nav className={navCls} id="main-nav" ref={navRef} aria-label="Main navigation">
      <div className="flex justify-between items-center gap-4 w-full px-5 xl:px-6 2xl:px-8 max-w-container-max mx-auto h-full">
        <Logo />

        {/* Desktop menu — shown at xl (1280px) and above */}
        <div className="hidden xl:flex items-center gap-3 2xl:gap-5">
          {navLinks.map((item) => (
            <div
              key={item.path}
              className="relative group nav-dropdown"
              onFocusOut={(e) => handleDropdownFocusOut(e, item)}
            >
              {item.dropdown ? (
                <>
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[item.path] = el;
                    }}
                    onClick={() =>
                      setOpenDrop(openDrop === item.path ? null : item.path)
                    }
                    onMouseEnter={() => setOpenDrop(item.path)}
                    onKeyDown={(e) => handleTriggerKeyDown(e, item)}
                    aria-haspopup="true"
                    aria-expanded={openDrop === item.path}
                    aria-controls={`drop-${item.path.replaceAll('/', '-')}`}
                    className={`${triggerCls} ${
                      isChildActive(item) ? activeTriggerCls : ''
                    }`}
                  >
                    {item.label}
                    <span
                      className={`material-symbols-outlined text-lg transition-transform duration-200 ${
                        openDrop === item.path ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </button>
                  <ul
                    id={`drop-${item.path.replaceAll('/', '-')}`}
                    ref={(el) => {
                      menuRefs.current[item.path] = el;
                    }}
                    className={`absolute left-0 top-full pt-4 z-50 transition-all duration-200 ease-out ${
                      openDrop === item.path
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible translate-y-2 pointer-events-none'
                    } group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto`}
                  >
                    <div className="nav-drop-panel relative bg-white rounded-2xl border border-primary/10 shadow-2xl shadow-primary/10 p-2">
                      <span
                        className="nav-drop-caret absolute -top-[6px] left-6 h-3 w-3 bg-white border-l border-t border-primary/10 rotate-45"
                        aria-hidden="true"
                      />
                      {item.dropdown.length > 5 ? (
                        <div className="grid grid-cols-2 gap-1 min-w-[440px] p-1">
                          {item.dropdown.map((c) => (
                            <li key={c.path}>
                              <NavLink
                                to={c.path}
                                onClick={closeMobile}
                                onKeyDown={(e) =>
                                  handleMenuLinkKeyDown(e, item)
                                }
                                className={({ isActive }) => itemCls(isActive)}
                              >
                                <span
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary overflow-hidden"
                                  aria-hidden="true"
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    {c.icon}
                                  </span>
                                </span>
                                {c.label}
                              </NavLink>
                            </li>
                          ))}
                        </div>
                      ) : (
                        item.dropdown.map((c) => (
                          <li key={c.path}>
                            <NavLink
                              to={c.path}
                              onClick={closeMobile}
                              onKeyDown={(e) =>
                                handleMenuLinkKeyDown(e, item)
                              }
                              className={({ isActive }) => itemCls(isActive)}
                            >
                              {c.label}
                            </NavLink>
                          </li>
                        ))
                      )}
                    </div>
                  </ul>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${linkCls} py-2 ${isActive ? activeTriggerCls : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <a
              href={donateUrl}
              className="inline-flex items-center rounded-full bg-primary/[0.07] border border-primary/10 text-primary font-label-bold font-bold text-[11px] uppercase tracking-[0.18em] px-3 py-2 transition-colors duration-200 hover:bg-primary/10 hover:border-primary/20 whitespace-nowrap"
            >
              10B / 80 g
            </a>
            <Link
              to="/donate"
              onClick={addRipple}
              className="btn-3d btn-3d--nav"
            >
              <span
                className="btn-3d__icon material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                aria-hidden="true"
              >
                favorite
              </span>
              Donate Now
            </Link>
          </div>
        </div>

        {/* Burger */}
        <button
          className="xl:hidden text-primary p-2 -mr-1 rounded-full hover:bg-surface-container-high transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <span className="material-symbols-outlined text-4xl" aria-hidden="true">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[110] xl:hidden ${
          mobileOpen ? '' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobile}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl shadow-primary/20 flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/50">
            <Logo force />
            <button
              onClick={closeMobile}
              className="text-primary p-2 rounded-full hover:bg-surface-container-high transition-colors"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-3xl" aria-hidden="true">
                close
              </span>
            </button>
          </div>

          {/* Drawer links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
            {navLinks.map((item) =>
              item.dropdown ? (
                <div key={item.path} className="border-b border-outline-variant/40">
                  <button
                    className={`w-full flex justify-between items-center py-4 px-3 font-label-bold font-semibold text-[15px] uppercase tracking-[0.08em] ${
                      isChildActive(item)
                        ? 'text-primary font-extrabold'
                        : 'text-[#1a2a4a]'
                    }`}
                    onClick={() =>
                      setOpenDrop(openDrop === item.path ? null : item.path)
                    }
                    aria-expanded={openDrop === item.path}
                  >
                    {item.label}
                    <span
                      className={`material-symbols-outlined text-lg transition-transform duration-300 ${
                        openDrop === item.path ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      openDrop === item.path ? 'max-h-[28rem]' : 'max-h-0'
                    }`}
                  >
                    <div className="flex flex-col pb-2 gap-0.5">
                      {item.dropdown.map((c) => (
                        <Link
                          key={c.path}
                          to={c.path}
                          onClick={closeMobile}
                          className={`flex items-center gap-3 py-3 pl-4 pr-3 text-sm rounded-lg transition-colors ${
                            location.pathname === c.path
                              ? 'text-primary bg-secondary-fixed/40 font-semibold'
                              : 'text-[#1a2a4a] hover:text-[#00236f] hover:bg-surface-container-high'
                          }`}
                        >
                          {c.icon && (
                            <span
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary overflow-hidden"
                              aria-hidden="true"
                            >
                              <span className="material-symbols-outlined text-lg">
                                {c.icon}
                              </span>
                            </span>
                          )}
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={`block py-4 px-3 font-label-bold font-semibold text-[15px] uppercase tracking-[0.08em] border-b border-outline-variant/40 ${
                    location.pathname === item.path
                      ? 'text-primary font-extrabold'
                      : 'text-[#1a2a4a] hover:text-[#00236f]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Drawer footer CTA */}
          <div className="px-5 py-5 border-t border-outline-variant/50 flex flex-col gap-3 bg-surface-container-low/60">
            <Link
              to="/donate"
              onClick={(e) => {
                addRipple(e);
                closeMobile();
              }}
              className={`${pillCls} w-full text-center`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                aria-hidden="true"
              >
                favorite
              </span>
              Donate Now
            </Link>
            <a
              href={donateUrl}
              className="inline-flex items-center justify-center rounded-full bg-primary/[0.07] border border-primary/10 text-primary font-label-bold font-bold text-[11px] uppercase tracking-[0.18em] px-8 py-3 transition-colors duration-200 hover:bg-primary/10 hover:border-primary/20 w-full"
            >
              10B / 80 g
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Logo };
