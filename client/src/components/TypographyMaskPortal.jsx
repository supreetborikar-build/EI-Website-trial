import React, { useRef, useEffect, useState } from 'react';
import TiltCard from './TiltCard';

/**
 * Signature Wow Interaction: Image Inside Giant Typography
 * Giant "BUILD" display typography where engineering imagery is clipped inside the letters.
 * As user scrolls, typography separates, scale increases, and the image expands into full width.
 */
export default function TypographyMaskPortal() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Compute how far through the section the viewport is
          const totalDistance = rect.height + windowHeight;
          const currentDistance = windowHeight - rect.top;
          const raw = currentDistance / totalDistance;
          const clamped = Math.min(Math.max(raw, 0), 1);

          setProgress(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute scroll-driven kinetic properties
  const letterSpacing = `${Math.min(progress * 0.18, 0.2)}em`;
  const scale = 1 + progress * 0.25;
  const imageClipExpand = Math.min(progress * 1.5, 1);

  return (
    <div
      ref={containerRef}
      className="typography-mask-scene blueprint-paper-canvas"
      style={{
        padding: '120px 5vw',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--cad-border-subtle, rgba(17, 19, 21, 0.12))',
        borderBottom: '1px solid var(--cad-border-subtle, rgba(17, 19, 21, 0.12))'
      }}
    >
      <div className="blueprint-grid-mesh" />

      {/* Top Telemetry Ruler */}
      <div className="blueprint-ruler-top">
        <span>02.5 // SIGNATURE REVEAL [CAD_PORTAL]</span>
        <span>IMAGE_IN_TYPOGRAPHY // SCALE: {scale.toFixed(2)}x</span>
        <span>STATUS: EXPANDING</span>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="telemetry-tag">
              <span>02 // THE LIVING ARTIFACT</span>
            </div>
            <h2
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 4.2rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                margin: '0.75rem 0 0',
                color: 'var(--heading, #111315)'
              }}
            >
              From Blueprint <span className="outline-text">Into Reality</span>
            </h2>
          </div>

          <div
            style={{
              fontFamily: 'Space Grotesk, monospace',
              fontSize: '0.78rem',
              color: 'var(--blueprint-blue, #155EEF)',
              background: 'rgba(21, 94, 239, 0.08)',
              padding: '6px 14px',
              border: '1px solid var(--cad-border, #155EEF)'
            }}
          >
            [SCROLL PROGRESS: {Math.round(progress * 100)}%]
          </div>
        </div>

        {/* GIANT TYPOGRAPHY IMAGE PORTAL STAGE */}
        <div
          style={{
            position: 'relative',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '3rem 1rem'
          }}
        >
          {/* Background Technical CAD Circles */}
          <div
            style={{
              position: 'absolute',
              width: '480px',
              height: '480px',
              borderRadius: '50%',
              border: '1px dashed rgba(21, 94, 239, 0.2)',
              pointerEvents: 'none',
              transform: `scale(${1 + progress * 0.4}) rotate(${progress * 90}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          />

          {/* GIANT "BUILD" DISPLAY TYPOGRAPHY WITH MASKED IMAGE */}
          <h1
            style={{
              margin: '0',
              fontFamily: 'Outfit, Space Grotesk, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(5rem, 18vw, 17rem)',
              textTransform: 'uppercase',
              lineHeight: 0.82,
              letterSpacing: letterSpacing,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'letter-spacing 0.15s ease-out, transform 0.15s ease-out',
              backgroundImage: 'url(/assets/images/hero/future.png)',
              backgroundSize: 'cover',
              backgroundPosition: `center ${Math.round(progress * 50)}%`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 15px 30px rgba(17, 19, 21, 0.15))',
              userSelect: 'none'
            }}
          >
            BUILD
          </h1>

          {/* Micro Telemetry HUD Floating Under Typography */}
          <div
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              fontFamily: 'Space Grotesk, monospace',
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--graphite, #111315)',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <span>[01 // BLUEPRINT]</span>
            <span style={{ color: 'var(--blueprint-blue, #155EEF)' }}>&rarr;</span>
            <span>[02 // ARCHITECTURE]</span>
            <span style={{ color: 'var(--blueprint-blue, #155EEF)' }}>&rarr;</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>[03 // DEPLOYABLE CODE]</span>
          </div>

          <p
            style={{
              maxWidth: '56ch',
              margin: '1.5rem auto 0',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--body, #334155)',
              fontFamily: 'Space Grotesk, sans-serif'
            }}
          >
            We don't theorize from ivory towers. We engineer in git commits, terminal prompts,
            hardware circuits, and collaborative hackathons across India.
          </p>
        </div>
      </div>
    </div>
  );
}
