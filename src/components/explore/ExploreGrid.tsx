
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ExploreTile from './ExploreTile';
import type { ExploreItem } from './types';

interface ExploreGridProps {
  items: ExploreItem[];
}

const ExploreGrid: React.FC<ExploreGridProps> = ({ items }) => {
  return (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            visible: {
                transition: {
                    staggerChildren: 0.05,
                },
            },
        }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-4"
    >
      {items.map((item, index) => (
        <motion.div
          key={`${item.id}-${index}`}
          className="relative w-full aspect-square overflow-hidden rounded-lg"
          variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
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
