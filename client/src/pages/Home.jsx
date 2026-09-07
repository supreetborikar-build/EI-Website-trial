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

const HERO_IMAGES = [
  { src: '/assets/images/hero/EI.png', title: 'National Movement', tag: 'Initiative' },
  { src: '/assets/images/hero/future.png', title: 'Future of Engineering', tag: 'Vision 2030' },
  { src: '/assets/images/hero/hackathon.png', title: 'National InnoHack', tag: 'Competition' },
  { src: '/assets/images/hero/project.png', title: 'Student Innovation', tag: 'R&D Labs' },
  { src: '/assets/images/hero/Student.png', title: 'Engineering Students', tag: 'Community' },
  { src: '/assets/images/hero/Workshops.png', title: 'Hands-on Labs', tag: 'Skill Sessions' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [committeeTeams, setCommitteeTeams] = useState([]);
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
      .then((res) => setCommitteeTeams(res.data || []))
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem',
              marginTop: '3.5rem'
            }}
          >
            {committeeTeams.slice(0, 4).map((team) => (
              <TiltCard
                key={team.id}
                className="interactive-hover"
                style={{
                  background: 'var(--surface, #FFFFFF)',
                  border: '1px solid var(--border, #E2E8F0)',
                  borderRadius: '8px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '340px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'Space Grotesk, monospace',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: 'rgba(37, 99, 235, 0.08)',
                        color: 'var(--primary, #2563EB)'
                      }}
                    >
                      {team.domain}
                    </span>
                    <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.75rem', opacity: 0.5 }}>
                      TEAM
                    </span>
                  </div>

                  <div
                    style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLeaderModal(team);
                    }}
                    title="Click to inspect leader & team roster"
                  >
                    <Avatar
                      src={team.leader?.avatar || team.leader?.image}
                      alt={team.leader?.name}
                      size={56}
                      style={{
                        border: '2px solid var(--border, #E2E8F0)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'var(--heading, #0F172A)',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {team.leader?.name}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: 'var(--light-text, #64748B)' }}>
                        {team.leader?.title}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--body, #475569)', lineHeight: 1.5, margin: 0 }}>
                    {team.leader?.bio}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '2rem',
                    borderTop: '1px solid var(--border, #E2E8F0)',
                    paddingTop: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.78rem', color: 'var(--light-text, #64748B)' }}>
                    {team.teammates?.length || 0} Core Members
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
                      color: 'var(--primary, #2563EB)',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Inspect Domain Roster &rarr;
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SCENE 06: EDITORIAL MAGAZINE NEWS SPREAD
          ==================================================================== */}
      <section className="editorial-news-section blueprint-paper-canvas" id="news" style={{ padding: '120px 5vw', position: 'relative', borderTop: '1px solid var(--cad-border-subtle, rgba(17, 19, 21, 0.12))' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="telemetry-tag">
                <span>07 // JOURNAL // DISPATCHES &amp; BREAKTHROUGHS</span>
              </div>
              <h2 className="editorial-section-title" style={{ marginTop: '0.75rem' }}>
                The Engineering India Journal
              </h2>
              <p className="editorial-lead">
                Research breakdowns, campus dispatches, technical insights, and community breakthroughs.
              </p>
            </div>

            <MagneticButton>
              <Link to="/news" className="btn-cinematic-outline">
                <span>All Announcements ({news.length}) &rarr;</span>
              </Link>
            </MagneticButton>
          </div>

          {/* Asymmetric Editorial Spread */}
          <div className="editorial-news-spread">
            {/* Left Dominant Feature */}
            {featuredNews && (
              <div
                className="featured-editorial-card interactive-hover"
                onClick={() => handleOpenArticleModal(featuredNews)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={featuredNews.image?.startsWith('/') ? featuredNews.image : `/${featuredNews.image || 'assets_news/hackathon.jpg'}`}
                    alt={featuredNews.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                    onError={(e) => {
                      e.target.src = '/assets_news/hackathon.jpg';
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1.25rem',
                      background: '#0F172A',
                      color: '#FFFFFF',
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}
                  >
                    FEATURED DISPATCH
                  </span>
                </div>

                <div style={{ padding: '2rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.78rem',
                      color: 'var(--light-text, #64748B)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <span>{featuredNews.date}</span>
                    <span>•</span>
                    <span>{featuredNews.read_time || '4 min read'}</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      lineHeight: 1.25,
                      color: 'var(--heading, #0F172A)',
                      margin: '0 0 1rem 0'
                    }}
                  >
                    {featuredNews.title}
                  </h3>

                  <p style={{ color: 'var(--body, #475569)', lineHeight: 1.6, fontSize: '0.96rem', margin: '0 0 1.5rem 0' }}>
                    {featuredNews.excerpt}
                  </p>

                  <span
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: 'var(--primary, #2563EB)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    Read Full Story &rarr;
                  </span>
                </div>
              </div>
            )}

            {/* Right Secondary Dispatch List */}
            <div className="secondary-dispatch-list">
              {secondaryNews.map((item) => (
                <div
                  key={item.id}
                  className="dispatch-item"
                  onClick={() => handleOpenArticleModal(item)}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'Space Grotesk, monospace',
                        fontSize: '0.72rem',
                        color: 'var(--primary, #2563EB)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        marginBottom: '0.35rem'
                      }}
                    >
                      {item.category_label || item.category || 'Article'} • {item.date}
                    </div>

                    <h4
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        margin: 0,
                        color: 'var(--heading, #0F172A)',
                        lineHeight: 1.35
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>

                  <span style={{ fontSize: '1.25rem', color: 'var(--primary, #2563EB)', marginLeft: '1rem' }}>
                    &rarr;
                  </span>
                </div>
              ))}
            </div>
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
