
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  if (isLoading) {
    return (
       <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-1 md:gap-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`skeleton-${index}`} className="relative w-full aspect-square overflow-hidden rounded-none md:rounded-lg">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-1 md:gap-4"
    >
      {items.map((item, index) => (
        <motion.div
          key={`${item.id}-${index}`}
          className="relative w-full aspect-square overflow-hidden rounded-none md:rounded-lg"
          variants={itemVariants}
          layout
        >
          {'type' in item && item.type !== 'photo' && item.type !== 'reel' && item.type !== 'video' ? (
            <ExploreTile item={item as ExploreItem} />
          ) : (
            <PostTile post={item as Post} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExploreGrid;
