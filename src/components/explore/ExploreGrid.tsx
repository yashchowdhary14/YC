
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
    if ((index % 18) === 0) return "col-span-2 row-span-2"; // Large square
    if ((index % 18) === 7) return "col-span-1 row-span-2"; // Tall
    if ((index % 18) === 12) return "col-span-2 row-span-1"; // Wide
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
        className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[minmax(0,1fr)] gap-1"
    >
      {items.map((item, index) => (
        <motion.div
          key={`${item.id}-${index}`}
          className={cn('relative w-full overflow-hidden rounded-md', getSpan(index))}
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
