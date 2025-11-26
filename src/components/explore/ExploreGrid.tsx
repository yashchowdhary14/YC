
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ExploreTile from './ExploreTile';
import type { ExploreItem } from './types';
import PostTile from '../app/post-tile';
import { Post } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface ExploreGridProps {
  items: (ExploreItem | Post)[];
  isLoading?: boolean;
}

const ExploreGrid: React.FC<ExploreGridProps> = ({ items, isLoading = false }) => {
  const skeletonCount = 18;

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
        className="grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-1 md:gap-4"
    >
      {isLoading ? (
        Array.from({ length: skeletonCount }).map((_, index) => (
             <motion.div
                key={`skeleton-${index}`}
                className="relative w-full aspect-square overflow-hidden rounded-none md:rounded-lg"
                 variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
                }}
             >
                <Skeleton className="w-full h-full" />
            </motion.div>
        ))
      ) : (
          items.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              className="relative w-full aspect-square overflow-hidden rounded-none md:rounded-lg"
              variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
              }}
              layout
            >
              {'type' in item && item.type !== 'photo' && item.type !== 'reel' && item.type !== 'video' ? (
                 <ExploreTile item={item as ExploreItem} />
              ) : (
                 <PostTile post={item as Post} />
              )}
            </motion.div>
          ))
      )}
    </motion.div>
  );
};

export default ExploreGrid;
