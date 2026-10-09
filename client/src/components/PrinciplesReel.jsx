import React, { useState } from 'react';
import TiltCard from './TiltCard';

const PRINCIPLES = [
  {
    num: '01',
    id: 'IMAGINE',
    title: 'Ideas Without Limits',
    spec: 'RESEARCH_LAB // VISION_01',
    lead: 'Exploring possibilities, challenging conventional thinking, and bringing curious minds together to imagine innovative solutions to real-world challenges.',
    tags: ['Innovation', 'Ideation', 'Hackathons', 'Creativity'],
    cadCode: 'CAD_SPEC_01 // R&D-LAB',
    image: '/assets_events/imagine.jpeg',
    objectPosition: 'center'
  },
  {
    num: '02',
    id: 'LEARN',
    title: 'Foundations & Skills',
    spec: 'SYS_CORE // REPO_SYNC_v4',
    lead: 'Building strong technical foundations through workshops, mentorship, peer learning, and hands-on exploration of emerging technologies.',
    tags: ['Workshops', 'Technical Skills', 'Mentorship', 'Learning'],
    cadCode: 'CAD_SPEC_02 // ARCH-2026',
    image: '/assets_events/learn.JPG',
    objectPosition: 'center'
  },
  {
    num: '03',
    id: 'BUILD',
    title: 'From Ideas to Reality',
    spec: 'SPRINT_CYCLE // 48H_DEV',
    lead: 'Turning concepts into tangible outcomes through collaborative projects, practical experimentation, and the development of creative technical solutions.',
    tags: ['Projects', 'Prototyping', 'Development', 'Teamwork'],
    cadCode: 'CAD_SPEC_03 // INNOHACK',
    image: '/assets_events/build.jpeg',
    objectPosition: 'center'
  },
  {
    num: '04',
    id: 'IMPACT',
    title: 'Engineering for Society',
    spec: 'PUBLIC_GOOD // NATIONWIDE',
    lead: 'Using our knowledge, creativity, and collective effort to address societal challenges, support communities, and contribute to a more inclusive and sustainable future.',
    tags: ['Social Impact', 'Community', 'Outreach', 'Sustainability'],
    cadCode: 'CAD_SPEC_04 // PAN-INDIA',
    image: '/assets_events/impact.jpeg',
    objectPosition: 'center'
  }
];

export default function PrinciplesReel() {
  const [activeStep, setActiveStep] = useState(0);
  const current = PRINCIPLES[activeStep];

  return (
    <div className="pinned-principles-wrap" style={{ marginTop: '3.5rem' }}>
      <style>{`
        .principle-content-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          min-height: 420px;
          height: 100%;
        }
        .principle-nav-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 2rem;
        }
        @media (max-width: 768px) {
          .principle-content-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .principle-nav-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .principle-image-container {
            min-height: 300px !important;
          }
        }
      `}</style>
      {/* Principle Step Selector Tabs */}
      <div className="principle-nav-grid">
        {PRINCIPLES.map((p, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={p.num}
              type="button"
              onClick={() => setActiveStep(idx)}
              style={{
                background: isActive ? 'var(--blueprint-blue, #155EEF)' : 'var(--paper-card, #FFFFFF)',
                color: isActive ? '#FFFFFF' : 'var(--graphite, #111315)',
                border: isActive ? '1.5px solid var(--blueprint-blue, #155EEF)' : '1px solid var(--cad-border-subtle, rgba(17, 19, 21, 0.14))',
                padding: '16px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '84px',
                boxShadow: isActive ? '0 10px 25px rgba(21, 94, 239, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'Space Grotesk, monospace',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    opacity: isActive ? 0.9 : 0.6
                  }}
                >
                  {p.num} //
                </span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isActive ? '#38BDF8' : 'transparent',
                    border: isActive ? 'none' : '1px solid currentColor'
                  }}
                />
              </div>

              <span
                style={{
                  fontFamily: 'Outfit, Space Grotesk, sans-serif',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}
              >
                {p.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Principle Detailed Blueprint Display */}
      <TiltCard
        maxTilt={2}
        className="blueprint-sheet-card cad-frame-wrap"
        style={{
          padding: '0',
          overflow: 'hidden'
        }}
      >
        <div className="cad-corner-marker tl" />
        <div className="cad-corner-marker tr" />
        <div className="cad-corner-marker bl" />
        <div className="cad-corner-marker br" />

        {/* Technical Specification Bar */}
        <div className="blueprint-spec-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#155EEF' }} />
            <span>{current.cadCode}</span>
          </div>
          <div>
            <span>[SYS_STATUS: ACTIVE] • {current.spec}</span>
          </div>
        </div>

        {/* Two-Column Principle Layout: Left Specs, Right Image */}
        <div className="principle-content-grid">
          {/* Left Editorial Spec Column */}
          <div
            style={{
              padding: 'clamp(24px, 3.5vw, 48px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRight: '1px solid var(--cad-border-subtle, rgba(17, 19, 21, 0.1))'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span className="principles-step-pill">
                  {current.num} // {current.id}
                </span>
                <span
                  style={{
                    fontFamily: 'Space Grotesk, monospace',
                    fontSize: '0.72rem',
                    color: 'var(--light-text, #64748B)'
                  }}
                >
                  ENGINEERING INDIA PROTOCOL
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(1.8rem, 2.6vw, 2.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 16px 0',
                  color: 'var(--heading, #111315)'
                }}
              >
                {current.title}
              </h3>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: 'var(--body, #334155)',
                  margin: '0 0 24px 0'
                }}
              >
                {current.lead}
              </p>
            </div>

            {/* Technical Stack Badges */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'Space Grotesk, monospace',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--light-text, #64748B)',
                  marginBottom: '8px'
                }}
              >
                TECHNICAL COMPETENCY STACK
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {current.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontFamily: 'Space Grotesk, monospace',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      background: 'rgba(21, 94, 239, 0.07)',
                      color: 'var(--blueprint-blue, #155EEF)',
                      border: '1px solid rgba(21, 94, 239, 0.2)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Blueprint Technical Drawing / Image */}
          <div
            className="principle-image-container"
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '320px',
              height: '100%',
              background: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Blurred background for photos that don't cover naturally */}
            <div 
              style={{
                position: 'absolute',
                inset: -20,
                backgroundImage: `url(${current.image})`,
                backgroundSize: 'cover',
                backgroundPosition: current.objectPosition || 'center',
                filter: 'blur(15px)',
                opacity: 0.5
              }}
            />
            <img
              src={current.image}
              alt={current.title}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: current.objectPosition || 'center',
                opacity: 0.88,
                transition: 'transform 0.7s ease'
              }}
            />
            {/* Blueprint Grid Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(to right, rgba(21, 94, 239, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(21, 94, 239, 0.15) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                pointerEvents: 'none'
              }}
            />
            {/* Bottom CAD Coordinate Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 16px',
                background: 'rgba(11, 15, 25, 0.88)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'Space Grotesk, monospace',
                fontSize: '0.72rem',
                color: '#FFFFFF'
              }}
            >
              <span>{current.id}_VISUAL_SPEC.DWG</span>
              <span style={{ color: '#38BDF8' }}>LIVE RENDER 1:1</span>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
