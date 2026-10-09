import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

/**
 * Interactive Horizontal Event Exhibition
 * Smooth horizontal gallery with arrow controls, drag/scroll tracking, and live progress indicators.
 * Zero empty vertical space: seamlessly transitions into the next scene.
 */
export default function HorizontalScrollEvents({ events = [], onSelectEvent }) {
  const trackWindowRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayEvents = events.length > 0 ? events : [
    {
      id: 'promptwars-2026',
      title: 'PromptWars 2026',
      date: '4 October 2026',
      location: 'SVPCET, Nagpur',
      category: 'Hackathon',
      badge: 'Hackathon',
      description: 'Engineering India\'s AI Vibe-Coding Hackathon brought together participants to transform ideas into working solutions through creativity, rapid development, and problem-solving. Organized in collaboration with GDG Nagpur and hack2skill, the event marked a significant milestone as the first event of its kind in Nagpur, featuring large-scale participation and an energetic innovation-driven atmosphere.',
      image: 'assets_events/promptwars-2026.jpg'
    },
    {
      id: 'alumni-meet-2026',
      title: 'Alumni Meet',
      date: '2 May 2026',
      location: '',
      category: 'Community',
      badge: 'Alumni',
      description: 'Engineering India coordinators connected with the founding batch of the Pallotti chapter for a memorable alumni gathering filled with cricket, games, and meaningful conversations. The interaction offered valuable career perspectives, insights into professional journeys, and an opportunity to strengthen bonds between alumni and current coordinators.',
      image: 'assets_events/alumni-meet.jpeg'
    },
    {
      id: 'cdp-industry-visit',
      title: 'CDP — Industry Visit',
      date: '6 January 2026',
      location: 'Trust Systems and Software Ltd., IT Park Road, Pratap Nagar, Nagpur',
      category: 'Seminar',
      badge: 'Industry Visit',
      description: 'As part of the Coordinator Development Plan, the Engineering India SVPCET team visited Trust Systems and Software Ltd. Students explored the company\'s working environment, learned about technologies used in industry, and interacted with HR to understand hiring expectations, essential skills, and career opportunities.',
      image: 'assets_events/cdp-industry-visit.jpg'
    },
    {
      id: 'induction-programme-2025',
      title: 'Induction Programme',
      date: '21 August 2025',
      location: 'SVPCET, Nagpur',
      category: 'Seminar',
      badge: 'Induction',
      description: 'Engineering India welcomed first-year students and introduced them to the chapter\'s vision, initiatives, and upcoming events. The session highlighted EI\'s technical and social contributions, encouraged students to become involved, and was graced by Ms. Mrunali Buradkar, Pallotti EI Faculty Coordinator.',
      image: 'assets_events/induction-programme.JPG'
    },
    {
      id: 'rangittalim-1',
      title: 'Rangittalim 1.0',
      date: '27 July 2025',
      location: 'Omkar Nagar, Nagpur',
      category: 'Community',
      badge: 'Community',
      description: 'Under the Light of Learning initiative, Engineering India coordinators collaborated with Youth for Seva, Nagpur, to engage with children in Omkar Nagar. Through lessons, poems, games, and the distribution of books and stationery, the team created a joyful learning environment while connecting with families and understanding community needs.',
      image: 'assets_events/rangittalim-1.JPG'
    },
    {
      id: 'rangittalim-2',
      title: 'Rangittalim 2.0',
      date: '2 August 2026',
      location: 'Near London Street, Nagpur',
      category: 'Community',
      badge: 'Community',
      description: 'Engineering India celebrated Friendship Day with children from a local community through educational games, creative learning activities, and moments of shared fun. The initiative encouraged children to explore new ideas, understand the value of friendship, and build meaningful connections in a warm and inclusive environment.',
      image: 'assets_events/rangittalim-2.jpg'
    },
    {
      id: 'seva-sankalp',
      title: 'Seva Sankalp',
      date: '16 October 2025',
      location: 'Nalanda Vastistar Vruddhashram, Binaki, Nagpur',
      category: 'Community',
      badge: 'Community',
      description: 'In collaboration with EI RBU, Engineering India coordinators visited an old-age home to spend quality time with elderly residents. Through heartfelt conversations, shared life experiences, old songs, and a cake-cutting celebration, the visit promoted companionship, respect, and compassion across generations.',
      image: 'assets_events/seva-sankalp.jpeg'
    }
  ];

  // Update progress and active card indicator on scroll
  const handleScroll = useCallback(() => {
    const el = trackWindowRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setProgress(1);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const currentScroll = el.scrollLeft;
    const ratio = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
    setProgress(ratio);

    const total = displayEvents.length;
    const idx = Math.min(Math.round(ratio * (total - 1)), total - 1);
    setActiveIndex(idx);

    setCanScrollLeft(currentScroll > 10);
    setCanScrollRight(currentScroll < maxScroll - 10);
  }, [displayEvents.length]);

  useEffect(() => {
    const el = trackWindowRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Navigate left or right
  const scrollStep = (direction) => {
    const el = trackWindowRef.current;
    if (!el) return;
    const cardWidth = 520;
    el.scrollBy({
      left: direction === 'right' ? cardWidth : -cardWidth,
      behavior: 'smooth'
    });
  };

  return (
    <section className="h-scroll-section" id="events">
      {/* Header HUD */}
      <div className="h-scroll-header">
        <div>
          <div className="telemetry-tag">
            <span>04 // EXHIBITION TRACK // CAD-04</span>
          </div>
          <h2 className="editorial-section-title" style={{ marginTop: '0.5rem' }}>
            Our Experiences
          </h2>
          <p className="editorial-lead">
            Curated national summits, hackathons, and technical workshops across India.
          </p>
        </div>

        {/* Exhibition Controls: Counter & Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'Space Grotesk, monospace',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--primary, #2563EB)'
            }}
          >
            0{activeIndex + 1} <span style={{ opacity: 0.35, fontSize: '1.1rem' }}>/ 0{displayEvents.length}</span>
          </span>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => scrollStep('left')}
              disabled={!canScrollLeft}
              aria-label="Previous event"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '4px',
                border: '1px solid var(--border, #CBD5E1)',
                background: canScrollLeft ? 'var(--surface, #FFFFFF)' : 'transparent',
                color: 'var(--heading, #0F172A)',
                cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                opacity: canScrollLeft ? 1 : 0.4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                transition: 'all 0.2s ease'
              }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollStep('right')}
              disabled={!canScrollRight}
              aria-label="Next event"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '4px',
                border: '1px solid var(--border, #CBD5E1)',
                background: canScrollRight ? 'var(--surface, #FFFFFF)' : 'transparent',
                color: 'var(--heading, #0F172A)',
                cursor: canScrollRight ? 'pointer' : 'not-allowed',
                opacity: canScrollRight ? 1 : 0.4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                transition: 'all 0.2s ease'
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Window */}
      <div ref={trackWindowRef} className="h-scroll-track-window">
        <div className="h-scroll-track">
          {displayEvents.map((event, idx) => (
            <div key={event.id || idx} className="h-scroll-card interactive-hover">
              <div className="h-scroll-card-image">
                <span className="h-scroll-card-index">0{idx + 1}</span>
                <img
                  src={event.image?.startsWith('/') ? event.image : `/${event.image || 'assets_events/gallery1.jpg'}`}
                  alt={event.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/assets_events/gallery1.jpg';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1.25rem',
                    zIndex: 2,
                    display: 'flex',
                    gap: '0.5rem'
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {event.badge || event.category || 'Engineering'}
                  </span>
                </div>
              </div>

              <div className="h-scroll-card-body">
                <div>
                  <div
                    style={{
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.78rem',
                      color: 'var(--primary, #2563EB)',
                      fontWeight: 600,
                      marginBottom: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span>🗓 {event.date}</span>
                    {event.location && (
                      <>
                        <span style={{ opacity: 0.5 }}>|</span>
                        <span>📍 {event.location}</span>
                      </>
                    )}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Outfit, Poppins, sans-serif',
                      fontSize: '1.45rem',
                      fontWeight: 700,
                      margin: '0 0 0.75rem 0',
                      lineHeight: 1.25,
                      color: 'var(--heading, #0F172A)'
                    }}
                  >
                    {event.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      lineHeight: 1.55,
                      color: 'var(--body, #475569)',
                      margin: 0
                    }}
                  >
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer HUD Indicator */}
      <div className="h-scroll-hud-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>PROGRESS</span>
          <div
            style={{
              width: '140px',
              height: '3px',
              background: 'var(--border, #CBD5E1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--primary, #2563EB)',
                transform: `scaleX(${progress})`,
                transformOrigin: 'left',
                transition: 'transform 0.08s linear'
              }}
            />
          </div>
          <span>{(progress * 100).toFixed(0)}%</span>
        </div>

        <div>
          <Link
            to="/events"
            style={{
              color: 'var(--primary, #2563EB)',
              textDecoration: 'none',
              fontWeight: 600,
              letterSpacing: '0.04em'
            }}
          >
            EXPLORE FULL DIRECTORY (45+ EVENTS) &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
