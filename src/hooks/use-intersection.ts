
'use client';

import { useState, useEffect, type RefObject } from 'react';

export function useIntersection(
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}
