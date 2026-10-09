import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
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

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentMegaSlide, setCurrentMegaSlide] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const eventsSectionRef = useRef(null);
  const lenis = useLenis();

  // Authoritative single source of truth fallback
  const FALLBACK_EVENTS = [
    {
      id: 'promptwars-2026',
      title: 'PromptWars 2026',
      category: 'hackathon',
      date: '4 October 2026',
      location: 'SVPCET, Nagpur',
      description: "Engineering India's AI Vibe-Coding Hackathon brought together participants to transform ideas into working solutions through creativity, rapid development, and problem-solving. Organized in collaboration with GDG Nagpur and hack2skill, the event marked a significant milestone as the first event of its kind in Nagpur, featuring large-scale participation and an energetic innovation-driven atmosphere.",
      image: '/assets_events/promptwars-2026.jpg',
      badge: 'Hackathon'
    },
    {
      id: 'alumni-meet',
      title: 'Alumni Meet',
      category: 'community',
      date: '2 May 2026',
      location: '',
      description: "Engineering India coordinators connected with the founding batch of the Pallotti chapter for a memorable alumni gathering filled with cricket, games, and meaningful conversations. The interaction offered valuable career perspectives, insights into professional journeys, and an opportunity to strengthen bonds between alumni and current coordinators.",
      image: '/assets_events/alumni-meet.jpeg',
      badge: 'Alumni'
    },
    {
      id: 'cdp-industry-visit',
      title: 'CDP — Industry Visit',
      category: 'seminar',
      date: '6 January 2026',
      location: 'Trust Systems and Software Ltd., IT Park Road, Pratap Nagar, Nagpur',
      description: "As part of the Coordinator Development Plan, the Engineering India SVPCET team visited Trust Systems and Software Ltd. Students explored the company's working environment, learned about technologies used in industry, and interacted with HR to understand hiring expectations, essential skills, and career opportunities.",
      image: '/assets_events/cdp-industry-visit.jpg',
      badge: 'Industry Visit'
    },
    {
      id: 'induction-programme',
      title: 'Induction Programme',
      category: 'seminar',
      date: '21 August 2025',
      location: 'SVPCET, Nagpur',
      description: "Engineering India welcomed first-year students and introduced them to the chapter's vision, initiatives, and upcoming events. The session highlighted EI's technical and social contributions, encouraged students to become involved, and was graced by Ms. Mrunali Buradkar, Pallotti EI Faculty Coordinator.",
      image: '/assets_events/induction-programme.JPG',
      badge: 'Induction'
    },
    {
      id: 'rangittalim-1',
      title: 'Rangittalim 1.0',
      category: 'community',
      date: '27 July 2025',
      location: 'Omkar Nagar, Nagpur',
      description: "Under the Light of Learning initiative, Engineering India coordinators collaborated with Youth for Seva, Nagpur, to engage with children in Omkar Nagar. Through lessons, poems, games, and the distribution of books and stationery, the team created a joyful learning environment while connecting with families and understanding community needs.",
      image: '/assets_events/rangittalim-1.JPG',
      badge: 'Community'
    },
    {
      id: 'rangittalim-2',
      title: 'Rangittalim 2.0',
      category: 'community',
      date: '2 August 2026',
      location: 'Near London Street, Nagpur',
      description: "Engineering India celebrated Friendship Day with children from a local community through educational games, creative learning activities, and moments of shared fun. The initiative encouraged children to explore new ideas, understand the value of friendship, and build meaningful connections in a warm and inclusive environment.",
      image: '/assets_events/rangittalim-2.jpg',
      badge: 'Community'
    },
    {
      id: 'seva-sankalp',
      title: 'Seva Sankalp',
      category: 'community',
      date: '16 October 2025',
      location: 'Nalanda Vastistar Vruddhashram, Binaki, Nagpur',
      description: "In collaboration with EI RBU, Engineering India coordinators visited an old-age home to spend quality time with elderly residents. Through heartfelt conversations, shared life experiences, old songs, and a cake-cutting celebration, the visit promoted companionship, respect, and compassion across generations.",
      image: '/assets_events/seva-sankalp.jpeg',
      badge: 'Community'
    }
  ];

  const fetchEvents = () => {
    setLoading(true);
    api.getEvents(activeFilter, searchQuery)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setEvents(res.data);
        } else {
          if (!searchQuery && activeFilter === 'all') {
             setEvents(FALLBACK_EVENTS);
          } else {
             setEvents([]);
          }
        }
      })
      .catch(err => {
        console.error('Error loading events:', err);
        setEvents(FALLBACK_EVENTS);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [activeFilter, searchQuery]);

  const displayEvents = events.length > 0 ? events : (!loading && !searchQuery && activeFilter === 'all' ? FALLBACK_EVENTS : events);

  useEffect(() => {
    if (displayEvents.length === 0) return;
    const timer = setInterval(() => {
      setCurrentMegaSlide(prev => (prev + 1) % displayEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayEvents.length]);

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

  const containerRef = useScrollReveal([displayEvents]);

  const getImagePath = (imgPath) => {
    if (!imgPath) return '/assets_events/gallery1.jpg';
    return imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
  };

  return (
    <div className="events-page-container blueprint-paper-canvas" ref={containerRef} style={{ position: 'relative' }}>
      {/* Top CAD Architectural Millimeter Ruler */}
      <div className="blueprint-ruler-top">
        <span>04 // EVENT BLUEPRINT ARCHIVE // EI-CATALOG</span>
        <span>SYS_STATUS: ACTIVE</span>
        <span>INDEX: 01 – {String(displayEvents.length).padStart(2, '0')}</span>
      </div>

      {/* HERO SECTION */}
      <section className="hero" id="home" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
        <div className="hero-shape shape1"></div>
        <div className="hero-shape shape2"></div>
        <div className="hero-shape shape3"></div>

        <div className="container hero-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="hero-content" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '800px' }}>
            <div className="telemetry-tag" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
              <span>04 // OUR JOURNEY // IMPACT</span>
            </div>
            <div className="hero-tag">Technology • Innovation • Community</div>
            <h1 className="editorial-section-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Successfully Completed <span className="outline-text">Events</span>
            </h1>
            <p className="editorial-lead" style={{ marginBottom: '2rem', margin: '0 auto 2rem auto' }}>
              Explore the initiatives, workshops, hackathons, and community outreach programs 
              where our chapter turned ideas into action.
            </p>
            <div className="hero-buttons" style={{ justifyContent: 'center' }}>
              <MagneticButton>
                <button onClick={scrollToEvents} className="btn-cinematic-primary" type="button">
                  <span>Explore Timeline ↓</span>
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* MEGA FEATURED CAROUSEL - Real Events */}
      {displayEvents.length > 0 && (
      <section className="featured-event">
        <div className="container">
          <div className="featured-card mega-event-card events-featured-card">
            <div className="mega-carousel-track">
              {displayEvents.map((slide, idx) => (
                <article
                  key={idx}
                  className={`mega-slide ${idx === currentMegaSlide ? 'active' : ''}`}
                >
                  <div className="featured-content">
                    {slide.badge && <div className="event-label">🔥 {slide.badge}</div>}
                    <h2>{slide.title}</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{slide.description}</p>
                    <div className="featured-info" style={{ marginTop: '1.5rem' }}>
                      <div>
                        <i className="fa-solid fa-calendar"></i> {slide.date}
                      </div>
                      {slide.location && (
                      <div>
                        <i className="fa-solid fa-location-dot"></i> {slide.location}
                      </div>
                      )}
                    </div>
                  </div>
                  <div className="featured-image">
                    <img src={getImagePath(slide.image)} alt={slide.title} />
                    <div className="mega-status">🎯 Completed</div>
                  </div>
                </article>
              ))}
            </div>

            <button
              className="mega-arrow mega-prev"
              onClick={() => setCurrentMegaSlide((currentMegaSlide - 1 + displayEvents.length) % displayEvents.length)}
              aria-label="Previous event"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              className="mega-arrow mega-next"
              onClick={() => setCurrentMegaSlide((currentMegaSlide + 1) % displayEvents.length)}
              aria-label="Next event"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            <div className="mega-dots">
              {displayEvents.map((_, idx) => (
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
      )}

      {/* MAIN EVENTS DIRECTORY SECTION */}
      <section className="events-section" id="events" ref={eventsSectionRef}>
        <div className="container">
          <div className="section-title" data-reveal="fade-up">
            <span>OUR IMPACT</span>
            <h2>Our Journey, Our Impact</h2>
            <p>
              A complete archive of the events, workshops, and community activities that define the Engineering India chapter.
            </p>
          </div>

          {/* Search Bar */}
          <div className="events-top" data-reveal="fade-up">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Search past events by title or keyword..."
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
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <style>{`
            .completed-events-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
              gap: 2.5rem;
              margin-top: 3rem;
            }
            .completed-event-card {
              display: flex;
              flex-direction: column;
              height: 100%;
            }
            .completed-event-image-wrapper {
              height: 240px;
              width: 100%;
              overflow: hidden;
              position: relative;
            }
            .completed-event-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.5s ease;
            }
            .completed-event-card:hover .completed-event-image {
              transform: scale(1.05);
            }
            .completed-event-content {
              padding: 2rem;
              display: flex;
              flex-direction: column;
              flex-grow: 1;
            }
            .completed-event-title {
              font-family: 'Outfit', sans-serif;
              font-size: 1.6rem;
              font-weight: 700;
              margin-bottom: 1rem;
              color: var(--heading, #111315);
              line-height: 1.3;
            }
            .completed-event-description {
              font-size: 1.05rem;
              line-height: 1.6;
              color: var(--body, #334155);
              margin-bottom: 1.5rem;
              flex-grow: 1;
            }
            .completed-event-details {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              font-family: 'Space Grotesk', monospace;
              font-size: 0.85rem;
              color: var(--primary, #155EEF);
              font-weight: 600;
            }
            .completed-event-details p {
              margin: 0;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
            @media (max-width: 768px) {
              .completed-events-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
          
          <div className="completed-events-grid">
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', fontFamily: 'Space Grotesk, monospace' }}>
                // INITIALIZING TELEMETRY & EVENT SCHEMATICS...
              </p>
            ) : displayEvents.length > 0 ? (
              displayEvents.map((event, idx) => {
                return (
                  <TiltCard
                    key={event.id || idx}
                    className="blueprint-sheet-card cad-frame-wrap completed-event-card"
                    data-category={event.category}
                  >
                    <div className="cad-corner-marker tl" />
                    <div className="cad-corner-marker tr" />
                    <div className="cad-corner-marker bl" />
                    <div className="cad-corner-marker br" />

                    <div className="blueprint-spec-header">
                      <span>ARCHIVE_{String(idx + 1).padStart(3, '0')}</span>
                      <span>{event.category?.toUpperCase() || 'CORE'}</span>
                    </div>

                    <div className="completed-event-image-wrapper">
                      <img
                        src={getImagePath(event.image)}
                        alt={event.title}
                        className="completed-event-image"
                        onError={(e) => {
                          e.target.src = '/assets_events/gallery1.jpg';
                        }}
                      />
                      {event.badge && <div className="event-badge">{event.badge}</div>}
                    </div>

                    <div className="completed-event-content">
                      <h3 className="completed-event-title">{event.title}</h3>
                      <p className="completed-event-description">{event.description}</p>

                      <div className="completed-event-details">
                        <p>
                          <i className="fa-solid fa-calendar"></i> {event.date}
                        </p>
                        {event.location && (
                        <p>
                          <i className="fa-solid fa-location-dot"></i> {event.location}
                        </p>
                        )}
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
        </div>
      </section>

      {/* NEW UPCOMING ANNOUNCEMENT SECTION */}
      <section className="timeline-section" id="upcoming" style={{ padding: '6rem 0', background: 'rgba(15, 23, 42, 0.02)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <div className="telemetry-tag" style={{ justifyContent: 'center', margin: '0 auto 1.5rem auto', display: 'flex' }}>
            <span>05 // FUTURE INITIATIVES</span>
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--heading)' }}>
            Something New Is Coming
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--body)' }}>
            Every event is another opportunity to learn, build, and make a difference. We're preparing what's next. Stay connected with Engineering India.
          </p>
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
          </div>
        </div>
      </section>

    </div>
  );
}
