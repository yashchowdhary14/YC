
'use client';

import { useEffect, useState } from "react"

// This hook is used to determine if the app should render the mobile UI.
// For development purposes, you can force it to return true.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // You can adjust this breakpoint as needed
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return true; // Set to true to force phone preview
}
