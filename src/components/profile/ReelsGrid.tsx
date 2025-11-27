
'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Video } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useIntersection } from '@/hooks/use-intersection';
import { useReels } from '@/hooks/use-reels';
import ReelTile from './ReelTile';

interface ReelsGridProps {
  userId: string;
}

const ReelsGrid: React.FC<ReelsGridProps> = ({ userId }) => {
  const { reels, isLoading, isLoadingMore, hasMore, loadMore } = useReels(userId);
  const loaderRef = useRef<HTMLDivElement>(null);

  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });
  
  if (isLoaderVisible && hasMore && !isLoadingMore) {
      loadMore();
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.98 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-1 md:gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="relative w-full aspect-[9/16] overflow-hidden rounded-md">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  if (reels.length === 0) {
      return (
          <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-4">
              <div className="border-2 border-foreground rounded-full p-4">
                <Video className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold">No Reels Yet</h3>
              <p>When this user posts reels, they will appear here.</p>
          </div>
      )
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-1 md:gap-2"
      >
        {reels.map((reel) => (
          <motion.div
            key={reel.id}
            className="relative w-full aspect-[9/16] overflow-hidden rounded-md"
            variants={itemVariants}
            layout
          >
            <ReelTile reel={reel} />
          </motion.div>
        ))}
      </motion.div>

      <div ref={loaderRef} className="col-span-full mt-8 flex justify-center">
        {isLoadingMore && (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        )}
      </div>
    </>
  );
};

export default ReelsGrid;
