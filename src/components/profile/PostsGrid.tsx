
'use client';

import { motion } from 'framer-motion';
import type { Post } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import PostTile from '../app/post-tile';

interface PostsGridProps {
  posts: Post[];
  isLoading?: boolean;
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, isLoading = false }) => {
  const skeletonCount = 12;

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
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`skeleton-${index}`} className="relative w-full aspect-square overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
      return (
          <div className="text-center py-16 text-muted-foreground">
              <h3 className="text-xl font-semibold">No posts yet</h3>
              <p>Posts from this user will appear here.</p>
          </div>
      )
  }

  return (
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
  );
};

export default PostsGrid;
