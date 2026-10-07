import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import EventRegisterModal from '../components/EventRegisterModal';
import { useToast } from '../components/Toast';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import { useLenis } from '../components/SmoothScroll';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/events-page.css';

const GALLERY_DATA = [
  {
    title: 'Engineering India Meet',
    description: 'A memorable gathering where students, innovators, and members of the community came together to share ideas, experiences, and new possibilities.',
    date: 'Engineering India • Community Meet',
    image: '/assets_events/gallery1.jpg'
  },
  {
    title: 'Innovation & Ideas',
    description: 'A creative space where students showcased their ideas, discussed possibilities, and explored how engineering creates meaningful impact.',
    date: 'Engineering India • Innovation',
    image: '/assets_events/featured-event.jpg'
  },
  {
    title: 'Student Community',
    description: 'An energetic moment from our student community, bringing together collaboration, conversations, and shared learning.',
    date: 'Engineering India • Students',
    image: '/assets_events/cyber.jpg'
  },
  {
    title: 'Campus Moments',
    description: 'A glimpse into the people and moments that make Engineering India more than just an initiative — it is a growing movement.',
    date: 'Engineering India • Campus',
    image: '/assets_events/community-drive.jpg'
  },
  {
    title: 'Team Engineering India',
    description: 'The people behind the community working together, contributing ideas, and helping create meaningful experiences.',
    date: 'Engineering India • Team',
    image: '/assets_events/cloud.jpg'
  },
  {
    title: 'Building Together',
    description: 'A moment that represents collaboration, creativity, and the spirit of building something meaningful together.',
    date: 'Engineering India • Collaboration',
    image: '/assets_events/ai.jpg'
  }
];

const MEGA_SLIDES = [
  {
    title: 'National InnoHack 2026',
    tag: 'Flagship Event',
    date: '15–17 September 2026',
    location: 'Main Auditorium & Virtual',
    description: '48-hour national hackathon bringing together 500+ students to build solutions for real-world engineering challenges.',
    image: '/assets_events/hackathon.jpg',
    category: 'hackathon'
  },
  {
    title: 'AI Innovation Summit 2026',
    tag: 'National Summit',
    date: '05 October 2026',
    location: 'Tech Hub Arena',
    description: 'Explore neural networks, generative AI, robotic systems, and intelligent edge computing with industry leaders.',
    image: '/assets_events/Ai Innovation.jpg',
    category: 'seminar'
  },
  {
    title: 'National Code Sprint 2026',
    tag: 'Competitive Coding',
    date: '28 December 2026',
    location: 'Online Coding Arena',
    description: 'Algorithm challenges, speed-coding rounds, and collaborative architecture problem solving with cash prizes.',
    image: '/assets_events/code sprint.png',
    category: 'hackathon'
  }
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ei_saved_events') || '[]');
    } catch {
      return [];
    }
  });

  // Mega slide state
  const [currentMegaSlide, setCurrentMegaSlide] = useState(0);

  // Creative Gallery state
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Live countdown timer state
  const [countdown, setCountdown] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  const { addToast } = useToast();
  const eventsSectionRef = useRef(null);
  const lenis = useLenis();

  // Fetch events from API
  const fetchEvents = () => {
    api.getEvents(activeFilter, searchQuery)
      .then(res => setEvents(res.data || []))
      .catch(err => console.error('Error loading events:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [activeFilter, searchQuery]);

  // Mega slider auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMegaSlide(prev => (prev + 1) % MEGA_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Live countdown timer
  useEffect(() => {
    const targetDate = new Date('December 15, 2026 09:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSaveEvent = (eventId) => {
    let updated;
    if (savedEvents.includes(eventId)) {
      updated = savedEvents.filter(id => id !== eventId);
      addToast('Event removed from saved items', 'info');
    } else {
      updated = [...savedEvents, eventId];
      addToast('Event saved to favorites! ♥', 'success');
    }
    setSavedEvents(updated);
    localStorage.setItem('ei_saved_events', JSON.stringify(updated));
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsRegisterOpen(true);
  };

  const handleRegisterSuccess = () => {
    fetchEvents();
  };

  const scrollToEvents = () => {
    if (lenis && eventsSectionRef.current) {
      lenis.scrollTo(eventsSectionRef.current, { offset: -90 });
    } else if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'seminar', label: 'Seminars' },
    { id: 'community', label: 'Community' }
  ];

  const visibleEvents = events.slice(0, visibleCount);
  const containerRef = useScrollReveal([visibleEvents]);

  return (
    <div className="events-page-container blueprint-paper-canvas" ref={containerRef} style={{ position: 'relative' }}>
      {/* Top CAD Architectural Millimeter Ruler */}
      <div className="blueprint-ruler-top">
        <span>04 // EVENT BLUEPRINT ARCHIVE // EI-CATALOG</span>
        <span>SYS_STATUS: ACTIVE</span>
        <span>INDEX: 01 – {String(events.length).padStart(2, '0')}</span>
      </div>

      {/* LIVE ANNOUNCEMENT MARQUEE BAR */}
      <div className="live-bar">
        <div className="live-track">
          <span>
            🔴 LIVE NOW • Registrations Open for InnoHack 2026 • AI &amp; Robotics Summit •
            Full Stack Bootcamp • Community Impact Drive • Technology with Purpose •
          </span>
          <span>
            🔴 LIVE NOW • Registrations Open for InnoHack 2026 • AI &amp; Robotics Summit •
            Full Stack Bootcamp • Community Impact Drive • Technology with Purpose •
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-shape shape1"></div>
        <div className="hero-shape shape2"></div>
        <div className="hero-shape shape3"></div>

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="telemetry-tag" style={{ marginBottom: '1rem' }}>
              <span>04 // DIRECTORY &amp; TIMELINE // CAD-SPEC</span>
            </div>
            <div className="hero-tag">Technology • Innovation • Community</div>
            <h1 className="editorial-section-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Building Technology <span className="outline-text">For Tomorrow</span>
            </h1>
            <p className="editorial-lead" style={{ marginBottom: '2rem' }}>
              Empowering students through innovation, collaboration, and meaningful community
              impact. Join workshops, hackathons, seminars, and social initiatives designed to
              create real-world change.
            </p>
            <div className="hero-buttons">
              <MagneticButton>
                <button onClick={scrollToEvents} className="btn-cinematic-primary" type="button">
                  <span>Explore Events ↓</span>
                </button>
              </MagneticButton>
              <MagneticButton>
                <button
                  onClick={() => handleRegisterClick(events[0] || MEGA_SLIDES[0])}
                  className="btn-cinematic-outline"
                  type="button"
                >
                  <span>Register Next &rarr;</span>
                </button>
              </MagneticButton>
            </div>
          </div>

          {/* FLOATING CLUB EVENT WINDOW */}
          <div className="hero-image">
            <TiltCard className="club-event-window" maxTilt={2.5}>
              <div className="event-window-glow"></div>
              <div className="club-event-top">
                <span className="club-event-badge">🔥 Trending</span>
                <span className="club-event-live">● UPCOMING</span>
              </div>
              <div className="club-event-content">
                <span className="club-event-mini">ENGINEERING INDIA PRESENTS</span>
                <h3>Summer Mega Fest 2026</h3>
                <p>
                  A nationwide celebration of innovation, open-source projects, and
                  unforgettable tech community moments.
                </p>
                <div className="club-event-details">
                  <span>
                    <i className="fa-solid fa-calendar"></i> 15–17 July 2026
                  </span>
                  <span>
                    <i className="fa-solid fa-location-dot"></i> SVPCET Innovation Hub
                  </span>
                </div>
                <div className="club-event-btn-wrapper">
                  <button
                    onClick={() => handleRegisterClick({ id: 'event-hackathon', title: 'Summer Mega Fest 2026', date: '15-17 July 2026', location: 'SVPCET Innovation Hub', badge: 'Mega Fest' })}
                    className="club-event-btn"
                  >
                    Register Free &rarr;
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* MEGA FEATURED CAROUSEL */}
      <section className="featured-event">
        <div className="container">
          <div className="featured-card mega-event-card events-featured-card">
            <div className="mega-carousel-track">
              {MEGA_SLIDES.map((slide, idx) => (
                <article
                  key={idx}
                  className={`mega-slide ${idx === currentMegaSlide ? 'active' : ''}`}
                >
                  <div className="featured-content">
                    <div className="event-label">🔥 {slide.tag}</div>
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                    <div className="featured-info">
                      <div>
                        <i className="fa-solid fa-calendar"></i> {slide.date}
                      </div>
                      <div>
                        <i className="fa-solid fa-location-dot"></i> {slide.location}
                      </div>
                    </div>
                    <div className="featured-buttons">
                      <button
                        onClick={() => handleRegisterClick({ id: `mega-${idx}`, title: slide.title, date: slide.date, location: slide.location, badge: slide.tag })}
                        className="btn primary"
                      >
                        Register for Event
                      </button>
                      <button onClick={scrollToEvents} className="btn secondary">
                        View Schedule
                      </button>
                    </div>
                  </div>
                  <div className="featured-image">
                    <img src={slide.image} alt={slide.title} />
                    <div className="mega-status">🔥 Featured</div>
                  </div>
                </article>
              ))}
            </div>

            <button
              className="mega-arrow mega-prev"
              onClick={() => setCurrentMegaSlide((currentMegaSlide - 1 + MEGA_SLIDES.length) % MEGA_SLIDES.length)}
              aria-label="Previous mega slide"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              className="mega-arrow mega-next"
              onClick={() => setCurrentMegaSlide((currentMegaSlide + 1) % MEGA_SLIDES.length)}
              aria-label="Next mega slide"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            <div className="mega-dots">
              {MEGA_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  className={`mega-dot ${idx === currentMegaSlide ? 'active' : ''}`}
                  onClick={() => setCurrentMegaSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE COUNTDOWN SECTION */}
      <section className="countdown-section" data-reveal="fade-up">
        <div className="container">
          <div className="countdown-card countdown-wrapper">
            <div className="countdown-text">
              <span className="countdown-tag">COUNTDOWN TO MEGA TECH FEST</span>
              <h2 className="countdown-title">Next Major Summit Starts In</h2>
              <p>Featured event countdown — get ready to learn, connect and create.</p>
            </div>
            <div className="countdown countdown-timer">
              <div className="time-box">
                <h2 className="number" id="days">{countdown.days}</h2>
                <p className="label">Days</p>
              </div>
              <div className="time-box">
                <h2 className="number" id="hours">{countdown.hours}</h2>
                <p className="label">Hours</p>
              </div>
              <div className="time-box">
                <h2 className="number" id="minutes">{countdown.minutes}</h2>
                <p className="label">Minutes</p>
              </div>
              <div className="time-box">
                <h2 className="number" id="seconds">{countdown.seconds}</h2>
                <p className="label">Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS COUNTER SECTION */}
      <section className="stats-section" data-reveal="fade-up">
        <div className="container">
          <div className="stats-grid">
            <TiltCard className="stat-card">
              <i className="fa-solid fa-users"></i>
              <h2 className="stat-number">1,500+</h2>
              <p className="stat-label">Active Members</p>
            </TiltCard>
            <TiltCard className="stat-card">
              <i className="fa-solid fa-calendar-check"></i>
              <h2 className="stat-number">45+</h2>
              <p className="stat-label">Events Hosted</p>
            </TiltCard>
            <TiltCard className="stat-card">
              <i className="fa-solid fa-laptop-code"></i>
              <h2 className="stat-number">120+</h2>
              <p className="stat-label">Hands-on Workshops</p>
            </TiltCard>
            <TiltCard className="stat-card">
              <i className="fa-solid fa-trophy"></i>
              <h2 className="stat-number">12+</h2>
              <p className="stat-label">National Hackathons</p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* MAIN EVENTS DIRECTORY SECTION */}
      <section className="events-section" id="events" ref={eventsSectionRef}>
        <div className="container">
          <div className="section-title" data-reveal="fade-up">
            <span>OUR EVENTS</span>
            <h2>Discover Upcoming Events</h2>
            <p>
              Explore workshops, hackathons, seminars, and community activities designed to
              help you learn, build, and grow.
            </p>
          </div>

          {/* Search Bar */}
          <div className="events-top" data-reveal="fade-up">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Search events by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="filter-buttons" data-reveal="fade-up">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveFilter(cat.id);
                  setVisibleCount(3);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="events-grid">
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', fontFamily: 'Space Grotesk, monospace' }}>
                // INITIALIZING TELEMETRY &amp; EVENT SCHEMATICS...
              </p>
            ) : visibleEvents.length > 0 ? (
              visibleEvents.map((event, idx) => {
                const isSaved = savedEvents.includes(event.id);
                return (
                  <TiltCard
                    key={event.id || idx}
                    className="event-card blueprint-sheet-card cad-frame-wrap"
                    data-category={event.category}
                  >
                    <div className="cad-corner-marker tl" />
                    <div className="cad-corner-marker tr" />
                    <div className="cad-corner-marker bl" />
                    <div className="cad-corner-marker br" />

                    <div className="blueprint-spec-header">
                      <span>EVENT_{String(idx + 1).padStart(3, '0')} // CAD_SPEC</span>
                      <span>{event.category?.toUpperCase() || 'CORE'}</span>
                    </div>

                    <div className="event-image" style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={event.image ? (event.image.startsWith('/') ? event.image : `/${event.image}`) : '/assets_events/gallery1.jpg'}
                        alt={event.title}
                        onError={(e) => {
                          e.target.src = '/assets_events/gallery1.jpg';
                        }}
                      />
                      <div className="event-badge">{event.badge || event.category}</div>
                    </div>

                    <div className="event-content">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-description">{event.description}</p>

                      <div className="event-details">
                        <p>
                          <i className="fa-solid fa-calendar"></i> {event.date}
                        </p>
                        <p>
                          <i className="fa-solid fa-location-dot"></i> {event.location}
                        </p>
                        {event.registered_count !== undefined && (
                          <p style={{ color: 'var(--blueprint-blue, #155EEF)', fontWeight: 600 }}>
                            <i className="fa-solid fa-users"></i> {event.registered_count} Registered
                          </p>
                        )}
                      </div>

                      <div className="event-actions">
                        <button
                          onClick={() => handleRegisterClick(event)}
                          className="btn-small primary"
                        >
                          Register Now
                        </button>
                        <button
                          onClick={() => toggleSaveEvent(event.id)}
                          className={`btn-small outline ${isSaved ? 'saved' : ''}`}
                        >
                          {isSaved ? '♥ Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px 0' }}>
                No events found matching your criteria.
              </p>
            )}
          </div>

          {/* Load More Button */}
          {visibleCount < events.length && (
            <div className="load-more-wrapper">
              <button
                id="loadMoreBtn"
                className="btn secondary"
                onClick={() => setVisibleCount(prev => prev + 3)}
              >
                Load More Events &darr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* EVENT TIMELINE / SCHEDULE */}
      <section className="timeline-section" id="timeline">
        <div className="container">
          <div className="section-title">
            <span>EVENT JOURNEY</span>
            <h2>Upcoming Schedule</h2>
            <p>
              Stay updated with our exciting lineup of technical and community events
              throughout the year.
            </p>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">January 20, 2026</span>
                <h3>Full Stack Development Bootcamp</h3>
                <p>Learn HTML, CSS, JavaScript, React, and Node.js through practical sessions.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">September 15–17, 2026</span>
                <h3>InnoHack 2026</h3>
                <p>Compete in our 48-hour national student hackathon with mentors from industry.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">October 5, 2026</span>
                <h3>AI &amp; Robotics Workshop</h3>
                <p>Build real robotic controllers and explore machine learning deployment pipelines.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">November 12, 2026</span>
                <h3>Community Digital Impact Drive</h3>
                <p>Volunteer to spread digital literacy and tech education in regional schools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREATIVE GALLERY SECTION */}
      <section className="gallery-section" id="gallery">
        <div className="container">
          <div className="section-title">
            <span>CAMPUS HIGHLIGHTS</span>
            <h2>Creative Moments &amp; Gallery</h2>
            <p>A glimpse into our vibrant engineering culture, workshops, and community.</p>
          </div>

          <div className="gallery-wrapper">
            <div className="gallery-main">
              <img
                id="galleryMainImage"
                src={GALLERY_DATA[activeGalleryIndex].image}
                alt={GALLERY_DATA[activeGalleryIndex].title}
              />
              <div className="gallery-info">
                <span id="galleryDate">{GALLERY_DATA[activeGalleryIndex].date}</span>
                <h3 id="galleryTitle">{GALLERY_DATA[activeGalleryIndex].title}</h3>
                <p id="galleryDescription">{GALLERY_DATA[activeGalleryIndex].description}</p>
                <div className="gallery-progress">
                  <span
                    style={{
                      width: `${((activeGalleryIndex + 1) / GALLERY_DATA.length) * 100}%`
                    }}
                  ></span>
                </div>
              </div>
            </div>

            <div className="gallery-thumbs">
              {GALLERY_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className={`gallery-thumb ${idx === activeGalleryIndex ? 'active' : ''}`}
                  onClick={() => setActiveGalleryIndex(idx)}
                >
                  <img src={item.image} alt={item.title} />
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={scrollToEvents} className="btn secondary gallery-explore">
                Explore All Events &uarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION MODAL */}
      <EventRegisterModal
        event={selectedEvent}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}
