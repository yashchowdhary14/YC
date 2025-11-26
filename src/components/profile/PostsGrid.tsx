
'use client';

import { Post } from '@/lib/types';
import PostTile from '../app/post-tile';
import { cn } from '@/lib/utils';

interface PostsGridProps {
  posts: Post[];
  columns?: number;
}

export default function PostsGrid({ posts, columns = 3 }: PostsGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="text-xl font-semibold">No Posts Yet</h3>
        <p>This user hasn't shared any posts.</p>
      </div>
    );
  }

  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  return (
    <div className={cn(
        "grid gap-0.5 md:gap-1 mt-1",
        gridClasses[columns as keyof typeof gridClasses] || 'grid-cols-3'
    )}>
      {posts.map((post) => (
        <PostTile key={post.id} post={post} />
      ))}
    </div>
  );
}
