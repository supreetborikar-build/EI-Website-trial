import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from './Toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      const res = await api.subscribeNewsletter(email);
      addToast(res.message || 'Subscribed successfully!', 'success');
      setEmail('');
    } catch (err) {
      addToast(err.message || 'Failed to subscribe', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer blueprint-footer" style={{ position: 'relative', overflow: 'hidden', borderTop: '2px solid var(--cad-border, rgba(21, 94, 239, 0.35))' }}>
      {/* Top Architectural Millimeter Ruler */}
      <div className="blueprint-ruler-top">
        <span>09 // SYSTEM CLOSURE // ARCHITECTURAL TITLE BLOCK</span>
        <span>SPEC: EI-2026-FINAL // REV: v4.2.0</span>
        <span>GRID: 0.5mm PRECISION</span>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* CAD Drawing Sheet Title Block Header */}
        <div className="cad-title-block" style={{ marginTop: '2.5rem', borderRadius: '6px', overflow: 'hidden' }}>
          <div className="cad-corner-marker tl" />
          <div className="cad-corner-marker tr" />
          <div className="cad-corner-marker bl" />
          <div className="cad-corner-marker br" />

          <div className="cad-tb-row" style={{ background: 'rgba(21, 94, 239, 0.05)' }}>
            <div className="cad-tb-cell" style={{ flex: '1.5' }}>
              <span className="cad-tb-label">PROJECT NAME</span>
              <span className="cad-tb-val">ENGINEERING INDIA — PAN-INDIA STUDENT MOVEMENT</span>
            </div>
            <div className="cad-tb-cell" style={{ flex: '1.2' }}>
              <span className="cad-tb-label">AFFILIATION / CAMPUS</span>
              <span className="cad-tb-val">ST. VINCENT PALLOTTI COLLEGE, NAGPUR</span>
            </div>
            <div className="cad-tb-cell" style={{ flex: '0.8' }}>
              <span className="cad-tb-label">COORDINATES</span>
              <span className="cad-tb-val">21.1458° N, 79.0882° E</span>
            </div>
            <div className="cad-tb-cell" style={{ flex: '0.7' }}>
              <span className="cad-tb-label">DRAWING STATUS</span>
              <span className="cad-tb-val" style={{ color: '#10B981' }}>VERIFIED &amp; ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Main 4-Column Architectural Spread */}
        <div className="footer-grid" style={{ padding: '60px 0 50px' }}>
          {/* Column 1: Brand & Charter */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span style={{ color: 'var(--heading, #111315)', fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
                ENGINEERING
              </span>
              <span style={{ color: 'var(--blueprint-blue, #155EEF)', fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.75rem', marginLeft: '6px' }}>
                INDIA
              </span>
            </div>

            <p style={{ color: 'var(--body, #334155)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.92rem', lineHeight: 1.65, maxWidth: '42ch', margin: '0.75rem 0 1.5rem 0' }}>
              A living blueprint bridging academia and real-world technology.
              Uniting student developers, designers, and innovators to engineer solutions with human purpose.
            </p>

            <div className="footer-social" style={{ display: 'flex', gap: '8px' }}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="cad-social-btn">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="cad-social-btn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="cad-social-btn">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="cad-social-btn">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="cad-social-btn">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Architecture Navigation */}
          <div className="footer-links">
            <h4 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--blueprint-blue, #155EEF)', marginBottom: '1.25rem' }}>
              SYSTEM DIRECTORY
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--heading, #111315)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', opacity: 0.5 }}>01 //</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--heading, #111315)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', opacity: 0.5 }}>02 //</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/committee" style={{ color: 'var(--heading, #111315)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', opacity: 0.5 }}>03 //</span> Executive Committee
                </Link>
              </li>
              <li>
                <Link to="/events" style={{ color: 'var(--heading, #111315)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', opacity: 0.5 }}>04 //</span> Events Catalog
                </Link>
              </li>
              <li>
                <Link to="/news" style={{ color: 'var(--heading, #111315)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', opacity: 0.5 }}>05 //</span> Journal &amp; News
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--heading, #111315)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', opacity: 0.5 }}>06 //</span> Contact Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Engineering Disciplines */}
          <div className="footer-links">
            <h4 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--blueprint-blue, #155EEF)', marginBottom: '1.25rem' }}>
              LAB DISCIPLINES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <span style={{ color: 'var(--body, #334155)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', opacity: 0.5 }}>DEV_01</span> AI &amp; Robotics Systems
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--body, #334155)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', opacity: 0.5 }}>DEV_02</span> Full-Stack Architecture
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--body, #334155)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', opacity: 0.5 }}>DEV_03</span> Civic &amp; Social Innovation
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--body, #334155)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', opacity: 0.5 }}>DEV_04</span> Cloud &amp; Distributed Edge
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--body, #334155)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', opacity: 0.5 }}>DEV_05</span> Open-Source R&amp;D Lab
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Telemetry Dispatch (Newsletter) */}
          <div className="footer-newsletter">
            <h4 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--blueprint-blue, #155EEF)', marginBottom: '1.25rem' }}>
              TELEMETRY DISPATCH
            </h4>
            <p style={{ color: 'var(--body, #334155)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Subscribe to national hackathon alerts, engineering blueprints, and open-source releases.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe} style={{ position: 'relative' }}>
              <input
                type="email"
                className="cad-input-box"
                placeholder="developer@campus.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for telemetry dispatch"
                disabled={submitting}
                style={{ paddingRight: '48px' }}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={submitting}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--blueprint-blue, #155EEF)',
                  border: 'none',
                  borderRadius: '4px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright & Drawing Sheet Stamp */}
      <div className="footer-bottom" style={{ borderTop: '1px solid var(--cad-border-subtle, rgba(17, 19, 21, 0.12))', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ margin: 0, fontFamily: 'JetBrains Mono, Space Grotesk, monospace', fontSize: '0.75rem', color: 'var(--light-text, #64748B)' }}>
            &copy; {new Date().getFullYear()} ENGINEERING INDIA. ALL SPECIFICATIONS VERIFIED.
          </p>
          <div className="footer-bottom-links" style={{ display: 'flex', gap: '1.5rem', fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem' }}>
            <a href="#!" style={{ textDecoration: 'none', color: 'var(--light-text, #64748B)' }}>DRAWING CODE: CAD-EI-2026</a>
            <a href="#!" style={{ textDecoration: 'none', color: 'var(--light-text, #64748B)' }}>PRIVACY PROTOCOL</a>
            <a href="#!" style={{ textDecoration: 'none', color: 'var(--light-text, #64748B)' }}>TERMS OF OPERATION</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
