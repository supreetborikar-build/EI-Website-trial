import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLenis } from './SmoothScroll';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const lenis = useLenis();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Close mobile menu on page route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Smooth scroll listener for smart navbar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // Floating ribbon compact state
          setIsScrolled(currentScrollY > 40);

          // Scroll-to-top button visibility
          setShowScrollTop(currentScrollY > 300);

          // Smart auto-hide on scroll down, reveal on scroll up
          if (!mobileMenuOpen) {
            if (currentScrollY > 120 && currentScrollY > lastScrollY.current + 8) {
              setIsHidden(true);
            } else if (currentScrollY < lastScrollY.current - 5 || currentScrollY <= 40) {
              setIsHidden(false);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleScrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenis]);

  return (
    <>
      <header className={`site-header ${isHidden ? 'nav-hidden' : ''}`}>
        <nav
          className={`navbar ei-shared-navbar ${isScrolled ? 'scrolled' : ''}`}
          aria-label="Primary navigation"
        >
          <Link to="/" className="ei-brand" aria-label="Engineering India home">
            <span className="ei-india-logo" aria-hidden="true">
              <img src="/assets/branding/engineering-india-logo.png" alt="Engineering India logo" />
            </span>
            <span className="ei-brand-name">Engineering India</span>
          </Link>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
                <span className="nav-idx">01</span> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-idx">02</span> About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/committee" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-idx">03</span> Executive Committee
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-idx">04</span> Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/news" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-idx">05</span> News &amp; Announcements
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-idx">06</span> Contact Us
              </NavLink>
            </li>
          </ul>

          <div className="ei-nav-actions">
            <Link to="/contact" className="join-btn">
              Join Us
            </Link>

            <button
              onClick={toggleTheme}
              className="ei-theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title="Switch theme"
            >
              <span className="ei-theme-icon" aria-hidden="true">
                {theme === 'light' ? '☼' : '☾'}
              </span>
            </button>

            <button
              className={`menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Smooth floating back to top button */}
      <button
        onClick={handleScrollToTop}
        className={`ei-scroll-top ${showScrollTop ? 'show' : ''}`}
        aria-label="Scroll back to top"
        title="Scroll to top"
        type="button"
      >
        <span style={{ fontSize: '1.25rem', transform: 'translateY(-1px)' }}>↑</span>
      </button>
    </>
  );
}
