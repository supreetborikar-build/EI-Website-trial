import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { OFFICIAL_COMMITTEE_DOMAINS, OFFICIAL_ALL_MEMBERS } from '../data/committeeData';
import TiltCard from '../components/TiltCard';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/committee-page.css';

// Utility helper for initials fallback avatar
const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

// Utility helper for external social URLs
const normalizeUrl = (url = '') => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

// Helper to reliably get all members for a selected domain
export const getMembersByDomain = (selectedDomain, allDomains = [], allMembersList = []) => {
  if (!selectedDomain) return [];
  const foundDomain = allDomains.find(
    (d) => d.id === selectedDomain.id || d.domainName?.toLowerCase() === selectedDomain.domainName?.toLowerCase()
  );
  if (foundDomain && foundDomain.members && foundDomain.members.length > 0) {
    return foundDomain.members;
  }
  return allMembersList.filter(
    (m) =>
      m.domainId === selectedDomain.id ||
      m.domainName?.toLowerCase() === selectedDomain.domainName?.toLowerCase()
  );
};

/* ==========================================================================
   1. MEMBER CARD COMPONENT (Used inside MemberGrid)
   ========================================================================== */
export function MemberCard({
  photo,
  avatar,
  name,
  role,
  uid,
  year,
  branch,
  tagline,
  github,
  linkedin,
  isHead,
  isCoHead
}) {
  const imgSrc = photo || avatar;
  const linkedinUrl = normalizeUrl(linkedin);
  const githubUrl = normalizeUrl(github);

  return (
    <article className={`modal-member-card ${isCoHead ? 'is-cohead' : ''} ${isHead ? 'is-head' : ''}`}>
      {/* MEMBER PHOTO */}
      <div className="member-card-avatar-wrap">
        <div
          className="member-avatar-glow-ring"
          style={{
            background: isCoHead
              ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
              : isHead
              ? 'linear-gradient(135deg, #f59e0b, #e11d48)'
              : 'linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(56, 189, 248, 0.35))'
          }}
        ></div>

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="member-avatar-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement.querySelector('.member-avatar-fallback-initials');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className="member-avatar-fallback-initials"
          style={{
            display: imgSrc ? 'none' : 'flex',
            color: isCoHead ? '#3b82f6' : isHead ? '#f59e0b' : 'var(--primary, #2563EB)'
          }}
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>

        {isCoHead && (
          <span className="member-status-pill cohead">
            Co-Head
          </span>
        )}
      </div>

      {/* MEMBER INFO */}
      <div className="modal-member-info">
        <h4 className="modal-member-name">{name}</h4>

        <div className={`modal-member-role-tag ${isCoHead ? 'cohead-role' : isHead ? 'head-role' : ''}`}>
          {role}
        </div>

        <div className="modal-member-academic">
          {year && <span className="academic-tag">{year} Year</span>}
          {year && branch && <span className="academic-dot">•</span>}
          {branch && <span className="academic-tag branch">{branch}</span>}
        </div>

        {uid && (
          <div className="modal-member-uid">
            <i className="fa-solid fa-id-card"></i> UID: {uid}
          </div>
        )}

        {tagline && (
          <p className="modal-member-tagline">
            "{tagline}"
          </p>
        )}

        {/* SOCIAL BUTTONS (Rendered ONLY if individual URL is provided) */}
        {(githubUrl || linkedinUrl) && (
          <div className="modal-member-socials" onClick={(e) => e.stopPropagation()}>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-social-btn github"
                aria-label={`GitHub profile of ${name}`}
              >
                <i className="fa-brands fa-github"></i>
                <span>GitHub</span>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-social-btn linkedin"
                aria-label={`LinkedIn profile of ${name}`}
              >
                <i className="fa-brands fa-linkedin-in"></i>
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ==========================================================================
   2. MEMBER GRID COMPONENT (Renders remaining team members in modal)
   ========================================================================== */
export function MemberGrid({ members = [] }) {
  if (!members || members.length === 0) {
    return (
      <p className="no-additional-members-text">
        No additional team members in this domain.
      </p>
    );
  }

  return (
    <div className="modal-members-grid">
      {members.map((member, idx) => (
        <MemberCard
          key={member.id || member.uid || member.name || idx}
          photo={member.photo || member.avatar}
          avatar={member.avatar || member.photo}
          name={member.name}
          role={member.role}
          uid={member.uid}
          year={member.year}
          branch={member.branch}
          tagline={member.tagline}
          github={member.github}
          linkedin={member.linkedin}
          isHead={member.isHead}
          isCoHead={member.isCoHead}
        />
      ))}
    </div>
  );
}

/* ==========================================================================
   3. DOMAIN HEAD SPOTLIGHT COMPONENT (Prominently featured inside modal)
   ========================================================================== */
export function DomainHead({ head = {}, domainName = '', badgeColor = '#2563EB', icon = 'fa-user-tie' }) {
  const imgSrc = head.photo || head.avatar;
  const linkedinUrl = normalizeUrl(head.linkedin);
  const githubUrl = normalizeUrl(head.github);

  return (
    <section className="modal-head-spotlight-section">
      <div className="section-divider-label">
        <span>★ DOMAIN HEAD</span>
      </div>

      <div className="modal-head-spotlight-card">
        <div className="spotlight-avatar-wrap">
          <div
            className="spotlight-avatar-ring"
            style={{
              background: `linear-gradient(135deg, ${badgeColor}, #f59e0b, #e11d48)`
            }}
          ></div>

          {imgSrc ? (
            <img
              src={imgSrc}
              alt={head.name}
              className="spotlight-avatar-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement.querySelector('.spotlight-avatar-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}

          <div
            className="spotlight-avatar-fallback"
            style={{
              display: imgSrc ? 'none' : 'flex',
              color: badgeColor
            }}
            aria-hidden="true"
          >
            {getInitials(head.name)}
          </div>

          <span className="spotlight-badge-crown">
            <i className="fa-solid fa-crown"></i> HEAD
          </span>
        </div>

        <div className="spotlight-details">
          <div className="spotlight-role-pill">
            {head.role || 'Domain Head'}
          </div>

          <h3 className="spotlight-name">{head.name}</h3>

          <div className="spotlight-meta-row">
            {head.year && (
              <span className="spotlight-academic-badge">
                <i className="fa-solid fa-graduation-cap"></i> {head.year} Year
              </span>
            )}
            {head.branch && (
              <span className="spotlight-academic-badge branch">
                <i className="fa-solid fa-code-branch"></i> {head.branch}
              </span>
            )}
            {head.uid && (
              <span className="spotlight-uid-badge">
                <i className="fa-solid fa-id-card"></i> UID: {head.uid}
              </span>
            )}
          </div>

          {head.tagline && (
            <p className="spotlight-tagline">
              "{head.tagline}"
            </p>
          )}

          <div className="spotlight-domain-tag">
            <i className={`fa-solid ${icon}`}></i>
            Leading {domainName}
          </div>

          {(linkedinUrl || githubUrl) && (
            <div className="spotlight-socials-row" onClick={(e) => e.stopPropagation()}>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotlight-social-btn github"
                  aria-label={`GitHub profile of ${head.name}`}
                >
                  <i className="fa-brands fa-github"></i>
                  <span>GitHub</span>
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotlight-social-btn linkedin"
                  aria-label={`LinkedIn profile of ${head.name}`}
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   4. DOMAIN TEAM MODAL COMPONENT (Reusable single modal for any selected domain)
   ========================================================================== */
export function DomainTeamModal({
  selectedDomain,
  domains = [],
  allMembers = [],
  isClosingModal = false,
  closeModal,
  modalContentRef,
  closeBtnRef
}) {
  if (!selectedDomain) return null;

  // Resolve current active domain object and all its members
  const currentDomain = domains.find((d) => d.id === selectedDomain.id) || selectedDomain;
  const domainMembers = getMembersByDomain(currentDomain, domains, allMembers);

  // Identify the domain head
  const head = currentDomain.head || domainMembers.find((m) => m.isHead) || domainMembers[0] || {};

  // Filter out head from the remaining members grid to avoid duplication
  const remainingMembers = domainMembers.filter((m) => {
    if (m.uid && head.uid) return m.uid !== head.uid;
    if (m.id && head.id) return m.id !== head.id;
    return m.name?.trim().toLowerCase() !== head.name?.trim().toLowerCase();
  });

  return (
    <div
      className={`domain-modal-overlay ${isClosingModal ? 'is-closing' : 'is-open'}`}
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-domain-title"
    >
      <div
        className="domain-modal-container blueprint-sheet-card cad-frame-wrap"
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CAD CORNERS */}
        <div className="cad-corner-marker tl" />
        <div className="cad-corner-marker tr" />
        <div className="cad-corner-marker bl" />
        <div className="cad-corner-marker br" />

        {/* TOP CLOSE BUTTON */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeModal}
          ref={closeBtnRef}
          aria-label="Close modal (Escape)"
          title="Close modal (Escape)"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* ==========================================================
            MODAL FIXED HEADER
        =========================================================== */}
        <header className="modal-header-hero">
          <div className="modal-header-badge-row">
            <span
              className="modal-domain-badge"
              style={{
                color: currentDomain.badgeColor || '#2563EB',
                backgroundColor: `${currentDomain.badgeColor || '#2563EB'}15`,
                borderColor: `${currentDomain.badgeColor || '#2563EB'}40`
              }}
            >
              <i className={`fa-solid ${currentDomain.icon || 'fa-users'}`}></i>
              {currentDomain.domainName.toUpperCase()}
            </span>

            <span className="modal-members-count-pill">
              <i className="fa-solid fa-users"></i>
              {domainMembers.length} TEAM MEMBERS
            </span>
          </div>

          <h2 id="modal-domain-title" className="modal-domain-heading">
            {currentDomain.domainName} <span className="highlight-gradient">Team</span>
          </h2>

          <p className="modal-domain-subtext">
            {currentDomain.description ||
              `Meet the team driving ${currentDomain.domainName} operations, vision, and campus execution.`}
          </p>
        </header>

        {/* ==========================================================
            MODAL SCROLLABLE CONTENT BODY
        =========================================================== */}
        <div className="modal-scroll-body">
          {/* 1. DOMAIN HEAD SPOTLIGHT AT TOP */}
          <DomainHead
            head={head}
            domainName={currentDomain.domainName}
            badgeColor={currentDomain.badgeColor || '#2563EB'}
            icon={currentDomain.icon || 'fa-user-tie'}
          />

          {/* 2. REMAINING TEAM MEMBERS SECTION */}
          <section className="modal-team-members-section">
            <div className="section-divider-label">
              <span>
                {currentDomain.shortName || currentDomain.domainName} TEAM MEMBERS ({remainingMembers.length})
              </span>
            </div>

            <MemberGrid members={remainingMembers} />
          </section>
        </div>

        {/* ==========================================================
            MODAL FOOTER ACTION
        =========================================================== */}
        <footer className="modal-footer-bar">
          <div className="modal-footer-domain-info">
            <i className={`fa-solid ${currentDomain.icon || 'fa-users'}`}></i>
            <span>Engineering India – SVPCET // {currentDomain.domainName}</span>
          </div>

          <button
            type="button"
            className="modal-footer-close-btn"
            onClick={closeModal}
          >
            <i className="fa-solid fa-xmark"></i>
            <span>Close</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. DOMAIN HEAD CARD COMPONENT (Main Page Card)
   ========================================================================== */
export function DomainHeadCard({
  domain,
  index,
  onSelect
}) {
  const head = domain.head || {};
  const isTechnical = domain.id === 'technical';
  const memberCount = domain.memberCount || domain.members?.length || 0;
  const imgSrc = head.photo || head.avatar;

  return (
    <TiltCard
      as="article"
      className={`domain-head-card-premium blueprint-sheet-card cad-frame-wrap ${isTechnical ? 'is-technical-head-card' : ''}`}
      onClick={() => onSelect(domain)}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`${domain.domainName} - Head: ${head.name}. Click to view full team.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(domain);
        }
      }}
    >
      {/* CAD CORNERS */}
      <div className="cad-corner-marker tl" />
      <div className="cad-corner-marker tr" />
      <div className="cad-corner-marker bl" />
      <div className="cad-corner-marker br" />

      {/* CARD TOP BADGE */}
      <div className="head-card-top-tag">
        <span className="head-card-index">DOMAIN 0{index + 1}</span>
        <span
          className="head-domain-pill"
          style={{
            color: domain.badgeColor || '#2563EB',
            backgroundColor: `${domain.badgeColor || '#2563EB'}15`,
            borderColor: `${domain.badgeColor || '#2563EB'}35`
          }}
        >
          <i className={`fa-solid ${domain.icon || 'fa-user-tie'}`}></i>
          {domain.domainName}
        </span>
      </div>

      {/* HEAD PHOTO */}
      <div className="head-avatar-wrapper">
        <div
          className="head-avatar-ring"
          style={{
            background: `linear-gradient(135deg, ${domain.badgeColor || '#2563EB'}, #38bdf8, #f59e0b)`
          }}
        ></div>

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={head.name}
            className="head-avatar-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement.querySelector('.head-avatar-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className="head-avatar-fallback"
          style={{
            display: imgSrc ? 'none' : 'flex',
            color: domain.badgeColor || '#2563EB'
          }}
          aria-hidden="true"
        >
          {getInitials(head.name)}
        </div>

        <span className="head-crown-badge">
          <i className="fa-solid fa-crown"></i> Head
        </span>
      </div>

      {/* HEAD INFORMATION */}
      <div className="head-info-block">
        <h3 className="head-member-name">{head.name}</h3>
        <div className="head-member-role">{head.role}</div>

        <div className="head-academic-pill">
          {head.year && <span>{head.year} Year</span>}
          {head.year && head.branch && <span className="dot-sep">•</span>}
          {head.branch && <span>{head.branch}</span>}
        </div>

        {head.uid && (
          <div className="head-uid-text">
            <i className="fa-solid fa-id-card"></i> UID: {head.uid}
          </div>
        )}
      </div>

      {/* TEAM MEMBERS PREVIEW INSIDE HEAD CARD */}
      <div className="head-teammates-preview">
        <div className="teammates-avatar-stack">
          {(domain.members || []).slice(0, 4).map((tm, tIdx) => {
            const tmImg = tm.photo || tm.avatar;
            return (
              <div
                key={tm.id || tIdx}
                className="head-teammate-avatar-item"
                title={`${tm.name} (${tm.role})`}
              >
                {tmImg ? (
                  <img src={tmImg} alt={tm.name} />
                ) : (
                  <div className="head-teammate-avatar-fallback">
                    {getInitials(tm.name)}
                  </div>
                )}
              </div>
            );
          })}
          {domain.members && domain.members.length > 4 && (
            <div className="head-teammate-avatar-more">
              +{domain.members.length - 4}
            </div>
          )}
        </div>

        <span className="head-teammates-summary-text">
          {memberCount} Team Members
        </span>
      </div>

      {/* ACTION FOOTER */}
      <div className="head-card-cta-bar">
        <div className="head-team-counter">
          <i className="fa-solid fa-users"></i>
          <span>{memberCount} Members</span>
        </div>

        <div className="head-view-team-btn">
          <span>View Team</span>
          <i className="fa-solid fa-arrow-right arrow-icon"></i>
        </div>
      </div>
    </TiltCard>
  );
}

/* ==========================================================================
   6. MAIN EXECUTIVE COMMITTEE PAGE COMPONENT
   ========================================================================== */
export default function Committee() {
  const [domains, setDomains] = useState(OFFICIAL_COMMITTEE_DOMAINS);
  const [allMembers, setAllMembers] = useState(OFFICIAL_ALL_MEMBERS);
  const [loading, setLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const modalContentRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Fetch committee data from API and merge if available
  useEffect(() => {
    api.getCommittee()
      .then((res) => {
        if (res.domains && res.domains.length > 0) {
          const mergedDomains = OFFICIAL_COMMITTEE_DOMAINS.map((officialDom) => {
            const apiDom = res.domains.find(
              (d) => d.id === officialDom.id || d.domainName === officialDom.domainName
            );
            if (apiDom && apiDom.members && apiDom.members.length > 0) {
              return {
                ...officialDom,
                ...apiDom,
                memberCount: apiDom.members.length >= officialDom.memberCount ? apiDom.members.length : officialDom.memberCount,
                members: apiDom.members.length >= officialDom.members.length ? apiDom.members : officialDom.members
              };
            }
            return officialDom;
          });

          setDomains(mergedDomains);
          setAllMembers(res.allMembers && res.allMembers.length >= 48 ? res.allMembers : OFFICIAL_ALL_MEMBERS);
        }
      })
      .catch((err) => {
        console.warn('Using official static committee dataset:', err.message);
      });
  }, []);

  // Handle modal open
  const openDomainModal = useCallback((domain) => {
    setIsClosingModal(false);
    setSelectedDomain(domain);
  }, []);

  // Handle modal close with smooth exit animation
  const closeModal = useCallback(() => {
    setIsClosingModal(true);
    setTimeout(() => {
      setSelectedDomain(null);
      setIsClosingModal(false);
    }, 220);
  }, []);

  // Lock background scroll when modal is open & add ESC key listener
  useEffect(() => {
    if (selectedDomain) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      setTimeout(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        }
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedDomain, closeModal]);

  // Filtered members when searching
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return null;

    return allMembers.filter((member) => {
      const name = member.name?.toLowerCase() || '';
      const role = member.role?.toLowerCase() || '';
      const branch = member.branch?.toLowerCase() || '';
      const year = member.year?.toLowerCase() || '';
      const uid = member.uid?.toLowerCase() || '';
      const domainName = domains.find((d) => d.id === member.domainId)?.domainName?.toLowerCase() || '';

      return (
        name.includes(query) ||
        role.includes(query) ||
        branch.includes(query) ||
        year.includes(query) ||
        uid.includes(query) ||
        domainName.includes(query)
      );
    });
  }, [allMembers, searchQuery, domains]);

  const containerRef = useScrollReveal([domains, searchQuery]);

  return (
    <div
      className="committee-page-container blueprint-paper-canvas"
      ref={containerRef}
      style={{ position: 'relative' }}
    >
      {/* ================================================================
          TOP CAD RULER / TELEMETRY
      ================================================================= */}
      <div className="blueprint-ruler-top">
        <span>03 // ARCHITECTURAL ROSTER // EXECUTIVE COMMITTEE</span>
        <span>SYS_STATUS: VERIFIED</span>
        <span>OFFICIAL_DOMAINS: {domains.length || 7} // TOTAL_MEMBERS: {allMembers.length || 48}</span>
      </div>

      {/* ================================================================
          HERO SECTION
      ================================================================= */}
      <section className="hero-section" data-reveal="fade-up">
        <div className="hero-bg-glow glow-1"></div>
        <div className="hero-bg-glow glow-2"></div>

        <div className="hero-container">
          <div className="telemetry-tag" style={{ marginBottom: '1rem' }}>
            <span>03 // STUDENT LEADERSHIP // ENGINEERING INDIA – SVPCET</span>
          </div>

          <div className="hero-pill">
            <i className="fa-solid fa-graduation-cap"></i>
            Engineering India – SVPCET Student Team
          </div>

          <h1
            className="editorial-section-title"
            style={{
              marginTop: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            Executive <span className="outline-text">Committee</span>
          </h1>

          <p className="hero-description editorial-lead">
            Meet the leaders behind the team — driving vision, coordination and execution across all 7 official domains.
          </p>

          {/* ============================================================
              SEARCH BOX & QUICK PILLS
          ============================================================= */}
          <div
            className="controls-wrapper"
            data-reveal="fade-up"
            data-reveal-delay="100"
          >
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>

              <input
                type="text"
                id="searchInput"
                placeholder="Search any member (e.g. Sharwari, Documentation, AI, Secretary)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search committee members"
              />

              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{ display: 'block' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* QUICK DOMAIN JUMP PILLS */}
            <div className="domain-pills-row">
              {domains.map((dom) => (
                <button
                  key={dom.id}
                  type="button"
                  className="domain-jump-pill"
                  onClick={() => openDomainModal(dom)}
                  title={`Open ${dom.domainName} team modal`}
                >
                  <i className={`fa-solid ${dom.icon || 'fa-users'}`}></i>
                  <span>{dom.shortName || dom.domainName}</span>
                  <span className="pill-count-badge">{dom.memberCount || dom.members?.length || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          MAIN DIRECTORY
      ================================================================= */}
      <main className="main-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="domain-loading-spinner">
              <i className="fa-solid fa-circle-notch fa-spin"></i>
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Loading Executive Committee Directory...
            </p>
          </div>
        ) : searchResults !== null ? (
          /* ================================================================
              SEARCH RESULTS VIEW
          ================================================================= */
          <div className="search-results-section" data-reveal="fade-up">
            <div className="results-header">
              <div className="results-count">
                Search Results: <span>{searchResults.length}</span> {searchResults.length === 1 ? 'member' : 'members'} found for "{searchQuery}"
              </div>
              <button
                className="reset-search-link"
                onClick={() => setSearchQuery('')}
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Domain Heads
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="teams-grid" style={{ display: 'grid' }}>
                {searchResults.map((member, idx) => {
                  const memberDomain = domains.find((d) => d.id === member.domainId);
                  const linkedinUrl = normalizeUrl(member.linkedin);
                  const githubUrl = normalizeUrl(member.github);
                  const imgSrc = member.photo || member.avatar;

                  return (
                    <TiltCard
                      as="article"
                      key={member.id || idx}
                      className={`team-card blueprint-sheet-card cad-frame-wrap committee-member-card ${member.isHead ? 'is-domain-head-card' : ''}`}
                      onClick={() => memberDomain && openDomainModal(memberDomain)}
                      style={{ cursor: memberDomain ? 'pointer' : 'default' }}
                      title={memberDomain ? `Click to view full ${memberDomain.domainName} team` : ''}
                    >
                      <div className="cad-corner-marker tl" />
                      <div className="cad-corner-marker tr" />
                      <div className="cad-corner-marker bl" />
                      <div className="cad-corner-marker br" />

                      <div className="blueprint-spec-header">
                        <span>
                          {memberDomain ? memberDomain.shortName.toUpperCase() : 'COMMITTEE'}
                        </span>
                        <span>
                          {member.isHead ? '★ DOMAIN HEAD' : member.isCoHead ? '◆ CO-HEAD' : 'MEMBER'}
                        </span>
                      </div>

                      <div className="leader-profile-section" style={{ textAlign: 'center', paddingTop: '8px' }}>
                        <div
                          className="avatar-ring-wrap"
                          style={{
                            position: 'relative',
                            margin: '0 auto 16px',
                            width: '108px',
                            height: '108px'
                          }}
                        >
                          <div
                            className="avatar-ring"
                            style={{
                              background: member.isHead
                                ? 'linear-gradient(135deg, #f59e0b, #3b82f6)'
                                : 'linear-gradient(135deg, rgba(37,99,235,0.4), rgba(56,189,248,0.4))'
                            }}
                          ></div>

                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={member.name}
                              className="leader-avatar"
                              style={{
                                width: '92px',
                                height: '92px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                display: 'block',
                                margin: '8px auto 0',
                                position: 'relative',
                                zIndex: 2
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement.querySelector('.committee-avatar-fallback');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}

                          <div
                            className="committee-avatar-fallback"
                            style={{
                              width: '92px',
                              height: '92px',
                              borderRadius: '50%',
                              margin: '8px auto 0',
                              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(15, 23, 42, 0.12))',
                              border: '2px solid rgba(37, 99, 235, 0.3)',
                              color: 'var(--primary, #2563EB)',
                              display: imgSrc ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: 'Space Grotesk, sans-serif',
                              fontSize: '1.35rem',
                              fontWeight: 800,
                              position: 'relative',
                              zIndex: 2
                            }}
                            aria-hidden="true"
                          >
                            {getInitials(member.name)}
                          </div>

                          {member.isHead && (
                            <span className="leader-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                              <i className="fa-solid fa-crown" style={{ fontSize: '0.65rem' }}></i> Head
                            </span>
                          )}
                          {member.isCoHead && (
                            <span className="leader-badge" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                              Co-Head
                            </span>
                          )}
                        </div>

                        <h3 className="leader-name" style={{ marginBottom: '4px' }}>
                          {member.name}
                        </h3>

                        <div className="member-role-badge">
                          {member.role}
                        </div>

                        <div className="member-academic-tag">
                          {member.year && <span>{member.year} Year</span>}
                          {member.year && member.branch && <span className="dot-divider">•</span>}
                          {member.branch && <span>{member.branch}</span>}
                        </div>

                        {member.uid && (
                          <div className="member-uid-tag">
                            <i className="fa-solid fa-id-card"></i> UID: {member.uid}
                          </div>
                        )}

                        {member.tagline && (
                          <p className="modal-member-tagline" style={{ marginTop: '0.4rem' }}>
                            "{member.tagline}"
                          </p>
                        )}

                        {(linkedinUrl || githubUrl) && (
                          <div className="member-social-links" onClick={(e) => e.stopPropagation()}>
                            {linkedinUrl && (
                              <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="member-social-btn"
                                aria-label={`LinkedIn of ${member.name}`}
                              >
                                <i className="fa-brands fa-linkedin"></i>
                              </a>
                            )}
                            {githubUrl && (
                              <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="member-social-btn"
                                aria-label={`GitHub of ${member.name}`}
                              >
                                <i className="fa-brands fa-github"></i>
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="card-domain-footer">
                        <span className="domain-pill-small">
                          <i className={`fa-solid ${memberDomain?.icon || 'fa-users'}`}></i>
                          {memberDomain?.domainName || 'Domain Member'}
                        </span>
                        {memberDomain && (
                          <span className="search-view-domain-cta">
                            View Team <i className="fa-solid fa-arrow-right"></i>
                          </span>
                        )}
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fa-solid fa-user-slash"></i>
                </div>
                <h3 className="empty-title">No Committee Members Found</h3>
                <p className="empty-desc">
                  We couldn't find any member matching "{searchQuery}". Try searching for another name, branch, or role.
                </p>
                <button className="reset-btn" onClick={() => setSearchQuery('')}>
                  <i className="fa-solid fa-rotate-left"></i> Reset Search
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ================================================================
              DEFAULT STATE: 7 DOMAIN HEADS PROFILE CARDS ONLY
          ================================================================= */
          <div className="domain-heads-container" data-reveal="fade-up">
            <div className="domain-heads-intro">
              <span className="section-kicker">STUDENT EXECUTIVE ROSTER</span>
              <h2 className="domain-section-heading">
                Meet The <span className="highlight-gradient">Domain Heads</span>
              </h2>
              <p className="domain-section-sub">
                Click on any domain head card below to open the complete interactive team roster.
              </p>
            </div>

            {/* THE 7 DOMAIN HEADS GRID */}
            <div className="domain-heads-grid-clean">
              {domains.map((dom, idx) => (
                <DomainHeadCard
                  key={dom.id}
                  domain={dom}
                  index={idx}
                  onSelect={openDomainModal}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================================================================
          REUSABLE SINGLE DOMAIN TEAM MODAL COMPONENT
      ================================================================= */}
      {selectedDomain && (
        <DomainTeamModal
          selectedDomain={selectedDomain}
          domains={domains}
          allMembers={allMembers}
          isClosingModal={isClosingModal}
          closeModal={closeModal}
          modalContentRef={modalContentRef}
          closeBtnRef={closeBtnRef}
        />
      )}
    </div>
  );
}