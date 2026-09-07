import React, { useRef, useState, useCallback } from 'react';

/**
 * Magnetic Button Component
 * Adds physics-based cursor attraction to buttons and links on desktop.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.28,
  as: Component = 'div',
  ...props
}) {
  const wrapRef = useRef(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0)');
  const [transition, setTransition] = useState('transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)');

  const handleMouseMove = useCallback((e) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setTransition('transform 0.1s ease-out');
    setTransform(`translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`);
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setTransition('transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)');
    setTransform('translate3d(0px, 0px, 0)');
  }, []);

  return (
    <Component
      ref={wrapRef}
      className={`magnetic-wrap ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        display: 'inline-block'
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
