import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { api } from '../services/api';
import {
  OFFICIAL_COMMITTEE_DOMAINS,
  OFFICIAL_ALL_MEMBERS,
  UNRESOLVED_EXECUTIVE_PROFILES,
  normalizeLinkedInUrl,
  normalizeGitHubUrl
} from '../data/committeeData';
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
   1. MEMBER CARD COMPONENT (Used on Page & Inside Modals)
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
  isCoHead,
  domainColor = '#2563EB',
  className = ''
}) {
  const imgSrc = photo || avatar;
  const linkedinUrl = normalizeLinkedInUrl(linkedin);
  const githubUrl = normalizeGitHubUrl(github);
  const isCoHeadRole = isCoHead || /co-head|co-coordinator/i.test(role || '');
  const isHeadRole = isHead || (/head/i.test(role || '') && !isCoHeadRole);

  return (
    <article
      className={`modal-member-card executive-roster-card ${isCoHeadRole ? 'is-cohead' : ''} ${isHeadRole ? 'is-head' : ''} ${className}`}
      id={`member-${uid || name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* MEMBER PHOTO */}
      <div className="member-card-avatar-wrap">
        <div
          className="member-avatar-glow-ring"
          style={{
            background: isHeadRole
              ? 'linear-gradient(135deg, #f59e0b, #e11d48)'
              : isCoHeadRole
              ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
              : `linear-gradient(135deg, ${domainColor}55, rgba(56, 189, 248, 0.35))`
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
            color: isHeadRole ? '#f59e0b' : isCoHeadRole ? '#3b82f6' : domainColor
          }}
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>

        {isHeadRole && (
          <span className="member-status-pill head">
            <i className="fa-solid fa-crown" style={{ fontSize: '0.55rem' }}></i> Head
          </span>
        )}
        {isCoHeadRole && (
          <span className="member-status-pill cohead">
            Co-Head
          </span>
        )}
      </div>

      {/* MEMBER INFO */}
      <div className="modal-member-info">
        <h4 className="modal-member-name">{name}</h4>

        <div className={`modal-member-role-tag ${isHeadRole ? 'head-role' : isCoHeadRole ? 'cohead-role' : ''}`}>
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
   2. DOMAIN HEAD SPOTLIGHT COMPONENT (Used inside modal)
   ========================================================================== */
export function DomainHead({ head = {}, domainName = '', badgeColor = '#2563EB', icon = 'fa-user-tie' }) {
  const imgSrc = head.photo || head.avatar;
  const linkedinUrl = normalizeLinkedInUrl(head.linkedin);
  const githubUrl = normalizeGitHubUrl(head.github);

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
   3. DOMAIN TEAM MODAL COMPONENT (Full interactive popup for any domain)
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
  const domainMembers = currentDomain.members || getMembersByDomain(currentDomain, domains, allMembers);

  // Identify the domain head
  const head = currentDomain.head || domainMembers.find((m) => m.isHead) || domainMembers[0] || {};

  // Filter out head from the remaining members grid to avoid duplication in modal
  const remainingMembers = domainMembers.filter((m) => {
    if (m.id && head.id && m.id === head.id) return false;
    if (m.uid && head.uid && m.uid === head.uid && m.name === head.name) return false;
    return m.name?.trim().toLowerCase() !== head.name?.trim().toLowerCase();
  });

  return (
    <div
      className={`domain-modal-overlay ${isClosingModal ? 'is-closing' : 'is-open'}`}
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-domain-title"
      id="domainTeamModal"
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
          id="modalCloseButton"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* MODAL FIXED HEADER */}
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
              `Meet the complete team driving ${currentDomain.domainName} operations, vision, and campus execution.`}
          </p>
        </header>

        {/* MODAL SCROLLABLE CONTENT BODY */}
        <div className="modal-scroll-body" tabIndex={0}>
          {/* 1. DOMAIN HEAD SPOTLIGHT AT TOP */}
          {head && head.name && (
            <DomainHead
              head={head}
              domainName={currentDomain.domainName}
              badgeColor={currentDomain.badgeColor || '#2563EB'}
              icon={currentDomain.icon || 'fa-user-tie'}
            />
          )}

          {/* 2. TEAM MEMBERS SECTION */}
          {remainingMembers.length > 0 && (
            <section className="modal-team-members-section">
              <div className="section-divider-label">
                <span>
                  {currentDomain.shortName || currentDomain.domainName} TEAM MEMBERS ({remainingMembers.length})
                </span>
              </div>

              <div className="modal-members-grid">
                {remainingMembers.map((member, idx) => (
                  <MemberCard
                    key={member.id || `${currentDomain.id}-${member.uid || idx}-${member.name}`}
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
                    domainColor={currentDomain.badgeColor}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* MODAL FOOTER ACTION */}
        <footer className="modal-footer-bar">
          <div className="modal-footer-domain-info">
            <i className={`fa-solid ${currentDomain.icon || 'fa-users'}`}></i>
            <span>Engineering India – SVPCET // {currentDomain.domainName} Domain</span>
          </div>

          <button
            type="button"
            className="modal-footer-close-btn"
            onClick={closeModal}
            id="modalFooterCloseButton"
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
   4. DOMAIN SECTION COMPONENT (Directly Rendered on Page)
   ========================================================================== */
export function DomainSection({
  domain,
  index,
  onOpenModal
}) {
  const members = domain.members || [];
  const head = domain.head || members.find((m) => m.isHead) || members[0] || {};
  const badgeColor = domain.badgeColor || '#2563EB';
  const icon = domain.icon || 'fa-users';

  return (
    <section
      className="committee-domain-section"
      id={`domain-section-${domain.id}`}
      aria-labelledby={`domain-heading-${domain.id}`}
      data-reveal="fade-up"
    >
      {/* SECTION HEADER CARD */}
      <div className="domain-section-header-card blueprint-sheet-card cad-frame-wrap">
        <div className="cad-corner-marker tl" />
        <div className="cad-corner-marker tr" />
        <div className="cad-corner-marker bl" />
        <div className="cad-corner-marker br" />

        <div className="domain-section-title-wrap">
          <div className="domain-section-badge-row">
            <span
              className="domain-section-tag"
              style={{
                color: badgeColor,
                backgroundColor: `${badgeColor}12`,
                borderColor: `${badgeColor}35`
              }}
            >
              <i className={`fa-solid ${icon}`}></i>
              DOMAIN 0{index + 1} // {domain.domainName.toUpperCase()}
            </span>
          </div>

          <h2 id={`domain-heading-${domain.id}`} className="domain-section-title">
            {domain.domainName}
          </h2>

          <p className="domain-section-desc">
            {domain.description || `Managing ${domain.domainName} initiatives and student projects.`}
          </p>
        </div>

        <div className="domain-section-actions">
          <span className="domain-section-count-pill">
            <i className="fa-solid fa-users"></i>
            {members.length} Members
          </span>

          <button
            type="button"
            className="domain-section-modal-btn"
            onClick={() => onOpenModal(domain)}
            title={`Open ${domain.domainName} Dossier Modal`}
          >
            <i className="fa-solid fa-expand"></i>
            <span>View Dossier</span>
          </button>
        </div>
      </div>

      {/* MEMBER CARDS RESPONSIVE GRID (Directly Rendered on Page) */}
      <div className="domain-roster-grid">
        {members.map((member, idx) => (
          <MemberCard
            key={member.id || `${domain.id}-${member.uid || idx}-${member.name}`}
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
            domainColor={badgeColor}
          />
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   5. MAIN EXECUTIVE COMMITTEE PAGE COMPONENT
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
          // Merge API domain metadata while preserving complete roster members
          const mergedDomains = OFFICIAL_COMMITTEE_DOMAINS.map((officialDom) => {
            const apiDom = res.domains.find(
              (d) => d.id === officialDom.id || d.domainName?.toLowerCase() === officialDom.domainName?.toLowerCase()
            );
            if (apiDom && apiDom.members && apiDom.members.length >= officialDom.members.length) {
              return {
                ...officialDom,
                ...apiDom,
                members: apiDom.members
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

  // Smooth scroll helper for quick domain navigation
  const scrollToDomain = (domainId) => {
    const el = document.getElementById(`domain-section-${domainId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      const tagline = member.tagline?.toLowerCase() || '';
      const domainName = domains.find((d) => d.id === member.domainId)?.domainName?.toLowerCase() || '';

      return (
        name.includes(query) ||
        role.includes(query) ||
        branch.includes(query) ||
        year.includes(query) ||
        uid.includes(query) ||
        tagline.includes(query) ||
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
        <span>OFFICIAL_DOMAINS: {domains.length} // TOTAL_MEMBERS: {allMembers.length}</span>
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
            Engineering India – SVPCET Student Executive Committee
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
            Meet all {allMembers.length} members across {domains.length} official domains — driving vision, coordination, and technical execution.
          </p>

          {/* ============================================================
              SEARCH BOX & QUICK NAVIGATION PILLS
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
                placeholder="Search any member (e.g. Purva, Supreet, AI, PR, 24006068)..."
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
                  onClick={() => scrollToDomain(dom.id)}
                  title={`Jump to ${dom.domainName} section`}
                  id={`jump-pill-${dom.id}`}
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
          MAIN DIRECTORY (ALL DOMAIN SECTIONS DIRECTLY ON PAGE)
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
                <i className="fa-solid fa-arrow-left"></i> Back to Full Roster
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="domain-roster-grid">
                {searchResults.map((member, idx) => {
                  const memberDomain = domains.find((d) => d.id === member.domainId);
                  return (
                    <MemberCard
                      key={member.id || `${member.domainId}-${member.uid || idx}`}
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
                      domainColor={memberDomain?.badgeColor}
                    />
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
              DEFAULT VIEW: ALL 6 DOMAIN SECTIONS WITH 48 MEMBERS ON PAGE
          ================================================================= */
          <div className="all-domains-container">
            {domains.map((dom, idx) => (
              <DomainSection
                key={dom.id}
                domain={dom}
                index={idx}
                onOpenModal={openDomainModal}
              />
            ))}
          </div>
        )}
      </main>

      {/* ================================================================
          REUSABLE SINGLE DOMAIN TEAM MODAL POPUP
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