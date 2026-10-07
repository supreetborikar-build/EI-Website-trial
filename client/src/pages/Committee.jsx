import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import TiltCard from '../components/TiltCard';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/committee-page.css';

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const normalizeUrl = (url = '') => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function Committee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getCommittee()
      .then(res => {
        setMembers(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching committee:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return members;

    return members.filter(member => {
      const name = member.name?.toLowerCase() || '';
      const tagline = member.tagline?.toLowerCase() || '';
      const linkedin = member.linkedin?.toLowerCase() || '';
      const github = member.github?.toLowerCase() || '';

      return (
        name.includes(query) ||
        tagline.includes(query) ||
        linkedin.includes(query) ||
        github.includes(query)
      );
    });
  }, [members, searchQuery]);

  const containerRef = useScrollReveal([filteredMembers]);

  return (
    <div
      className="committee-page-container blueprint-paper-canvas"
      ref={containerRef}
      style={{ position: 'relative' }}
    >
      {/* ================================================================
          TOP CAD RULER
      ================================================================= */}
      <div className="blueprint-ruler-top">
        <span>03 // ARCHITECTURAL ROSTER // EXECUTIVE COMMITTEE</span>
        <span>SYS_STATUS: VERIFIED</span>
        <span>MEMBERS_INDEXED: {members.length}</span>
      </div>

      {/* ================================================================
          HERO
      ================================================================= */}
      <section className="hero-section" data-reveal="fade-up">
        <div className="hero-bg-glow glow-1"></div>
        <div className="hero-bg-glow glow-2"></div>

        <div className="hero-container">
          <div
            className="telemetry-tag"
            style={{ marginBottom: '1rem' }}
          >
            <span>03 // ARCHITECTURAL ROSTER // EXECUTIVE DOSSIER</span>
          </div>

          <div className="hero-pill">
            <i className="fa-solid fa-users"></i>
            Engineering India
          </div>

          <h1
            className="editorial-section-title"
            style={{
              marginTop: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            Meet The{' '}
            <span className="outline-text">Executive Committee</span>
          </h1>

          <p className="hero-description editorial-lead">
            Meet the people building Engineering India through ideas,
            initiatives, collaboration, and action.
          </p>

          {/* ============================================================
              SEARCH
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
                placeholder="Search committee members..."
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
          </div>
        </div>
      </section>

      {/* ================================================================
          DIRECTORY
      ================================================================= */}
      <main className="main-container">
        <div
          className="results-header"
          data-reveal="fade-up"
        >
          <div className="results-count" id="resultsCount">
            Showing{' '}
            <span id="visibleCardsNum">
              {filteredMembers.length}
            </span>{' '}
            {filteredMembers.length === 1 ? 'Member' : 'Members'}
          </div>

          <div className="quick-tip">
            <i className="fa-solid fa-lightbulb"></i>
            Connect with members through their professional profiles.
          </div>
        </div>

        {/* ================================================================
            LOADING
        ================================================================= */}
        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0'
            }}
          >
            <p>Loading Executive Committee...</p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div
            className="teams-grid"
            id="teamsGrid"
            style={{ display: 'grid' }}
          >
            {filteredMembers.map((member, idx) => {
              const linkedinUrl = normalizeUrl(member.linkedin);
              const githubUrl = normalizeUrl(member.github);

              return (
                <TiltCard
                  as="article"
                  key={member.id || member.name || idx}
                  className="team-card blueprint-sheet-card cad-frame-wrap committee-member-card"
                >
                  {/* CAD CORNERS */}
                  <div className="cad-corner-marker tl" />
                  <div className="cad-corner-marker tr" />
                  <div className="cad-corner-marker bl" />
                  <div className="cad-corner-marker br" />

                  {/* DOSSIER HEADER */}
                  <div className="blueprint-spec-header">
                    <span>
                      DOSSIER_{String(idx + 1).padStart(2, '0')}
                    </span>

                    <span>
                      EI_COMMITTEE // ACTIVE
                    </span>
                  </div>

                  {/* ======================================================
                      MEMBER PROFILE
                  ======================================================= */}
                  <div
                    className="leader-profile-section"
                    style={{
                      textAlign: 'center',
                      paddingTop: '8px'
                    }}
                  >
                    {/* PHOTO */}
                    <div
                      className="avatar-ring-wrap"
                      style={{
                        position: 'relative',
                        margin: '0 auto 18px',
                        width: '112px',
                        height: '112px'
                      }}
                    >
                      <div className="avatar-ring"></div>

                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="leader-avatar"
                          style={{
                            width: '96px',
                            height: '96px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            display: 'block',
                            margin: '8px auto 0',
                            position: 'relative',
                            zIndex: 2
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';

                            const fallback =
                              e.currentTarget.parentElement.querySelector(
                                '.committee-avatar-fallback'
                              );

                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}

                      {/* INITIALS FALLBACK */}
                      <div
                        className="committee-avatar-fallback"
                        style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '50%',
                          margin: '8px auto 0',
                          background:
                            'linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(15, 23, 42, 0.08))',
                          border:
                            '1px solid rgba(37, 99, 235, 0.22)',
                          color: 'var(--primary, #2563EB)',
                          display: member.avatar ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          position: 'relative',
                          zIndex: 2
                        }}
                        aria-hidden="true"
                      >
                        {getInitials(member.name)}
                      </div>
                    </div>

                    {/* NAME */}
                    <h3
                      className="leader-name"
                      style={{
                        cursor: 'default',
                        position: 'relative',
                        zIndex: 20
                      }}
                    >
                      {member.name}
                    </h3>

                    {/* TAGLINE */}
                    {member.tagline && (
                      <p
                        className="leader-bio"
                        style={{
                          minHeight: '48px',
                          marginTop: '8px',
                          marginBottom: '14px'
                        }}
                      >
                        “{member.tagline}”
                      </p>
                    )}

                    {/* ====================================================
                        SOCIAL LINKS
                    ===================================================== */}
                    {(linkedinUrl || githubUrl) && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginTop: '14px'
                        }}
                      >
                        {linkedinUrl && (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="linkedin-connect-btn"
                            style={{
                              marginTop: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            aria-label={`LinkedIn profile of ${member.name}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fa-brands fa-linkedin"></i>
                            LinkedIn
                          </a>
                        )}

                        {githubUrl && (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="linkedin-connect-btn"
                            style={{
                              marginTop: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            aria-label={`GitHub profile of ${member.name}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fa-brands fa-github"></i>
                            GitHub
                          </a>
                        )}
                      </div>
                    )}

                    {/* NO PROFILE DATA */}
                    {!member.linkedin &&
                      !member.github &&
                      !member.tagline && (
                        <p
                          style={{
                            marginTop: '14px',
                            fontSize: '0.78rem',
                            color:
                              'var(--text-secondary, #64748b)',
                            fontFamily:
                              'Space Grotesk, sans-serif'
                          }}
                        >
                          Committee Member
                        </p>
                      )}
                  </div>

                  {/* ======================================================
                      FOOTER
                  ======================================================= */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '16px',
                      borderTop:
                        '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background:
                            'rgba(37, 99, 235, 0.1)',
                          color:
                            'var(--primary, #2563EB)',
                          fontSize: '0.78rem'
                        }}
                      >
                        <i className="fa-solid fa-id-badge"></i>
                      </span>

                      <span
                        style={{
                          fontFamily:
                            'Space Grotesk, sans-serif',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color:
                            'var(--text-secondary, #475569)'
                        }}
                      >
                        EI EXECUTIVE COMMITTEE
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily:
                          'Space Grotesk, sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color:
                          'var(--primary, #2563EB)',
                        letterSpacing: '0.04em'
                      }}
                    >
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        ) : (
          /* ================================================================
             EMPTY STATE
          ================================================================= */
          <div
            className="empty-state"
            id="emptyState"
            style={{ display: 'block' }}
          >
            <div className="empty-icon">
              <i className="fa-solid fa-user-slash"></i>
            </div>

            <h3 className="empty-title">
              No Committee Members Found
            </h3>

            <p className="empty-desc">
              We couldn't find a committee member matching
              your search. Try another name or keyword.
            </p>

            <button
              className="reset-btn"
              onClick={() => setSearchQuery('')}
            >
              <i className="fa-solid fa-rotate-left"></i>
              Reset Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}