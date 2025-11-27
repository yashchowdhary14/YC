
'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Bookmark } from 'lucide-react';
import PostTile from '../app/post-tile';
import { Skeleton } from '../ui/skeleton';
import { useSavedPosts } from '@/hooks/use-saved-posts';
import { useIntersection } from '@/hooks/use-intersection';

interface SavedPostsGridProps {
  userId: string;
}

const SavedPostsGrid: React.FC<SavedPostsGridProps> = ({ userId }) => {
  const { posts, isLoading, isLoadingMore, hasMore, loadMore } = useSavedPosts(userId);
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
      <div className="grid grid-cols-3 auto-rows-fr gap-1 md:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="relative w-full aspect-square overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
      return (
          <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-4">
              <div className="border-2 border-foreground rounded-full p-4">
                <Bookmark className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold">No Saved Posts</h3>
              <p>Posts you save will appear here.</p>
          </div>
      )
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-3 auto-rows-fr gap-1 md:gap-4"
      >
        {posts.map((post) => (
          <motion.div
            key={post.id}
            className="relative w-full aspect-square overflow-hidden"
            variants={itemVariants}
            layout
          >
            <PostTile post={post} />
          </motion.div>
        ))}
      </motion.div>

      <div ref={loaderRef} className="col-span-3 mt-8 flex justify-center">
        {isLoadingMore && (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        )}
      </div>
    </>
  );
};

export default SavedPostsGrid;

    