import { useEffect, useRef } from 'react';

/**
 * useScrollReveal hook
 * Observes elements with [data-reveal] or .reveal-on-scroll within the container
 * and adds the .revealed class smoothly when they enter viewport.
 */
export default function useScrollReveal(dependencies = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const root = containerRef.current || document;
    const elements = root.querySelectorAll('[data-reveal], .reveal-on-scroll');

    if (elements.length === 0) return;

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;

            // Apply stagger delay if defined in dataset or based on grid index
            if (el.dataset.revealDelay) {
              el.style.transitionDelay = `${el.dataset.revealDelay}ms`;
            }

            el.classList.add('revealed');
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((el) => {
      // Don't re-observe if already revealed
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, dependencies);

  return containerRef;
}
