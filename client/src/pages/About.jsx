import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import KineticCounter from '../components/KineticCounter';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/about-page.css';

export default function About() {
  const canvasRef = useRef(null);

  // Animated stat counters
  const [stats, setStats] = useState({ members: 0, chapters: 0, volunteers: 0, areas: 0 });
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);

  const containerRef = useScrollReveal();

  // Live Interactive Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    const COLORS = ['37,99,235', '16,185,129', '249,115,22'];
    let particles = [];

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 700 ? 20 : 35;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: 1.8 + Math.random() * 2.2,
          c: COLORS[i % COLORS.length]
        });
      }
    };
    initParticles();

    let mouseX = -9999;
    let mouseY = -9999;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const force = ((100 - dist) / 100) * 0.8;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c}, 0.55)`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${0.18 * (1 - d / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // IntersectionObserver for stats counter
  useEffect(() => {
    if (!statsRef.current || statsStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsStarted(true);

          const animateCount = (start, end, duration, key) => {
            const range = end - start;
            let current = start;
            const stepTime = Math.abs(Math.floor(duration / range)) || 20;

            const timer = setInterval(() => {
              current += Math.ceil(range / 50) || 1;
              if (current >= end) {
                current = end;
                clearInterval(timer);
              }
              setStats((prev) => ({ ...prev, [key]: current }));
            }, stepTime);
          };

          animateCount(0, 150, 1200, 'members');
          animateCount(0, 12, 1000, 'chapters');
          animateCount(0, 300, 1500, 'volunteers');
          animateCount(0, 4, 800, 'areas');

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsStarted]);

  return (
    <div className="about-page-container blueprint-paper-canvas" ref={containerRef} style={{ position: 'relative', overflowX: 'clip' }}>
      {/* Top CAD Architectural Millimeter Ruler */}
      <div className="blueprint-ruler-top">
        <span>02 // CHAPTER DOSSIER // EI-ABOUT</span>
        <span>SYS_STATUS: VERIFIED</span>
        <span>LOCATION: SVPCET NAGPUR // 21.1458° N, 79.0882° E</span>
      </div>

      {/* Interactive Particles Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* HERO SECTION */}
      <section className="about-hero" style={{ position: 'relative', zIndex: 1, padding: '120px 0 80px', textAlign: 'center' }} data-reveal="fade-up">
        <div className="wrap">
          <div className="telemetry-tag" style={{ marginBottom: '1rem' }}>
            <span>02 // CHAPTER DOSSIER // EI-ABOUT</span>
          </div>
          <div
            className="eyebrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--primary, #2563EB)',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: '999px',
              padding: '7px 18px',
              fontSize: '12.5px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              marginBottom: '1.25rem'
            }}
          >
            ABOUT ENGINEERING INDIA · PALLOTTI CHAPTER
          </div>
          <h1 className="editorial-section-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem', color: 'var(--heading, #0F172A)' }}>
            Engineering, <span className="outline-text">Built for People.</span>
          </h1>
          <p
            className="sub editorial-lead"
            style={{
              color: 'var(--body, #475569)',
              maxWidth: '68ch',
              margin: '0 auto 2rem',
              lineHeight: 1.7,
              opacity: 1
            }}
          >
            We're a community of student engineers at St. Vincent Pallotti College who
            believe technology means the most when it reaches the people who need it —
            and that every project we take on should be able to answer one question:{' '}
            <em>who is this for?</em>
          </p>
          <div className="btn-row" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton>
              <Link to="/contact" className="btn-cinematic-primary">
                <span>Join Chapter</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/events" className="btn-cinematic-outline">
                <span>Explore Events</span>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={{ position: 'relative', zIndex: 1 }} data-reveal="fade-up">
        <div className="wrap">
          <div className="section-head">
            <span className="telemetry-tag" style={{ marginBottom: '0.5rem' }}>
              <span>02.1 // IDENTITY &amp; CHARTER</span>
            </span>
            <h2 className="editorial-section-title" style={{ marginTop: '0.5rem' }}>A National Spirit, Built Locally</h2>
          </div>
          <TiltCard maxTilt={2} className="blueprint-sheet-card cad-frame-wrap who-card" style={{ padding: '2.5rem', borderRadius: '8px' }}>
            <div className="cad-corner-marker tl" />
            <div className="cad-corner-marker tr" />
            <div className="cad-corner-marker bl" />
            <div className="cad-corner-marker br" />

            <div className="blueprint-spec-header" style={{ margin: '-2.5rem -2.5rem 2rem -2.5rem' }}>
              <span>CHARTER_REF: EI-SVPCET-EST-2024</span>
              <span>CLASSIFICATION: PAN-INDIA MOVEMENT</span>
            </div>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
              Engineering India is a student-led movement built on a simple premise:
              technology means the most when it's built <strong>for</strong> people, not
              just for grades. The <strong>Pallotti Chapter</strong> is our home at St.
              Vincent Pallotti College of Engineering &amp; Technology, Nagpur — a growing
              community of engineers, tinkerers, and doers who show up not just to build
              resumes, but to build things that matter. We're proud to be part of a larger
              national network, while staying rooted in the problems and people right here
              around us.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{ position: 'relative', zIndex: 1 }} data-reveal="fade-up">
        <div className="wrap">
          <TiltCard maxTilt={2} className="blueprint-sheet-card cad-frame-wrap manifesto-wrap" style={{ padding: '3rem', borderRadius: '8px' }}>
            <div className="cad-corner-marker tl" />
            <div className="cad-corner-marker tr" />
            <div className="cad-corner-marker bl" />
            <div className="cad-corner-marker br" />

            <div className="blueprint-spec-header" style={{ margin: '-3rem -3rem 2rem -3rem' }}>
              <span>CORE_PHILOSOPHY // CAD_SPEC</span>
              <span>THE HUMAN STANDARD</span>
            </div>

            <p style={{ fontSize: '1.25rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
              We believe engineering shouldn't stop at the classroom door. Whether it's
              a sensor system, a workshop that teaches a skill someone didn't have
              yesterday, or a hackathon idea turned into something real — every project we
              take on should be able to answer{' '}
              <span style={{ color: 'var(--blueprint-blue, #155EEF)', fontWeight: 700 }}>one simple question: who is this for?</span>
            </p>
          </TiltCard>
        </div>
      </section>

      {/* WHAT WE DO - 4 PILLARS */}
      <section style={{ position: 'relative', zIndex: 1 }}>
        <div className="wrap">
          <div className="section-head" data-reveal="fade-up">
            <span className="telemetry-tag" style={{ marginBottom: '0.5rem' }}>
              <span>02.2 // THE FOUR COMMITMENTS</span>
            </span>
            <h2 className="editorial-section-title" style={{ marginTop: '0.5rem' }}>Four Things We Show Up For</h2>
          </div>
          <div className="grid4" id="pillarGrid">
            <TiltCard className="blueprint-sheet-card cad-frame-wrap pillar" style={{ padding: '1.75rem', borderRadius: '6px' }}>
              <div className="cad-corner-marker tl" />
              <div className="cad-corner-marker tr" />
              <div className="cad-corner-marker bl" />
              <div className="cad-corner-marker br" />

              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--blueprint-blue, #155EEF)', marginBottom: '0.75rem' }}>
                SPEC_01 // PUBLIC_GOOD
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Field &amp; Social-Impact</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                Engineering solutions aimed at real community problems — not just lab demonstrations.
              </p>
            </TiltCard>

            <TiltCard className="blueprint-sheet-card cad-frame-wrap pillar" style={{ padding: '1.75rem', borderRadius: '6px' }}>
              <div className="cad-corner-marker tl" />
              <div className="cad-corner-marker tr" />
              <div className="cad-corner-marker bl" />
              <div className="cad-corner-marker br" />

              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--blueprint-blue, #155EEF)', marginBottom: '0.75rem' }}>
                SPEC_02 // R&amp;D_LABS
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Workshops &amp; Skill Labs</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                Hands-on learning our members can't always find in a regular academic semester.
              </p>
            </TiltCard>

            <TiltCard className="blueprint-sheet-card cad-frame-wrap pillar" style={{ padding: '1.75rem', borderRadius: '6px' }}>
              <div className="cad-corner-marker tl" />
              <div className="cad-corner-marker tr" />
              <div className="cad-corner-marker bl" />
              <div className="cad-corner-marker br" />

              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--blueprint-blue, #155EEF)', marginBottom: '0.75rem' }}>
                SPEC_03 // SPRINT_DEV
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Competitions &amp; InnoHack</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                Pushing our ideas and code against the clock alongside brilliant engineering minds.
              </p>
            </TiltCard>

            <TiltCard className="blueprint-sheet-card cad-frame-wrap pillar" style={{ padding: '1.75rem', borderRadius: '6px' }}>
              <div className="cad-corner-marker tl" />
              <div className="cad-corner-marker tr" />
              <div className="cad-corner-marker bl" />
              <div className="cad-corner-marker br" />

              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--blueprint-blue, #155EEF)', marginBottom: '0.75rem' }}>
                SPEC_04 // COLLECTIVE
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Community &amp; Outreach</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                Connecting regional engineering chapters across India into an active peer collective.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* CHAPTER STORY */}
      <section style={{ position: 'relative', zIndex: 1 }} data-reveal="fade-up">
        <div className="wrap">
          <div className="section-head">
            <span className="telemetry-tag" style={{ marginBottom: '0.5rem' }}>
              <span>02.3 // ARCHIVAL SCHEMATIC</span>
            </span>
            <h2 className="editorial-section-title" style={{ marginTop: '0.5rem' }}>The Pallotti Chapter Blueprint</h2>
          </div>
          <TiltCard maxTilt={2} className="blueprint-sheet-card cad-frame-wrap story-card" style={{ padding: '2.5rem', borderRadius: '8px' }}>
            <div className="cad-corner-marker tl" />
            <div className="cad-corner-marker tr" />
            <div className="cad-corner-marker bl" />
            <div className="cad-corner-marker br" />

            <div className="blueprint-spec-header" style={{ margin: '-2.5rem -2.5rem 2rem -2.5rem' }}>
              <span>CAD_ARCHIVE: EI-SVPCET-2024</span>
              <span>GEOLOCATION: 21.1458° N, 79.0882° E</span>
            </div>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
              Founded with the vision to bridge academic engineering and community impact,
              the Pallotti Chapter in Nagpur brings together students from diverse
              disciplines — Computer Engineering, Mechanical, Electronics, and Civil — to
              co-create open-source projects, organize workshops, and give back through
              technology.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* STATS SECTION */}
      <section ref={statsRef} style={{ position: 'relative', zIndex: 1 }} data-reveal="fade-up">
        <div className="wrap">
          <TiltCard maxTilt={2} className="blueprint-sheet-card cad-frame-wrap stats-card" style={{ padding: '2.5rem', borderRadius: '8px' }}>
            <div className="cad-corner-marker tl" />
            <div className="cad-corner-marker tr" />
            <div className="cad-corner-marker bl" />
            <div className="cad-corner-marker br" />

            <div className="blueprint-spec-header" style={{ margin: '-2.5rem -2.5rem 2rem -2.5rem' }}>
              <span>TELEMETRY_LOG // VERIFIED_METRICS</span>
              <span>LIVE_NODES: OK</span>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="num" style={{ color: 'var(--blueprint-blue, #155EEF)' }}><KineticCounter target={150} suffix="+" /></div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Pallotti Chapter Members</p>
              </div>
              <div className="stat">
                <div className="num" style={{ color: 'var(--blueprint-blue, #155EEF)' }}><KineticCounter target={12} suffix="+" /></div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Alumni Chapters Nationwide</p>
              </div>
              <div className="stat">
                <div className="num" style={{ color: 'var(--blueprint-blue, #155EEF)' }}><KineticCounter target={300} suffix="+" /></div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Volunteers Nationwide</p>
              </div>
              <div className="stat">
                <div className="num" style={{ color: 'var(--blueprint-blue, #155EEF)' }}><KineticCounter target={4} suffix="+" /></div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Core Focus Areas</p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ position: 'relative', zIndex: 1 }} data-reveal="fade-up">
        <div className="wrap">
          <div className="cta-band cad-frame-wrap blueprint-sheet-card" style={{ padding: '3.5rem 2.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <div className="cad-corner-marker tl" />
            <div className="cad-corner-marker tr" />
            <div className="cad-corner-marker bl" />
            <div className="cad-corner-marker br" />

            <span className="telemetry-tag" style={{ marginBottom: '1rem' }}>
              <span>02.4 // INITIATION PROTOCOL</span>
            </span>

            <h2 className="editorial-section-title" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              Ready to Build <span className="outline-text">Something That Matters?</span>
            </h2>
            <p className="editorial-lead" style={{ margin: '0 auto 2.5rem', maxWidth: '54ch' }}>
              Come see what we're working on, inspect the domain roster, and find your place on the drawing board.
            </p>
            <div className="btn-row" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <MagneticButton>
                <Link to="/contact" className="btn-cinematic-primary">
                  <span>Join Chapter</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/events" className="btn-cinematic-outline">
                  <span>Explore Events</span>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
