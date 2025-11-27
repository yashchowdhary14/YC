'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Bookmark, Grid, List } from 'lucide-react';
import PostTile from '../app/post-tile';
import { Skeleton } from '../ui/skeleton';
import { useSavedPosts } from '@/hooks/use-saved-posts';
import { useIntersection } from '@/hooks/use-intersection';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

interface SavedPostsGridProps {
  userId: string;
}

const SavedPostsGrid: React.FC<SavedPostsGridProps> = ({ userId }) => {
  const { posts, isLoading, isLoadingMore, hasMore, loadMore } = useSavedPosts(userId);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
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

  const renderContent = () => {
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

    if (viewMode === 'grid') {
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
      )
    }
    // TODO: Implement List View in a future step
    return <div className="text-center py-16">List view coming soon!</div>
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Saved</h2>
            <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('grid')}
                  className={cn("h-8 w-8 p-0", viewMode === 'grid' && 'bg-background hover:bg-background/80 text-foreground')}
                >
                    <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('list')}
                  className={cn("h-8 w-8 p-0", viewMode === 'list' && 'bg-background hover:bg-background/80 text-foreground')}
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {renderContent()}

        <div ref={loaderRef} className="col-span-full mt-8 flex justify-center">
            {isLoadingMore && (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
        </div>
    </div>
  );
};

export default SavedPostsGrid;
