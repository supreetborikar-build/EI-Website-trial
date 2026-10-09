import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Avatar from './Avatar';
import {
  OFFICIAL_COMMITTEE_DOMAINS,
  OFFICIAL_ALL_MEMBERS,
  normalizeLinkedInUrl,
  normalizeGitHubUrl
} from '../data/committeeData';

// Utility helper for initials fallback avatar
const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

/**
 * Cinematic Domain Dossier & Members Rise-Up Modal
 * Displays the Domain Head, Co-Head, and all Core Members with full dossiers:
 * Name, Role, Year, Branch, UID, Tagline, LinkedIn, and GitHub links.
 */
export default function LeaderModal({ domain, isOpen, onClose }) {
  // ESC key listener
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

  // Resolve domain identifiers and metadata
  const domainId = domain.id || domain.domain_id || '';
  const rawDomainName = domain.domainName || domain.domain_name || domain.domain || domain.name || 'Domain';
  
  // Match with official centralized dataset if available
  const matchedOfficialDomain = OFFICIAL_COMMITTEE_DOMAINS.find(
    (d) =>
      (domainId && d.id === domainId) ||
      d.domainName.toLowerCase() === rawDomainName.toLowerCase() ||
      d.shortName?.toLowerCase() === rawDomainName.toLowerCase()
  );

  const domainName = matchedOfficialDomain?.domainName || rawDomainName;
  const shortName = matchedOfficialDomain?.shortName || domain.shortName || domainName;
  const description = matchedOfficialDomain?.description || domain.description || `Meet the complete team driving ${domainName} operations and execution.`;
  const badgeColor = matchedOfficialDomain?.badgeColor || domain.badgeColor || domain.badge_color || '#2563EB';
  const icon = matchedOfficialDomain?.icon || domain.icon || 'fa-users';

  // Resolve all domain members reliably
  let domainMembers = [];
  if (Array.isArray(domain.members) && domain.members.length > 0) {
    domainMembers = domain.members;
  } else if (matchedOfficialDomain && Array.isArray(matchedOfficialDomain.members) && matchedOfficialDomain.members.length > 0) {
    domainMembers = matchedOfficialDomain.members;
  } else if (Array.isArray(domain.teammates) && domain.teammates.length > 0) {
    const leaderObj = domain.leader ? [domain.leader] : [];
    domainMembers = [...leaderObj, ...domain.teammates];
  } else {
    domainMembers = OFFICIAL_ALL_MEMBERS.filter(
      (m) =>
        (domainId && m.domainId === domainId) ||
        m.domainName?.toLowerCase() === domainName.toLowerCase()
    );
  }

  // Identify Domain Head
  const head =
    domain.head ||
    domainMembers.find((m) => m.isHead) ||
    (domain.leader ? { ...domain.leader, isHead: true } : null) ||
    domainMembers[0] ||
    {};

  // Identify remaining members (excluding head to prevent duplicate card)
  const remainingMembers = domainMembers.filter((m) => {
    if (head.id && m.id && m.id === head.id) return false;
    if (head.uid && m.uid && m.uid === head.uid && m.name === head.name) return false;
    return m.name?.trim().toLowerCase() !== head.name?.trim().toLowerCase();
  });

  const totalMemberCount = domainMembers.length;
  const headImg = head.photo || head.avatar || head.image;
  const headLinkedin = normalizeLinkedInUrl(head.linkedin);
  const headGithub = normalizeGitHubUrl(head.github);

  const modalElement = (
    <div
      className="modal-overlay active open dossier-stage-overlay"
      id="leaderModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderModalTitle"
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
        padding: '20px 16px',
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
          background: 'var(--bg-surface, #ffffff)',
          color: 'var(--text-primary, #0F172A)',
          borderRadius: '24px',
          maxWidth: '1080px',
          width: '94vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.55), 0 0 30px rgba(37, 99, 235, 0.15)',
          border: '1px solid var(--border-color, rgba(21, 94, 239, 0.35))',
          padding: '0',
          position: 'relative',
          zIndex: 1000000,
          opacity: 1,
          overflow: 'hidden'
        }}
      >
        {/* CAD Architectural Corners */}
        <span className="cad-corner-marker tl"></span>
        <span className="cad-corner-marker tr"></span>
        <span className="cad-corner-marker bl"></span>
        <span className="cad-corner-marker br"></span>

        {/* =================================================================
            STICKY MODAL HEADER
            ================================================================= */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            background: 'var(--bg-card, #ffffff)',
            borderBottom: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
            padding: '18px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backdropFilter: 'blur(10px)',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: `${badgeColor}15`,
                color: badgeColor,
                border: `1px solid ${badgeColor}35`,
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <i className={`fa-solid ${icon}`}></i> {domainName} DOMAIN
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Space Grotesk, monospace',
                fontSize: '0.78rem',
                color: 'var(--text-secondary, #475569)',
                background: 'var(--bg-input, #F1F5F9)',
                padding: '4px 12px',
                borderRadius: '16px',
                fontWeight: 700,
                border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))'
              }}
            >
              <i className="fa-solid fa-users" style={{ color: badgeColor }}></i>
              {totalMemberCount} TEAM MEMBERS
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Dossier (Escape)"
            title="Close Dossier (Escape)"
            id="closeLeaderModalBtn"
            style={{
              background: 'var(--bg-input, #F1F5F9)',
              border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              color: 'var(--text-secondary, #475569)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              marginLeft: 'auto'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* =================================================================
            SCROLLABLE MODAL BODY
            ================================================================= */}
        <div
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
          tabIndex={0}
        >
          {/* Domain Title & Subtitle */}
          <div>
            <h2
              id="leaderModalTitle"
              style={{
                margin: '0 0 6px',
                fontSize: '1.65rem',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                color: 'var(--text-primary, #0F172A)'
              }}
            >
              {domainName} <span style={{ color: badgeColor }}>Team</span>
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '0.92rem',
                color: 'var(--text-secondary, #475569)',
                lineHeight: 1.55,
                maxWidth: '780px'
              }}
            >
              {description}
            </p>
          </div>

          {/* 1. DOMAIN HEAD SPOTLIGHT BANNER */}
          {head && head.name && (
            <div
              className="leader-spotlight-box"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(37, 99, 235, 0.05) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '20px',
                padding: '22px 24px',
                display: 'flex',
                gap: '22px',
                alignItems: 'center',
                flexWrap: 'wrap',
                position: 'relative',
                boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.12)'
              }}
            >
              {/* Head Avatar */}
              <div style={{ position: 'relative', width: '88px', height: '88px', flexShrink: 0 }}>
                {headImg ? (
                  <img
                    src={headImg}
                    alt={head.name}
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #f59e0b',
                      boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25)',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fb = e.currentTarget.parentElement.querySelector('.head-modal-fb');
                      if (fb) fb.style.display = 'flex';
                    }}
                  />
                ) : null}

                <div
                  className="head-modal-fb"
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(15, 23, 42, 0.1))',
                    border: '3px solid #f59e0b',
                    display: headImg ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#f59e0b'
                  }}
                  aria-hidden="true"
                >
                  {getInitials(head.name)}
                </div>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 5
                  }}
                >
                  <i className="fa-solid fa-crown" style={{ fontSize: '0.6rem' }}></i> HEAD
                </span>
              </div>

              {/* Head Details */}
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3
                      style={{
                        margin: '0 0 4px',
                        fontSize: '1.45rem',
                        fontWeight: 800,
                        fontFamily: 'Outfit, sans-serif',
                        color: 'var(--text-primary, #0F172A)'
                      }}
                    >
                      {head.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#d97706',
                          background: 'rgba(245, 158, 11, 0.12)',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}
                      >
                        {head.role || `${shortName} Head`}
                      </span>

                      {head.year && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>
                          <i className="fa-solid fa-graduation-cap" style={{ marginRight: '4px', opacity: 0.7 }}></i>
                          {head.year} Year
                        </span>
                      )}

                      {head.year && head.branch && <span style={{ opacity: 0.4 }}>•</span>}

                      {head.branch && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary, #2563EB)', fontWeight: 700 }}>
                          <i className="fa-solid fa-code-branch" style={{ marginRight: '4px', opacity: 0.7 }}></i>
                          {head.branch}
                        </span>
                      )}

                      {head.uid && (
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontFamily: 'Space Grotesk, monospace',
                            color: 'var(--text-muted, #64748B)',
                            background: 'var(--bg-surface, #ffffff)',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))'
                          }}
                        >
                          <i className="fa-solid fa-id-card" style={{ marginRight: '4px' }}></i>
                          UID: {head.uid}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Head Social Links */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                    {headGithub && (
                      <a
                        href={headGithub}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`GitHub profile of ${head.name}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: '#181717',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <i className="fa-brands fa-github"></i> GitHub
                      </a>
                    )}
                    {headLinkedin && (
                      <a
                        href={headLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn profile of ${head.name}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: '#0A66C2',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(10, 102, 194, 0.25)'
                        }}
                      >
                        <i className="fa-brands fa-linkedin-in"></i> LinkedIn
                      </a>
                    )}
                  </div>
                </div>

                {head.tagline && (
                  <p
                    style={{
                      margin: '6px 0 0',
                      fontSize: '0.88rem',
                      fontStyle: 'italic',
                      color: 'var(--text-secondary, #334155)',
                      lineHeight: 1.5,
                      borderLeft: '3px solid rgba(245, 158, 11, 0.5)',
                      paddingLeft: '10px'
                    }}
                  >
                    "{head.tagline}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 2. CORE TEAM MEMBERS SECTION */}
          {remainingMembers.length > 0 ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span
                  style={{
                    fontFamily: 'Space Grotesk, monospace',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: badgeColor
                  }}
                >
                  TEAM ROSTER ({remainingMembers.length})
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(226, 232, 240, 0.8))' }} />
              </div>

              {/* Members Grid (All remaining members visible with full metadata) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '16px'
                }}
              >
                {remainingMembers.map((member, idx) => {
                  const mImg = member.photo || member.avatar || member.image;
                  const mLinkedin = normalizeLinkedInUrl(member.linkedin);
                  const mGithub = normalizeGitHubUrl(member.github);
                  const isCoHead = member.isCoHead || /co-head|co-coordinator/i.test(member.role || '');

                  return (
                    <div
                      key={member.id || `${domainId}-${member.uid || idx}-${member.name}`}
                      className="member-dossier-card"
                      style={{
                        background: 'var(--bg-card, #ffffff)',
                        border: isCoHead
                          ? '1.5px solid rgba(59, 130, 246, 0.4)'
                          : '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isCoHead
                          ? '0 6px 18px rgba(59, 130, 246, 0.12)'
                          : '0 4px 14px rgba(0, 0, 0, 0.04)',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
                      }}
                    >
                      <div>
                        {/* Member Top: Avatar + Name + Badges */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ position: 'relative', width: '54px', height: '54px', flexShrink: 0 }}>
                            {mImg ? (
                              <img
                                src={mImg}
                                alt={member.name}
                                style={{
                                  width: '54px',
                                  height: '54px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: isCoHead ? '2.5px solid #3b82f6' : '2px solid rgba(37, 99, 235, 0.25)',
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                                  display: 'block'
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fb = e.currentTarget.parentElement.querySelector('.member-modal-fb');
                                  if (fb) fb.style.display = 'flex';
                                }}
                              />
                            ) : null}

                            <div
                              className="member-modal-fb"
                              style={{
                                width: '54px',
                                height: '54px',
                                borderRadius: '50%',
                                background: isCoHead
                                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(15, 23, 42, 0.1))'
                                  : 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(15, 23, 42, 0.06))',
                                border: isCoHead ? '2px solid #3b82f6' : '2px solid rgba(37, 99, 235, 0.2)',
                                display: mImg ? 'none' : 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: '1rem',
                                fontWeight: 800,
                                color: isCoHead ? '#3b82f6' : 'var(--primary, #2563EB)'
                              }}
                              aria-hidden="true"
                            >
                              {getInitials(member.name)}
                            </div>

                            {isCoHead && (
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: '-4px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                  color: '#ffffff',
                                  fontSize: '0.58rem',
                                  fontWeight: 800,
                                  padding: '1px 5px',
                                  borderRadius: '8px',
                                  textTransform: 'uppercase',
                                  whiteSpace: 'nowrap',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                                }}
                              >
                                CO-HEAD
                              </span>
                            )}
                          </div>

                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <h4
                              style={{
                                margin: '0 0 2px',
                                fontSize: '0.98rem',
                                fontWeight: 700,
                                color: 'var(--text-primary, #0F172A)',
                                lineHeight: 1.25
                              }}
                            >
                              {member.name}
                            </h4>
                            <span
                              style={{
                                display: 'inline-block',
                                margin: 0,
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                color: isCoHead ? '#2563EB' : 'var(--text-secondary, #64748B)',
                                background: isCoHead ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                                padding: isCoHead ? '1px 6px' : '0',
                                borderRadius: '4px'
                              }}
                            >
                              {member.role || domainName}
                            </span>
                          </div>
                        </div>

                        {/* Academic metadata: Year, Branch, UID */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary, #475569)', flexWrap: 'wrap' }}>
                            {member.year && (
                              <span style={{ fontWeight: 600 }}>{member.year} Year</span>
                            )}
                            {member.year && member.branch && <span style={{ opacity: 0.4 }}>•</span>}
                            {member.branch && (
                              <span style={{ color: 'var(--primary, #2563EB)', fontWeight: 600 }}>{member.branch}</span>
                            )}
                          </div>

                          {member.uid && (
                            <div
                              style={{
                                fontFamily: 'Space Grotesk, monospace',
                                fontSize: '0.7rem',
                                color: 'var(--text-muted, #94A3B8)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <i className="fa-solid fa-id-card" style={{ fontSize: '0.65rem' }}></i>
                              UID: {member.uid}
                            </div>
                          )}
                        </div>

                        {/* Personal Tagline */}
                        {member.tagline && (
                          <p
                            style={{
                              margin: '0 0 8px',
                              fontSize: '0.78rem',
                              fontStyle: 'italic',
                              lineHeight: 1.45,
                              color: 'var(--text-secondary, #475569)',
                              borderLeft: '2px solid rgba(37, 99, 235, 0.3)',
                              paddingLeft: '6px'
                            }}
                          >
                            "{member.tagline}"
                          </p>
                        )}
                      </div>

                      {/* Member Footer: Social Connection Buttons */}
                      <div
                        style={{
                          paddingTop: '8px',
                          borderTop: '1px solid var(--border-color, rgba(226, 232, 240, 0.6))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: (mLinkedin || mGithub) ? 'flex-end' : 'flex-start',
                          gap: '6px',
                          flexWrap: 'wrap'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {mGithub && (
                          <a
                            href={mGithub}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`GitHub profile of ${member.name}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: 'var(--bg-surface, #F8FAFC)',
                              border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
                              color: 'var(--text-primary, #0F172A)',
                              textDecoration: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <i className="fa-brands fa-github"></i> GitHub
                          </a>
                        )}
                        {mLinkedin && (
                          <a
                            href={mLinkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`LinkedIn profile of ${member.name}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: 'rgba(10, 102, 194, 0.1)',
                              border: '1px solid rgba(10, 102, 194, 0.25)',
                              color: '#0A66C2',
                              textDecoration: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <i className="fa-brands fa-linkedin-in"></i> LinkedIn
                          </a>
                        )}
                        {!mLinkedin && !mGithub && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94A3B8)' }}>
                            EI Official Core
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted, #94A3B8)', fontStyle: 'italic', padding: '12px 0' }}>
              No additional team members in this domain roster.
            </p>
          )}
        </div>

        {/* =================================================================
            MODAL FOOTER BAR
            ================================================================= */}
        <div
          style={{
            padding: '14px 28px',
            borderTop: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
            background: 'var(--bg-card, #ffffff)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted, #64748B)' }}>
            <i className={`fa-solid ${icon}`} style={{ color: badgeColor }}></i>
            <span>Engineering India – SVPCET // {domainName} Domain ({totalMemberCount} Members)</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            id="footerCloseLeaderModalBtn"
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'var(--bg-input, #F1F5F9)',
              border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
              color: 'var(--text-primary, #0F172A)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fa-solid fa-xmark"></i> Close
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}
