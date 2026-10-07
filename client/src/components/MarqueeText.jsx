import React from 'react';

/**
 * Infinite Technical Marquee Component
 * Smooth GPU-accelerated ticker displaying chapter metadata and engineering mantras.
 */
export default function MarqueeText({
  items = [
    'INNOVATION THROUGH COLLABORATION',
    'CHAPTER NAGPUR // SVPCET',
    'BUILDING REAL IMPACT',
    'FUTURE OF ENGINEERING',
    'CODE • CREATE • DEPLOY',
    'NATIONWIDE COMMUNITY'
  ],
  speed = 28,
  className = ''
}) {
  return (
    <div className={`marquee-container ${className}`} aria-hidden="true">
      <div
        className="marquee-content"
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((item, idx) => (
          <div key={`m1-${idx}`} className="marquee-item">
            <span>{item}</span>
            <span className="dot" />
          </div>
        ))}
      </div>
      <div
        className="marquee-content"
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {items.map((item, idx) => (
          <div key={`m2-${idx}`} className="marquee-item">
            <span>{item}</span>
            <span className="dot" />
          </div>
        ))}
      </div>
    </div>
  );
}
