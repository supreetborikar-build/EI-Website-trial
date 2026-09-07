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
      id: 'demo-1',
      title: 'National InnoHack 2026',
      date: '15–17 September 2026',
      category: 'Hackathon',
      badge: 'Flagship Event',
      description: '48-hour national hackathon uniting 500+ builders to develop real-world solutions for societal and industrial problems.',
      image: '/assets_events/hackathon.jpg'
    },
    {
      id: 'demo-2',
      title: 'AI & Robotics Innovation Summit',
      date: '05 October 2026',
      category: 'Workshop',
      badge: 'Hands-on Lab',
      description: 'Immersive exploration into neural networks, computer vision, embedded edge-computing, and robotic autonomy.',
      image: '/assets_events/Ai Innovation.jpg'
    },
    {
      id: 'demo-3',
      title: 'National Code Sprint 2026',
      date: '28 December 2026',
      category: 'Competition',
      badge: 'Competitive Coding',
      description: 'High-octane algorithmic sprints, competitive architecture rounds, and live peer debugging with national recognition.',
      image: '/assets_events/code sprint.png'
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
            Upcoming Experiences
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
                      gap: '0.5rem'
                    }}
                  >
                    <span>🗓 {event.date}</span>
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

                <div
                  style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border, #E2E8F0)',
                    paddingTop: '1.25rem'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectEvent && onSelectEvent(event)}
                    className="btn-cinematic-primary"
                    style={{
                      padding: '0.65rem 1.35rem',
                      fontSize: '0.82rem'
                    }}
                  >
                    <span>Register Now</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>

                  <Link
                    to="/events"
                    style={{
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--light-text, #64748B)',
                      textDecoration: 'none',
                      textTransform: 'uppercase'
                    }}
                  >
                    Details &amp; Schedule &rarr;
                  </Link>
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
