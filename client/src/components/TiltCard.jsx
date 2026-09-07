import React, { useRef, useState, useCallback } from 'react';

/**
 * 3D Interactive Tilt Card Component
 * Tilts back the specific section of the card under the user's cursor:
 * Putting cursor at any part causes that exact part to tilt back into the screen.
 */
export default function TiltCard({
  children,
  className = '',
  style = {},
  maxTilt = 3.5,
  perspective = 1400,
  scale = 1.01,
  glare = true,
  as: Component = 'div',
  ...props
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  );
  const [transitionStyle, setTransitionStyle] = useState('transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const rafId = useRef(null);

  const handleMouseEnter = useCallback(() => {
    setTransitionStyle('transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)');
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized coordinates from -1 to +1
      const px = Math.min(Math.max((x - centerX) / centerX, -1), 1);
      const py = Math.min(Math.max((y - centerY) / centerY, -1), 1);

      // Auto-damp tilt on wide or tall elements so large cards never tilt excessively
      const maxDim = Math.max(rect.width, rect.height, 400);
      const dimensionDamp = Math.min(1, 400 / maxDim);
      const effectiveTilt = Number((maxTilt * dimensionDamp).toFixed(2));
      const effectiveScale = rect.width > 600 ? 1 + (scale - 1) * 0.4 : scale;

      // Subtle, tactile physical tilt:
      const rotateX = (-py * effectiveTilt).toFixed(2);
      const rotateY = (px * effectiveTilt).toFixed(2);

      setTransitionStyle('transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)');
      setTransformStyle(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${effectiveScale}, ${effectiveScale}, ${effectiveScale})`
      );

      if (glare) {
        const glareX = ((x / rect.width) * 100).toFixed(1);
        const glareY = ((y / rect.height) * 100).toFixed(1);
        setGlareStyle({
          opacity: 0.1,
          x: glareX,
          y: glareY
        });
      }
    });
  }, [maxTilt, perspective, scale, glare]);

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    setTransitionStyle('transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)');
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);

    if (glare) {
      setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [perspective, glare]);

  return (
    <Component
      ref={cardRef}
      className={`tilt-card-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: transformStyle || undefined,
        transition: transitionStyle,
        willChange: 'transform',
        ...style
      }}
      {...props}
    >
      {children}

      {glare && (
        <div
          className="tilt-card-glare"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 10,
            opacity: glareStyle.opacity,
            transition: 'opacity 0.35s ease-out',
            background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 60%)`
          }}
        />
      )}
    </Component>
  );
}
