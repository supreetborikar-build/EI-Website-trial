import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();
  const containerRef = useScrollReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.sendContact(formData);
      setSubmitted(true);
      addToast(res.message || 'Message received! We will be in touch shortly.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      addToast(err.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-container blueprint-paper-canvas" ref={containerRef} style={{ position: 'relative' }}>
      {/* Top CAD Architectural Millimeter Ruler */}
      <div className="blueprint-ruler-top">
        <span>06 // TRANSMISSION GATEWAY // EI-COMMUNICATION</span>
        <span>SYS_STATUS: READY</span>
        <span>COORDINATES: 21.1458° N, 79.0882° E // ENCRYPTED</span>
      </div>

      <main>
        <section className="contact" id="contact" style={{ padding: '80px 0' }}>
          <div className="container">
            {/* Header */}
            <div className="contact-header" data-reveal="fade-up">
              <div className="telemetry-tag" style={{ marginBottom: '1rem' }}>
                <span>06 // TRANSMISSION &amp; INITIATION // DIRECT LINK</span>
              </div>
              <span className="section-tag">GET IN TOUCH</span>
              <h1 className="editorial-section-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                Let's <span className="outline-text">Connect</span>
              </h1>
              <p className="editorial-lead">
                Have a question, partnership idea, or want to start a chapter? We'd love to
                hear from you. Send us a message and our team will get back to you.
              </p>
            </div>

            {/* Contact Grid */}
            <div className="contact-grid">
              {/* Form Side */}
              <div className="contact-form-wrapper blueprint-sheet-card cad-frame-wrap" data-reveal="fade-right" style={{ padding: '2.5rem', borderRadius: '8px' }}>
                <div className="cad-corner-marker tl" />
                <div className="cad-corner-marker tr" />
                <div className="cad-corner-marker bl" />
                <div className="cad-corner-marker br" />

                <div className="blueprint-spec-header" style={{ margin: '-2.5rem -2.5rem 2rem -2.5rem' }}>
                  <span>TERMINAL_TX // DIRECT_TRANSMISSION</span>
                  <span>ENCRYPTED // PORT_5173</span>
                </div>

                {submitted && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid #10B981',
                      color: '#10B981',
                      padding: '16px',
                      borderRadius: '4px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontFamily: 'Space Grotesk, monospace'
                    }}
                  >
                    <span>✓</span>
                    <span>
                      TRANSMISSION CONFIRMED. Your dispatch has been logged into the chapter database.
                    </span>
                  </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="cad-input-box"
                      placeholder="e.g. Maya Lin"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="cad-input-box"
                      placeholder="maya@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      Subject / Objective *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="cad-input-box"
                      placeholder="e.g. Chapter Partnership / Membership"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      Message Transmission *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="cad-input-box"
                      rows="5"
                      placeholder="Describe your initiative or query..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <MagneticButton style={{ marginTop: '0.5rem' }}>
                    <button type="submit" className="btn-cinematic-primary" disabled={loading} style={{ cursor: 'pointer' }}>
                      <span>{loading ? 'Transmitting...' : 'Send Transmission'}</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  </MagneticButton>
                </form>
              </div>

              {/* Info Side */}
              <div className="contact-info" data-reveal="fade-left">
                <TiltCard className="info-card blueprint-sheet-card cad-frame-wrap" style={{ borderRadius: '6px' }}>
                  <div className="cad-corner-marker tl" />
                  <div className="cad-corner-marker tr" />
                  <div className="cad-corner-marker bl" />
                  <div className="cad-corner-marker br" />
                  <div className="info-icon" style={{ color: 'var(--blueprint-blue, #155EEF)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--blueprint-blue, #155EEF)' }}>
                      COMMUNICATION_LINK // EMAIL
                    </h4>
                    <p style={{ margin: 0, fontWeight: 600 }}>hello@engineeringindia.org</p>
                  </div>
                </TiltCard>

                <TiltCard className="info-card blueprint-sheet-card cad-frame-wrap" style={{ borderRadius: '6px' }}>
                  <div className="cad-corner-marker tl" />
                  <div className="cad-corner-marker tr" />
                  <div className="cad-corner-marker bl" />
                  <div className="cad-corner-marker br" />
                  <div className="info-icon" style={{ color: 'var(--blueprint-blue, #155EEF)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--blueprint-blue, #155EEF)' }}>
                      DIRECT_LINE // TELEPHONE
                    </h4>
                    <p style={{ margin: 0, fontWeight: 600 }}>+91 98765 43210</p>
                  </div>
                </TiltCard>

                <TiltCard className="info-card blueprint-sheet-card cad-frame-wrap" style={{ borderRadius: '6px' }}>
                  <div className="cad-corner-marker tl" />
                  <div className="cad-corner-marker tr" />
                  <div className="cad-corner-marker bl" />
                  <div className="cad-corner-marker br" />
                  <div className="info-icon" style={{ color: 'var(--blueprint-blue, #155EEF)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--blueprint-blue, #155EEF)' }}>
                      CAMPUS_HQ // LOCATION
                    </h4>
                    <p style={{ margin: 0, fontWeight: 600 }}>SVPCET Campus, Nagpur, India (21.1458° N, 79.0882° E)</p>
                  </div>
                </TiltCard>

                {/* Social Links */}
                <div className="contact-social">
                  <h4>Follow Our Journey</h4>
                  <div className="social-row">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link">
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
