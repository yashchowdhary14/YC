
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ExploreTile from './ExploreTile';
import type { ExploreItem } from './types';

interface ExploreGridProps {
  items: ExploreItem[];
}

const getSpan = (index: number): string => {
    // These patterns create the dynamic Instagram-style grid.
    const patternIndex = index % 18;
    if (patternIndex === 0) return "col-span-1 row-span-2"; // Tall
    if (patternIndex === 5) return "col-span-1 row-span-2"; // Tall
    if (patternIndex === 8) return "col-span-1 row-span-2"; // Tall
    if (patternIndex === 13) return "col-span-2 row-span-2"; // Large square
    return "col-span-1 row-span-1"; // Standard square
}

const ExploreGrid: React.FC<ExploreGridProps> = ({ items }) => {
  return (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            visible: {
                transition: {
                    staggerChildren: 0.025,
                },
            },
        }}
        className="grid grid-cols-3 auto-rows-fr gap-1"
        style={{ gridAutoRows: 'minmax(0, 1fr)' }}
    >
      {items.map((item, index) => (
        <motion.div
          key={`${item.id}-${index}`}
          className={cn('relative w-full overflow-hidden first:rounded-tl-lg', getSpan(index))}
          variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
          }}
          layout
        >
          <ExploreTile item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExploreGrid;
