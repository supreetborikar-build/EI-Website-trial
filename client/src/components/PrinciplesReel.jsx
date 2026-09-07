import React, { useState } from 'react';
import TiltCard from './TiltCard';

const PRINCIPLES = [
  {
    num: '01',
    id: 'LEARN',
    title: 'Foundations & Deep Tech',
    spec: 'SYS_CORE // REPO_SYNC_v4',
    lead: 'Mastering operating systems, distributed architectures, neural networks, and foundational engineering principles through continuous hands-on labs.',
    tags: ['C++', 'Rust', 'Cloud Infrastructure', 'Distributed Systems'],
    cadCode: 'CAD_SPEC_01 // ARCH-2026',
    image: '/assets_events/cloud.jpg'
  },
  {
    num: '02',
    id: 'IMAGINE',
    title: 'Speculative Design & R&D',
    spec: 'RESEARCH_LAB // VISION_02',
    lead: 'Prototyping next-generation autonomous systems, edge neural devices, clean mobility solutions, and unconventional hardware interfaces.',
    tags: ['Computer Vision', 'Robotics', 'Edge AI', 'Hardware Prototyping'],
    cadCode: 'CAD_SPEC_02 // R&D-LAB',
    image: '/assets_events/ai.jpg'
  },
  {
    num: '03',
    id: 'BUILD',
    title: 'Production Software & Hackathons',
    spec: 'SPRINT_CYCLE // 48H_DEV',
    lead: 'Translating concepts into deployable production code during intense 48-hour national hackathons, tested under real-world traffic conditions.',
    tags: ['Microservices', 'Docker', 'Kubernetes', 'High-Throughput APIs'],
    cadCode: 'CAD_SPEC_03 // INNOHACK',
    image: '/assets_events/hackathon.jpg'
  },
  {
    num: '04',
    id: 'IMPACT',
    title: 'Field Deployment & Community',
    spec: 'PUBLIC_GOOD // NATIONWIDE',
    lead: 'Deploying engineering tools across rural schools, open-source civic tech collectives, and regional chapters to empower India from the ground up.',
    tags: ['Civic Tech', 'Digital Literacy', 'Public Infrastructure', 'Open Source'],
    cadCode: 'CAD_SPEC_04 // PAN-INDIA',
    image: '/assets_events/community-drive.jpg'
  }
];

export default function PrinciplesReel() {
  const [activeStep, setActiveStep] = useState(0);
  const current = PRINCIPLES[activeStep];

  return (
    <div className="pinned-principles-wrap" style={{ marginTop: '3.5rem' }}>
      {/* Principle Step Selector Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '2rem'
        }}
      >
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '0',
            minHeight: '380px'
          }}
        >
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
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '320px',
              background: '#0F172A'
            }}
          >
            <img
              src={current.image}
              alt={current.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
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
