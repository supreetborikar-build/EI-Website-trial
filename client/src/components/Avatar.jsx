import React, { useState } from 'react';

/**
 * High-Reliability Avatar with Gradient Initials Fallback
 * Guarantees zero broken images or awkward alt-text leaks.
 */
export default function Avatar({ src, alt = '', size = 44, className = '', style = {} }) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'EI';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getGradient = (name = '') => {
    const gradients = [
      'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
      'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
      'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)',
      'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return gradients[Math.abs(hash) % gradients.length];
  };

  const sizeStyle = typeof size === 'number' ? `${size}px` : size;
  const fontSize = typeof size === 'number' ? `${Math.max(11, Math.round(size * 0.38))}px` : '0.85rem';

  if (!src || hasError) {
    return (
      <div
        className={`avatar-fallback ${className}`}
        style={{
          width: sizeStyle,
          height: sizeStyle,
          borderRadius: '50%',
          background: getGradient(alt),
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: fontSize,
          letterSpacing: '0.04em',
          userSelect: 'none',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          ...style
        }}
      >
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
      style={{
        width: sizeStyle,
        height: sizeStyle,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
        ...style
      }}
    />
  );
}
