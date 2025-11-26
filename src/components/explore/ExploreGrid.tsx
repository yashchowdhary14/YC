
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
    // Every 7th item is a large vertical tile.
    if ((index + 1) % 7 === 1) return "row-span-2 col-span-1";
    // Every 11th item is a large horizontal tile.
    if ((index + 1) % 11 === 1) return "row-span-1 col-span-2";
    // Default is a standard 1x1 tile.
    return "row-span-1 col-span-1";
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
        className="grid grid-cols-3 auto-rows-[minmax(0,1fr)] gap-1"
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
