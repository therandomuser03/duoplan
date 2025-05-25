import { useEffect, useState } from 'react';

type Breakpoint = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
};

/**
 * Hook to track screen width and categorize it into breakpoints.
 * @returns Screen width and device type flags.
 */
export default function useBreakpoint(): Breakpoint {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth); // Initialize on mount
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}
