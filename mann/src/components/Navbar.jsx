import { useState, useLayoutEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { navMenu } from "../data/site";
import Icon from "./Icon";
import { img } from "../utils/images";

// ============ SOFT MODERN NAVBAR ============

function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="MANN CARE FOUNDATION Home">
      <img
        src={img("/logo.png")}
        alt="MANN CARE FOUNDATION"
        className="h-14 md:h-16 w-auto"
      />
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);

  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDrop(null);
  };

  const addRipple = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height) * 2.2;
    const r = document.createElement("span");
    r.className = "ripple-ink";
    r.style.width = `${d}px`;
    r.style.height = `${d}px`;
    r.style.left = `${e.clientX - rect.left - d / 2}px`;
    r.style.top = `${e.clientY - rect.top - d / 2}px`;

    const core = document.createElement("span");
    core.className = "ripple-core";
    r.appendChild(core);

    for (let i = 0; i < 3; i++) {
      const ring = document.createElement("span");
      ring.className = "ripple-ring";
      ring.style.animationDelay = `${i * 0.16}s`;
      r.appendChild(ring);
    }

    el.appendChild(r);
    setTimeout(() => r.remove(), 1600);
  };

  const navCls = `fixed top-0 w-full z-50 transition-all duration-500 ${
    scrolled ? "nav-scrolled py-4" : "py-6"
  }`;

  const linkCls = "font-label-bold text-label-sm text-on-surface hover:text-primary transition-colors uppercase tracking-[0.15em]";

  return (
    <nav className={navCls} id="main-nav">
      <div className="flex justify-between items-center w-full px-6 lg:px-8 max-w-container-max mx-auto">
        <Logo />

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navMenu.map((item) => (
            <div key={item.label} className="relative group">
              {item.children ? (
                <>
                  <button className={`${linkCls} flex items-center gap-1`}>
                    {item.label}
                    <Icon name="expand_more" className="text-sm" />
                  </button>
                  <ul className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                    <div className="min-w-[240px] bg-white rounded-2xl border border-primary/10 shadow-xl p-2">
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <NavLink
                            to={c.to}
                            onClick={closeMobile}
                            className="block px-4 py-2.5 font-label-bold text-label-sm uppercase tracking-[0.15em] text-on-surface hover:bg-secondary-fixed/50 hover:text-primary rounded-lg transition-colors"
                          >
                            {c.label}
                          </NavLink>
                        </li>
                      ))}
                    </div>
                  </ul>
                </>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkCls} ${isActive ? "text-primary" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}

          <Link
            to="/get-involved/donate-online"
            onClick={addRipple}
            className="relative overflow-hidden support-heartbeat bg-primary text-white font-label-bold text-label-sm uppercase px-8 py-4 rounded-full hover:bg-secondary transition-all shadow-lg shadow-primary/20"
          >
            Support Us
          </Link>
        </div>

        {/* Burger */}
        <button
          className="lg:hidden text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <Icon name={mobileOpen ? "close" : "menu"} className="text-4xl" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-white ${
          mobileOpen ? "max-h-[80vh] overflow-y-auto border-t border-primary/10 shadow-xl" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {navMenu.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  className="w-full flex justify-between items-center py-3 font-label-bold text-label-sm uppercase tracking-[0.15em] text-on-surface"
                  onClick={() => setOpenDrop(openDrop === item.label ? null : item.label)}
                >
                  {item.label}
                  <Icon
                    name="expand_more"
                    className={`text-lg transition-transform ${
                      openDrop === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all ${
                    openDrop === item.label ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {item.children.map((c) => (
                    <Link
                      key={c.to}
                      to={c.to}
                      onClick={closeMobile}
                      className="block pl-4 py-2.5 text-sm text-on-surface hover:text-primary"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeMobile}
                className="py-3 font-label-bold text-label-sm uppercase tracking-[0.15em] text-on-surface"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            to="/get-involved/donate-online"
            onClick={(e) => {
              addRipple(e);
              closeMobile();
            }}
            className="relative overflow-hidden support-heartbeat mt-3 text-center bg-primary text-white font-label-bold text-label-sm uppercase px-8 py-4 rounded-full hover:bg-secondary transition-all shadow-lg shadow-primary/20"
          >
            Support Us
          </Link>
        </div>
      </div>
    </nav>
  );
}

export { Logo };
