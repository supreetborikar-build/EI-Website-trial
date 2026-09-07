import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Avatar from './Avatar';

/**
 * Cinematic Domain Dossier & Members Rise-Up Modal
 * Displays the Domain Leader and all Core Members with full dossiers:
 * Name, Role, Bio, Skills chips, and LinkedIn connections.
 */
export default function LeaderModal({ domain, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !domain) return null;

  const leader = domain.leader || {};
  const teammates = Array.isArray(domain.teammates) ? domain.teammates : [];
  const domainName = domain.domain || domain.domain_name || domain.name || 'Domain';
  const badgeColor = domain.badgeColor || domain.badge_color || '#2563EB';
  const icon = domain.icon || 'fa-code';

  const modalElement = (
    <div
      className="modal-overlay active open dossier-stage-overlay"
      id="leaderModal"
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget || e.target.id === 'leaderModal') onClose();
      }}
    >
      <div
        className="modal-card dossier-stage-card cad-frame-wrap"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--paper-card, #ffffff)',
          color: 'var(--text-primary, #0F172A)',
          borderRadius: '16px',
          maxWidth: '960px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.55)',
          border: '1px solid var(--cad-border, rgba(21, 94, 239, 0.35))',
          padding: '0',
          position: 'relative',
          zIndex: 1000000,
          opacity: 1,
          pointerEvents: 'auto'
        }}
      >
        <span className="cad-corner-marker tl"></span>
        <span className="cad-corner-marker tr"></span>
        <span className="cad-corner-marker bl"></span>
        <span className="cad-corner-marker br"></span>

        {/* Sticky Header Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            background: 'var(--bg-surface, #ffffff)',
            borderBottom: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: badgeColor || '#2563EB',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <i className={`fa-solid ${icon}`}></i> {domainName} DOMAIN
            </span>

            <span
              style={{
                fontFamily: 'Space Grotesk, monospace',
                fontSize: '0.75rem',
                color: 'var(--text-muted, #64748B)',
                fontWeight: 600
              }}
            >
              1 LEADER + {teammates.length} CORE SPECIALISTS
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Dossier"
            style={{
              background: 'var(--bg-input, #F1F5F9)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              color: 'var(--text-secondary, #475569)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Inner Content */}
        <div style={{ padding: '28px' }}>
          {/* LEADER SPOTLIGHT BANNER */}
          <div
            className="leader-spotlight-box"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '32px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Avatar
                src={leader.avatar}
                alt={leader.name}
                size={84}
                style={{
                  border: '3px solid #f59e0b',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                }}
              >
                <i className="fa-solid fa-crown"></i> Leader
              </span>
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2
                    style={{
                      margin: '0 0 4px',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--text-primary, #0F172A)'
                    }}
                  >
                    {leader.name}
                  </h2>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: 'var(--primary, #2563EB)'
                    }}
                  >
                    {leader.title}
                  </p>
                </div>

                {leader.linkedin && (
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#0A66C2',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(10, 102, 194, 0.25)'
                    }}
                  >
                    <i className="fa-brands fa-linkedin"></i> Connect on LinkedIn
                  </a>
                )}
              </div>

              <p
                style={{
                  margin: '8px 0 14px',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary, #334155)'
                }}
              >
                {leader.bio}
              </p>

              {leader.skills && leader.skills.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {leader.skills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(37, 99, 235, 0.08)',
                        color: 'var(--primary, #2563EB)',
                        border: '1px solid rgba(37, 99, 235, 0.18)'
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CORE TEAM MEMBERS SECTION */}
          {teammates && teammates.length > 0 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--primary, #2563EB)'
                    }}
                  >
                    02 // DOMAIN ROSTER
                  </span>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-primary, #0F172A)'
                  }}
                >
                  Core Members &amp; Specialists ({teammates.length})
                </h3>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.84rem',
                    color: 'var(--text-muted, #64748B)'
                  }}
                >
                  Engineers, organizers, and creators driving projects across this domain
                </p>
              </div>

              {/* Members Grid (Each member card rises up with staggered animation) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                  gap: '16px'
                }}
              >
                {teammates.map((member, idx) => (
                  <div
                    key={idx}
                    className="member-dossier-card"
                    style={{
                      background: 'var(--bg-card, #ffffff)',
                      border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                      animation: 'memberCardRise 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards',
                      animationDelay: `${idx * 0.05}s`,
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
                    }}
                  >
                    <div>
                      {/* Member Header: Avatar + Name + Role */}
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
                        <Avatar
                          src={member.avatar}
                          alt={member.name}
                          size={52}
                          style={{
                            border: '2px solid rgba(37, 99, 235, 0.3)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }}
                        />
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <h4
                            style={{
                              margin: '0 0 2px',
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: 'var(--text-primary, #0F172A)'
                            }}
                          >
                            {member.name}
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: 'var(--primary, #2563EB)'
                            }}
                          >
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '0.84rem',
                          lineHeight: 1.55,
                          color: 'var(--text-secondary, #475569)'
                        }}
                      >
                        {member.bio}
                      </p>

                      {/* Skills Chips */}
                      {member.skills && member.skills.length > 0 && (
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          {member.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: 'rgba(37, 99, 235, 0.06)',
                                color: 'var(--primary, #2563EB)',
                                border: '1px solid rgba(37, 99, 235, 0.12)'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Member Footer: LinkedIn Connection Link */}
                    <div
                      style={{
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color, rgba(226, 232, 240, 0.6))',
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#0A66C2',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            transition: 'color 0.2s ease'
                          }}
                        >
                          <span>Connect on LinkedIn</span>
                          <i className="fa-brands fa-linkedin"></i>
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94A3B8)' }}>
                          EI Verified Core
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}

