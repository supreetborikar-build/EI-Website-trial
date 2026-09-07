import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Clean & Smooth Page Transition
 * Provides a fluid, instant fade-in and subtle upward glide upon route changes.
 * Completely eliminates any dark overlays, curtains, or stuck full-screen backdrops.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="page-transition-content"
      style={{
        width: '100%',
        animation: 'pageCinematicIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {children}
    </div>
  );
}
