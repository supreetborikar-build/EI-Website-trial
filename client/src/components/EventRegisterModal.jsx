import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useToast } from './Toast';

export default function EventRegisterModal({ event, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: 'St. Vincent Pallotti College of Eng. & Tech.',
    yearBranch: '3rd Year - Computer Engineering'
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.registerForEvent(event.id, formData);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setRegistered(true);
      addToast(res.message || 'Registration confirmed!', 'success');
      if (onSuccess) onSuccess(event.id);

      setTimeout(() => {
        setRegistered(false);
        onClose();
      }, 2500);
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const modalElement = (
    <div
      className="modal-overlay active open"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-card cad-frame-wrap"
        data-lenis-prevent
        style={{
          background: 'var(--paper-card, #ffffff)',
          color: 'var(--text-color, #1e293b)',
          borderRadius: '16px',
          maxWidth: '540px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          border: '1px solid var(--cad-border, rgba(21, 94, 239, 0.35))',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <span className="cad-corner-marker tl"></span>
        <span className="cad-corner-marker tr"></span>
        <span className="cad-corner-marker bl"></span>
        <span className="cad-corner-marker br"></span>

        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'inherit',
            zIndex: 10
          }}
        >
          &times;
        </button>

        {registered ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '10px', color: '#10B981' }}>
              Registration Confirmed!
            </h2>
            <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
              You're all set for <strong>{event.title}</strong>.<br />
              Confirmation has been logged in our club database. See you there!
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--cad-border-subtle, rgba(21, 94, 239, 0.15))', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(21, 94, 239, 0.1)',
                    color: 'var(--blueprint-blue, #155EEF)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontFamily: 'Space Grotesk, monospace',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}
                >
                  SPEC_REG // {event.badge || event.category || 'EVENT'}
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.68rem',
                    opacity: 0.6,
                    letterSpacing: '0.05em'
                  }}
                >
                  DWG_ID: EI-EVT-{event.id || '01'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '4px 0 8px 0', color: 'var(--heading, #111315)' }}>
                Register for {event.title}
              </h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                🗓 {event.date} • 📍 {event.location}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  className="cad-input-box"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@svpcet.edu.in"
                    className="cad-input-box"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="cad-input-box"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  College / Institution
                </label>
                <input
                  type="text"
                  placeholder="College Name"
                  className="cad-input-box"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Year &amp; Branch / Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2nd Year Mechanical / CSE"
                  className="cad-input-box"
                  value={formData.yearBranch}
                  onChange={(e) => setFormData({ ...formData, yearBranch: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: 'none',
                    border: '1px solid rgba(150,150,150,0.4)',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    opacity: loading ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? 'Submitting...' : 'Confirm Registration ✓'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}

