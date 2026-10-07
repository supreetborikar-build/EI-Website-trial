import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Multi-Channel Scroll Progress & Scene HUD
 * Displays precision top progress hairline and floating architectural scene telemetry.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const [activeScene, setActiveScene] = useState('01 // OVERVIEW');
  const [progressPercent, setProgressPercent] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const scenes = [
      { id: 'home', label: '01 // SCENE: HERO' },
      { id: 'about', label: '02 // SCENE: MANIFESTO' },
      { id: 'events', label: '03 // SCENE: EXHIBITION' },
      { id: 'impact', label: '04 // SCENE: IMPACT' },
      { id: 'news', label: '05 // SCENE: DISPATCHES' },
      { id: 'contact', label: '06 // SCENE: CONNECT' }
    ];

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      setProgressPercent(Math.round(progress * 100));

      if (location.pathname === '/') {
        // Find visible section
        const scrollPos = window.scrollY + window.innerHeight * 0.35;
        let currentLabel = '01 // SCENE: HERO';

        for (let i = scenes.length - 1; i >= 0; i--) {
          const el = document.getElementById(scenes[i].id);
          if (el && el.offsetTop <= scrollPos) {
            currentLabel = scenes[i].label;
            break;
          }
        }
        setActiveScene(currentLabel);
      } else {
        const pageName = location.pathname.replace('/', '').toUpperCase();
        setActiveScene(`01 // ${pageName || 'OVERVIEW'}`);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <>
      {/* Top Hairline Progress */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 99999,
          pointerEvents: 'none',
          background: 'transparent'
        }}
      >
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #2563EB, #10B981, #F59E0B)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            willChange: 'transform',
            transition: 'transform 0.08s linear'
          }}
        />
      </div>

      {/* Floating Scene HUD (Bottom Left) */}
      <div className="scene-hud-indicator" aria-hidden="true">
        <span className="active-dot" />
        <span>{activeScene}</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ color: '#38BDF8' }}>{progressPercent}%</span>
      </div>
    </>
  );
}
