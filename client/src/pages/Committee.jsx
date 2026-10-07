import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LeaderModal from '../components/LeaderModal';
import TiltCard from '../components/TiltCard';
import Avatar from '../components/Avatar';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/committee-page.css';

export default function Committee() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeaderTeam, setSelectedLeaderTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredTeammate, setHoveredTeammate] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    api.getCommittee()
      .then(res => {
        setTeams(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching committee:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const domainsList = ['All', 'Leaders', 'Technical', 'Events', 'Management', 'Media'];

  // Filter teams based on active tab and search query
  const filteredTeams = teams.filter(item => {
    const matchesDomain =
      activeDomain === 'All' || item.domain.toLowerCase() === activeDomain.toLowerCase();

    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesDomain;

    const matchesLeaderName = item.leader?.name.toLowerCase().includes(q);
    const matchesLeaderTitle = item.leader?.title.toLowerCase().includes(q);
    const matchesDomainName = item.domain.toLowerCase().includes(q);
    const matchesBio = item.leader?.bio.toLowerCase().includes(q);
    const matchesTeammate = item.teammates?.some(
      t => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q)
    );

    return (
      matchesDomain &&
      (matchesLeaderName || matchesLeaderTitle || matchesDomainName || matchesBio || matchesTeammate)
    );
  });

  const handleOpenModal = (team, member = null) => {
    setSelectedLeaderTeam(team);
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleMouseEnterTeammate = (teammate, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 12
    });
    setHoveredTeammate(teammate);
  };

  const handleMouseLeaveTeammate = () => {
    setHoveredTeammate(null);
  };

  const containerRef = useScrollReveal([filteredTeams]);

  return (
    <div className="committee-page-container blueprint-paper-canvas" ref={containerRef} style={{ position: 'relative' }}>
      {/* Top CAD Architectural Millimeter Ruler */}
      <div className="blueprint-ruler-top">
        <span>03 // ARCHITECTURAL ROSTER // EI-LEADERSHIP</span>
        <span>SYS_STATUS: VERIFIED</span>
        <span>MEMBERS_INDEXED: 35+ // 6 DOMAINS</span>
      </div>

      {/* HERO SECTION */}
      <section className="hero-section" data-reveal="fade-up">
        <div className="hero-bg-glow glow-1"></div>
        <div className="hero-bg-glow glow-2"></div>

        <div className="hero-container">
          <div className="telemetry-tag" style={{ marginBottom: '1rem' }}>
            <span>03 // ARCHITECTURAL ROSTER // EXECUTIVE DOSSIER</span>
          </div>
          <div className="hero-pill">
            <i className="fa-solid fa-sparkles"></i> Innovators &amp; Creators
          </div>
          <h1 className="editorial-section-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Meet Our <span className="outline-text">Community Leaders</span>
          </h1>
          <p className="hero-description editorial-lead">
            Empowering thousands of passionate developers, designers, and tech enthusiasts
            across India. Explore team leaders, meet members, and connect on LinkedIn.
          </p>

          {/* Controls: Search Bar & Filter Tabs */}
          <div className="controls-wrapper" data-reveal="fade-up" data-reveal-delay="100">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Search leaders, teammates, roles, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{ display: 'block' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <div className="filter-tabs-wrapper">
              <div className="filter-tabs" role="tablist">
                {domainsList.map(domain => (
                  <button
                    key={domain}
                    className={`filter-btn ${activeDomain === domain ? 'active' : ''}`}
                    onClick={() => setActiveDomain(domain)}
                    role="tab"
                    aria-selected={activeDomain === domain}
                  >
                    {domain === 'All' && <i className="fa-solid fa-border-all"></i>}
                    {domain === 'Leaders' && <i className="fa-solid fa-crown"></i>}
                    {domain === 'Technical' && <i className="fa-solid fa-code"></i>}
                    {domain === 'Events' && <i className="fa-solid fa-calendar-days"></i>}
                    {domain === 'Management' && <i className="fa-solid fa-briefcase"></i>}
                    {domain === 'Media' && <i className="fa-solid fa-camera-retro"></i>}
                    {' '}{domain}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN DIRECTORY GRID */}
      <main className="main-container">
        <div className="results-header" data-reveal="fade-up">
          <div className="results-count" id="resultsCount">
            Showing <span id="visibleCardsNum">{filteredTeams.length}</span> Teams
          </div>
          <div className="quick-tip">
            <i className="fa-solid fa-lightbulb"></i> Tip: Hover or click any member to view profiles and LinkedIn!
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p>Loading community leaders &amp; teams...</p>
          </div>
        ) : filteredTeams.length > 0 ? (
          <div className="teams-grid" id="teamsGrid" style={{ display: 'grid' }}>
            {filteredTeams.map((team, idx) => (
              <TiltCard
                as="article"
                key={team.id || idx}
                className="team-card blueprint-sheet-card cad-frame-wrap"
                data-domain={team.domain}
              >
                <div className="cad-corner-marker tl" />
                <div className="cad-corner-marker tr" />
                <div className="cad-corner-marker bl" />
                <div className="cad-corner-marker br" />

                <div className="blueprint-spec-header">
                  <span>DOSSIER_{String(idx + 1).padStart(2, '0')} // {team.domain?.toUpperCase()}</span>
                  <span>CAD_SPEC // ACTIVE</span>
                </div>

                {/* Domain Header */}
                <div className="card-domain-header">
                  <span className="domain-badge" style={{ color: team.badgeColor || 'var(--blueprint-blue, #155EEF)' }}>
                    <i className={`fa-solid ${team.icon}`}></i> {team.domain}
                  </span>
                  <button
                    className="card-more-btn modal-trigger"
                    aria-label="View Leader Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(team);
                    }}
                    title="View Leader Details"
                    style={{ position: 'relative', zIndex: 20 }}
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </button>
                </div>

                {/* Leader Profile Section */}
                <div className="leader-profile-section">
                  <div
                    className="avatar-ring-wrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(team);
                    }}
                    style={{ cursor: 'pointer', position: 'relative', zIndex: 20 }}
                    title="Click to inspect leader & team"
                  >
                    <div className="avatar-ring"></div>
                    <Avatar
                      src={team.leader.avatar}
                      alt={team.leader.name}
                      size={96}
                      className="leader-avatar"
                    />
                    <span className="leader-badge">
                      <i className="fa-solid fa-crown"></i> Leader
                    </span>
                  </div>

                  <h3
                    className="leader-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(team);
                    }}
                    style={{ cursor: 'pointer', position: 'relative', zIndex: 20 }}
                  >
                    {team.leader.name}
                  </h3>
                  <p className="leader-role">{team.leader.title}</p>
                  <p className="leader-bio">{team.leader.bio}</p>

                  {/* Skills Chips */}
                  {team.leader.skills && (
                    <div className="skills-row">
                      {team.leader.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-chip">
                          {skill}
                        </span>
                      ))}
                      {team.leader.skills.length > 3 && (
                        <span className="skill-chip" style={{ opacity: 0.7 }}>
                          +{team.leader.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* LinkedIn Profile Direct Link */}
                  {team.leader.linkedin && (
                    <a
                      href={team.leader.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-connect-btn"
                      style={{ marginTop: '12px' }}
                    >
                      <i className="fa-brands fa-linkedin"></i> View on LinkedIn
                    </a>
                  )}
                </div>

                {/* Clean Domain Roster Bar & Rise-Up Action */}
                {team.teammates && team.teammates.length > 0 && (
                  <div
                    className="card-roster-footer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(team);
                    }}
                    title="Click to meet all domain members"
                    style={{
                      marginTop: 'auto',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      position: 'relative',
                      zIndex: 25,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: 'rgba(37, 99, 235, 0.1)',
                          color: 'var(--primary, #2563EB)',
                          fontSize: '0.78rem'
                        }}
                      >
                        <i className="fa-solid fa-users"></i>
                      </span>
                      <span
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary, #475569)'
                        }}
                      >
                        {team.teammates.length} Core Members
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-meet-team"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenModal(team);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        position: 'relative',
                        zIndex: 30,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span>Meet Team</span>
                      <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                    </button>
                  </div>
                )}
              </TiltCard>
            ))}
          </div>
        ) : (
          <div className="empty-state" id="emptyState" style={{ display: 'block' }}>
            <div className="empty-icon">
              <i className="fa-solid fa-user-slash"></i>
            </div>
            <h3 className="empty-title">No Leaders or Teammates Found</h3>
            <p className="empty-desc">
              We couldn't find any team matching your search or active filter. Try searching for a different keyword.
            </p>
            <button
              className="reset-btn"
              onClick={() => {
                setActiveDomain('All');
                setSearchQuery('');
              }}
            >
              <i className="fa-solid fa-rotate-left"></i> Reset Search &amp; Filters
            </button>
          </div>
        )}
      </main>

      {/* Leader Modal */}
      <LeaderModal
        domain={selectedLeaderTeam}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
