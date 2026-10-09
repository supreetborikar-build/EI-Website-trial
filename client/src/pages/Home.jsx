import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import KineticCounter from '../components/KineticCounter';
import MarqueeText from '../components/MarqueeText';
import HorizontalScrollEvents from '../components/HorizontalScrollEvents';
import EventRegisterModal from '../components/EventRegisterModal';
import NewsReaderModal from '../components/NewsReaderModal';
import LeaderModal from '../components/LeaderModal';
import Avatar from '../components/Avatar';
import TypographyMaskPortal from '../components/TypographyMaskPortal';
import PrinciplesReel from '../components/PrinciplesReel';
import { OFFICIAL_COMMITTEE_DOMAINS } from '../data/committeeData';

const HERO_IMAGES = [
  { src: '/assets_events/impact.jpeg', title: 'Taking the Lead', tag: 'Initiative' },
  { src: '/assets_events/learn.JPG', title: 'Future of Engineering', tag: 'Vision' },
  { src: '/assets_events/promptwars-2026.jpg', title: 'PromptWars 2026', tag: 'Competition' },
  { src: '/assets_events/rangittalim-1.JPG', title: 'Social Impact', tag: 'Community' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [committeeTeams, setCommitteeTeams] = useState(OFFICIAL_COMMITTEE_DOMAINS);
  const [scrollRatio, setScrollRatio] = useState(0);

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sendingContact, setSendingContact] = useState(false);

  const { addToast } = useToast();
  const heroRef = useRef(null);

  // Auto slide hero gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch preview data for events, news, and committee
  useEffect(() => {
    api.getEvents()
      .then((res) => setEvents(res.data || []))
      .catch(() => {});

    api.getAnnouncements()
      .then((res) => setNews(res.data || []))
      .catch(() => {});

    api.getCommittee()
      .then((res) => {
        if (res.domains && res.domains.length > 0) {
          setCommitteeTeams(res.domains);
        }
      })
      .catch(() => {});
  }, []);

  // Scroll ratio listener for monumental hero typography translation
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY;
          const ratio = Math.min(sy / 750, 1);
          setScrollRatio(ratio);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      setSendingContact(true);
      const res = await api.sendContact(contactForm);
      addToast(res.message || 'Transmission received! Our chapter will be in touch.', 'success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      addToast(err.message || 'Failed to transmit message', 'error');
    } finally {
      setSendingContact(false);
    }
  };

  // Modal helpers
  const handleOpenEventModal = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleOpenArticleModal = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleOpenLeaderModal = (team) => {
    setSelectedDomain(team);
    setIsLeaderModalOpen(true);
  };

  const featuredNews = news.find((n) => n.is_featured) || news[0];
  const secondaryNews = news.filter((n) => n.id !== featuredNews?.id).slice(0, 4);

  return (
    <div className="home-page-cinematic" style={{ position: 'relative', width: '100%', overflowX: 'clip' }}>
      {/* ====================================================================
          SCENE 01: MONUMENTAL HERO COMPOSITION
          ==================================================================== */}
      <section ref={heroRef} className="cinematic-hero-section blueprint-grid-bg blueprint-paper-canvas" id="home" style={{ position: 'relative' }}>
        {/* Top CAD Architectural Millimeter Ruler */}
        <div className="blueprint-ruler-top">
          <span>01 // CAD_SYSTEM: EI-ARCH-2026</span>
          <span>COORDINATES: 21.1458° N, 79.0882° E</span>
          <span>RENDER_ENGINE: ACTIVE // 60FPS</span>
        </div>

        {/* Top Telemetry HUD */}
        <div className="hero-telemetry-hud">
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span className="telemetry-tag">SYS: ACTIVE</span>
            <span>CHAPTER: SVPCET NAGPUR</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>21.1458° N, 79.0882° E</span>
          </div>

          <div>
            <span className="chapter-badge">EST. 2024 // EI-NATIONAL</span>
          </div>
        </div>

        {/* Monumental Split Typography */}
        <div className="hero-monument-wrap">
          <h1 className="editorial-hero-title">
            <span
              style={{
                display: 'block',
                transform: `translate3d(${-scrollRatio * 75}px, 0, 0)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              ENGINEERING
            </span>
            <span
              className="outline-text"
              style={{
                display: 'block',
                transform: `translate3d(${scrollRatio * 75}px, 0, 0)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              INDIA
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              color: 'var(--body, #475569)',
              maxWidth: '64ch',
              margin: '1.25rem auto 0',
              lineHeight: 1.6
            }}
          >
            A nationwide student movement bridging academics and real-world technology.
            Where builders, innovators, and problem solvers engineer the future.
          </p>

          {/* Action Triggers */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <MagneticButton>
              <Link to="/contact" className="btn-cinematic-primary">
                <span>Join Community</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </MagneticButton>

            <MagneticButton>
              <a href="#events" className="btn-cinematic-outline">
                <span>Explore Events ↓</span>
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Central Architectural Image Portal */}
        <div
          className="hero-portal-window"
          style={{
            transform: `scale(${1 + scrollRatio * 0.05})`,
            transition: 'transform 0.12s ease-out'
          }}
        >
          <div className="crosshair-corner top-left" />
          <div className="crosshair-corner top-right" />
          <div className="crosshair-corner bottom-left" />
          <div className="crosshair-corner bottom-right" />

          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={`hero-portal-slide ${idx === currentSlide ? 'active' : ''}`}
            >
              <img src={img.src} alt={img.title} />
              <div className="hero-portal-caption">
                <div>
                  <span
                    style={{
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.72rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#38BDF8'
                    }}
                  >
                    {img.tag}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: 700 }}>
                    {img.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {HERO_IMAGES.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlide(dotIdx)}
                      aria-label={`Slide ${dotIdx + 1}`}
                      style={{
                        width: dotIdx === currentSlide ? '24px' : '8px',
                        height: '6px',
                        borderRadius: '3px',
                        background: dotIdx === currentSlide ? '#38BDF8' : 'rgba(255, 255, 255, 0.35)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SIGNATURE WOW: IMAGE INSIDE GIANT DISPLAY TYPOGRAPHY
          ==================================================================== */}
      <TypographyMaskPortal />

      {/* ====================================================================
          SCENE 02: THE MANIFESTO & ARCHITECTURAL PRINCIPLES REEL
          ==================================================================== */}
      <section className="manifesto-section blueprint-paper-canvas" id="about" style={{ padding: '120px 5vw', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="telemetry-tag">
            <span>03 // ARCHITECTURAL PRINCIPLES // CAD-CORE</span>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h2 className="manifesto-statement">
              ENGINEERING IS MORE THAN A DEGREE.{' '}
              <span className="outline-text" style={{ display: 'block' }}>
                IT'S A WAY OF THINKING.
              </span>
            </h2>

            <p className="editorial-lead">
              We believe engineering doesn’t end when the classroom lecture concludes. It thrives in
              late-night lab sessions, open-source repositories, community hackathons, and real-world
              field deployments across India.
            </p>
          </div>

          {/* Interactive Pinned 4-Stage Architectural Principles Reel */}
          <PrinciplesReel />

          <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <MagneticButton>
              <Link to="/about" className="btn-cinematic-outline">
                <span>Read Full Chapter Manifesto &rarr;</span>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SCENE 03: PINNED HORIZONTAL EVENT EXHIBITION
          ==================================================================== */}
      <HorizontalScrollEvents
        events={events}
        onSelectEvent={handleOpenEventModal}
      />

      {/* ====================================================================
          SCENE 04: NIGHT LAB MAJOR DARK SECTION ("BUILD WHAT MATTERS")
          ==================================================================== */}
      <section className="dark-cinematic-scene night-lab-section" id="impact">
        <div className="night-lab-grid" />
        <div className="night-lab-glow" />

        <div className="dark-cinematic-inner" style={{ position: 'relative', zIndex: 2 }}>
          <div className="telemetry-tag" style={{ color: '#38BDF8' }}>
            <span>05 // NIGHT LAB PROTOCOLS // TELEMETRY</span>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(2.5rem, 6vw, 6rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 0.92,
                  letterSpacing: '-0.04em',
                  margin: 0,
                  color: '#FFFFFF'
                }}
              >
                BUILD WHAT <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.7)' }}>MATTERS.</span>
              </h2>
              <p style={{ color: '#94A3B8', marginTop: '1rem', fontSize: '1.15rem', maxWidth: '56ch' }}>
                Our metrics reflect relentless execution: building tangible software, empowering engineering talent, and shaping national leaders.
              </p>
            </div>

            <div>
              <MagneticButton>
                <Link to="/events" className="btn-cinematic-primary" style={{ background: '#2563EB', borderColor: 'transparent' }}>
                  <span>View Event Archives &rarr;</span>
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Animated Kinetic Statistics */}
          <div className="dark-stat-grid">
            <div className="dark-stat-item">
              <KineticCounter target={1500} suffix="+" className="dark-stat-num" />
              <span className="dark-stat-label">Active Members Across India</span>
            </div>

            <div className="dark-stat-item">
              <KineticCounter target={45} suffix="+" className="dark-stat-num" />
              <span className="dark-stat-label">National Events &amp; Summits</span>
            </div>

            <div className="dark-stat-item">
              <KineticCounter target={120} suffix="+" className="dark-stat-num" />
              <span className="dark-stat-label">Hands-on Lab Workshops</span>
            </div>

            <div className="dark-stat-item">
              <KineticCounter target={12} suffix="+" className="dark-stat-num" />
              <span className="dark-stat-label">Hackathons Completed</span>
            </div>
          </div>
        </div>

        {/* Infinite Technical Ticker */}
        <div style={{ marginTop: '5rem', position: 'relative', zIndex: 2 }}>
          <MarqueeText speed={26} />
        </div>
      </section>

      {/* ====================================================================
          SCENE 05: DIGITAL TALENT EXHIBITION (COMMITTEE SPOTLIGHT)
          ==================================================================== */}
      <section className="committee-showcase-section blueprint-paper-canvas" id="committee" style={{ padding: '120px 5vw', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="telemetry-tag">
                <span>06 // THE ARCHITECTS // EXECUTIVE DOSSIER</span>
              </div>
              <h2 className="editorial-section-title" style={{ marginTop: '0.75rem' }}>
                Leadership &amp; Talent
              </h2>
              <p className="editorial-lead">
                Student directors and technical leads powering engineering domains across the chapter.
              </p>
            </div>

            <MagneticButton>
              <Link to="/committee" className="btn-cinematic-outline">
                <span>Full Executive Directory &rarr;</span>
              </Link>
            </MagneticButton>
          </div>

          {/* Domain Exhibition Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
              marginTop: '3.5rem'
            }}
          >
            {committeeTeams.map((team, idx) => {
              const domainName = team.domainName || team.domain || team.name || 'Domain';
              const shortName = team.shortName || domainName;
              const head = team.head || team.leader || (team.members && team.members.find(m => m.isHead)) || team.members?.[0] || {};
              const memberCount = team.memberCount || team.members?.length || 0;
              const badgeColor = team.badgeColor || '#2563EB';
              const icon = team.icon || 'fa-users';
              const headImg = head.photo || head.avatar || head.image;

              return (
                <TiltCard
                  key={team.id || `dom-${idx}`}
                  className="interactive-hover blueprint-sheet-card cad-frame-wrap"
                  style={{
                    background: 'var(--surface, #FFFFFF)',
                    border: '1px solid var(--border, #E2E8F0)',
                    borderRadius: '12px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '360px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => handleOpenLeaderModal(team)}
                >
                  <div>
                    {/* Domain Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span
                        style={{
                          fontFamily: 'Space Grotesk, monospace',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: `${badgeColor}12`,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}30`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <i className={`fa-solid ${icon}`}></i>
                        {domainName}
                      </span>
                      <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.72rem', color: 'var(--light-text, #64748B)', fontWeight: 600 }}>
                        DOMAIN 0{idx + 1}
                      </span>
                    </div>

                    {/* Domain Head Spotlight Info */}
                    <div
                      style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}
                      title="Click to inspect domain leader & team roster"
                    >
                      <div style={{ position: 'relative', width: '58px', height: '58px', flexShrink: 0 }}>
                        <Avatar
                          src={headImg}
                          alt={head.name}
                          size={58}
                          style={{
                            border: `2.5px solid ${badgeColor}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-4px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: '#ffffff',
                            fontSize: '0.55rem',
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                          }}
                        >
                          HEAD
                        </span>
                      </div>

                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <h4
                          style={{
                            margin: '0 0 2px',
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'var(--heading, #0F172A)'
                          }}
                        >
                          {head.name || `${domainName} Head`}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: badgeColor }}>
                          {head.role || `${shortName} Head`}
                        </p>
                        {head.branch && (
                          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--light-text, #64748B)' }}>
                            {head.year ? `${head.year} Year • ` : ''}{head.branch}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Domain Description / Tagline */}
                    <p style={{ fontSize: '0.86rem', color: 'var(--body, #475569)', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
                      {head.tagline ? `"${head.tagline}"` : (team.description || `Leading ${domainName} initiatives and student projects.`)}
                    </p>
                  </div>

                  {/* Team Members Avatar Stack & CTA Footer */}
                  <div>
                    {/* Teammates Avatar Stack Preview */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'var(--bg-input, #F8FAFC)',
                        borderRadius: '8px',
                        border: '1px solid var(--border, #E2E8F0)',
                        marginBottom: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {(team.members || []).slice(0, 4).map((tm, tIdx) => (
                          <div
                            key={tm.id || `${tIdx}`}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              marginLeft: tIdx > 0 ? '-6px' : '0',
                              border: '2px solid #ffffff',
                              overflow: 'hidden',
                              background: '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              color: '#2563EB',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                          >
                            {(tm.photo || tm.avatar) ? (
                              <img src={tm.photo || tm.avatar} alt={tm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              tm.name ? tm.name.slice(0, 1) : '?'
                            )}
                          </div>
                        ))}
                        {team.members && team.members.length > 4 && (
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              marginLeft: '-6px',
                              border: '2px solid #ffffff',
                              background: badgeColor,
                              color: '#ffffff',
                              fontSize: '0.6rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            +{team.members.length - 4}
                          </div>
                        )}
                      </div>

                      <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.76rem', fontWeight: 700, color: 'var(--heading, #0F172A)' }}>
                        {memberCount} Team Members
                      </span>
                    </div>

                    <div
                      style={{
                        borderTop: '1px solid var(--border, #E2E8F0)',
                        paddingTop: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.76rem', color: 'var(--light-text, #64748B)' }}>
                        <i className="fa-solid fa-users" style={{ marginRight: '6px', color: badgeColor }}></i>
                        {memberCount} Members
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLeaderModal(team);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: badgeColor,
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>Inspect Domain Roster</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SCENE 07: FINAL MONUMENTAL CTA & CONTACT
          ==================================================================== */}
      <section className="final-contact-scene blueprint-paper-canvas" id="contact" style={{ padding: '120px 5vw', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="telemetry-tag">
            <span>08 // TRANSMISSION // INITIATION</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '4rem',
              marginTop: '2rem'
            }}
          >
            {/* Left Statement */}
            <div>
              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: 'var(--heading, #0F172A)',
                  margin: '0 0 1.5rem 0'
                }}
              >
                READY TO BUILD{' '}
                <span className="outline-text" style={{ display: 'block' }}>
                  THE FUTURE?
                </span>
              </h2>

              <p className="editorial-lead" style={{ marginBottom: '2.5rem' }}>
                Whether you want to collaborate on a national initiative, launch an engineering chapter
                at your college, or partner as a mentor, our lines of communication are open.
              </p>

              {/* Direct Info Telemetry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border, #E2E8F0)',
                    borderRadius: '6px',
                    background: 'var(--surface, #FFFFFF)'
                  }}
                >
                  <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.72rem', color: 'var(--light-text, #64748B)', textTransform: 'uppercase' }}>
                    EMAIL INQUIRIES
                  </span>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--heading, #0F172A)', marginTop: '4px' }}>
                    hello@engineeringindia.org
                  </div>
                </div>

                <div
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border, #E2E8F0)',
                    borderRadius: '6px',
                    background: 'var(--surface, #FFFFFF)'
                  }}
                >
                  <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.72rem', color: 'var(--light-text, #64748B)', textTransform: 'uppercase' }}>
                    CAMPUS HEADQUARTERS
                  </span>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--heading, #0F172A)', marginTop: '4px' }}>
                    SVPCET Campus, Nagpur, Maharashtra, India
                  </div>
                </div>
              </div>
            </div>

            {/* Right Architectural Form */}
            <div
              style={{
                background: 'var(--surface, #FFFFFF)',
                border: '1px solid var(--border, #E2E8F0)',
                borderRadius: '8px',
                padding: '2.5rem',
                boxShadow: '0 15px 45px rgba(15, 23, 42, 0.06)'
              }}
            >
              <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--primary, #2563EB)', textTransform: 'uppercase' }}>
                DIRECT TRANSMISSION
              </span>

              <form onSubmit={handleContactSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label
                    htmlFor="cinematic-name"
                    style={{ display: 'block', fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="cinematic-name"
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border, #CBD5E1)',
                      borderRadius: '4px',
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      color: 'var(--heading, #0F172A)'
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cinematic-email"
                    style={{ display: 'block', fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}
                  >
                    Email Address *
                  </label>
                  <input
                    id="cinematic-email"
                    type="email"
                    required
                    placeholder="maya@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border, #CBD5E1)',
                      borderRadius: '4px',
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      color: 'var(--heading, #0F172A)'
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cinematic-subject"
                    style={{ display: 'block', fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}
                  >
                    Subject / Objective *
                  </label>
                  <input
                    id="cinematic-subject"
                    type="text"
                    required
                    placeholder="e.g. Starting a College Chapter"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border, #CBD5E1)',
                      borderRadius: '4px',
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      color: 'var(--heading, #0F172A)'
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cinematic-message"
                    style={{ display: 'block', fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}
                  >
                    Message Transmission *
                  </label>
                  <textarea
                    id="cinematic-message"
                    rows="4"
                    required
                    placeholder="Describe your initiative or query..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border, #CBD5E1)',
                      borderRadius: '4px',
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      color: 'var(--heading, #0F172A)',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <MagneticButton style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn-cinematic-primary"
                    disabled={sendingContact}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{sendingContact ? 'Transmitting...' : 'Send Transmission'}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </MagneticButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          MODALS INTEGRATION (PRESERVED FUNCTIONALITY)
          ==================================================================== */}
      {selectedEvent && (
        <EventRegisterModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSuccess={() => {
            addToast('Registration confirmed for event!', 'success');
          }}
        />
      )}

      {selectedArticle && (
        <NewsReaderModal
          item={selectedArticle}
          isOpen={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
          onLike={(id) => {
            api.likeAnnouncement(id)
              .then((res) => {
                setNews((prev) =>
                  prev.map((item) => (item.id === id ? { ...item, likes: res.likes } : item))
                );
                setSelectedArticle((prev) => (prev ? { ...prev, likes: res.likes } : null));
              })
              .catch(() => {});
          }}
        />
      )}

      {selectedDomain && (
        <LeaderModal
          domain={selectedDomain}
          isOpen={isLeaderModalOpen}
          onClose={() => setIsLeaderModalOpen(false)}
        />
      )}
    </div>
  );
}
