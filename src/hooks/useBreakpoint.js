// Responsive breakpoint hook: returns isMobile, isTablet, isDesktop based on window width
// Mobile: < 640px | Tablet: 640-1023px | Desktop: >= 1024px

import { useState, useEffect } from 'react';

function getBreakpoint(w) {
  if (w < 640)  return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function useBreakpoint() {
  const [bp, setBp] = useState(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    bp,
    isMobile:  bp === 'mobile',
    isTablet:  bp === 'tablet',
    isDesktop: bp === 'desktop',
  };
}
