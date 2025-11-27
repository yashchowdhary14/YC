'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import PostCard from '@/components/app/post-card';
import StoriesCarousel from '@/components/app/stories-carousel';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalFeedStore } from '@/store/localFeedStore';
import { useUser } from '@/firebase';
import { usePosts } from '@/hooks/use-posts';
import type { Post } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useIntersection } from '@/hooks/use-intersection';

function PostCardSkeleton() {
    return (
        <div className="mb-4">
            <div className="flex items-center p-2 px-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <Skeleton className="w-full aspect-square" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}


export default function Home() {
  const { user } = useUser();
  const loaderRef = useRef<HTMLDivElement>(null);
  
  // The usePosts hook now fetches real data. We assume for now it fetches for 'all' users.
  // In a real feed, this would be more complex (e.g., fetching from followed users).
  // For this step, we'll fetch all posts to demonstrate the feed mechanism.
  // We'll pass a placeholder or empty string for userId to signify "all posts".
  const { posts, isLoading, isLoadingMore, hasMore, loadMore } = usePosts('');
  const localItems = useLocalFeedStore(s => s.items);

  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });
  useEffect(() => {
    if (isLoaderVisible && hasMore && !isLoadingMore) {
        loadMore();
    }
  }, [isLoaderVisible, hasMore, isLoadingMore, loadMore]);

  const newPosts = useMemo(() => {
    if (!user) return [];
    return localItems.filter(item => item.mode === 'post').map(item => ({
        id: item.id,
        type: 'post',
        mediaUrl: item.mediaUrls[0],
        thumbnailUrl: item.thumbnailUrl,
        uploaderId: user.uid,
        user: { 
            id: user.uid, 
            username: user.displayName?.split(' ')[0].toLowerCase() || 'user', 
            avatarUrl: user.photoURL || '',
            fullName: user.displayName || 'User',
            bio: '',
            followersCount: 0,
            followingCount: 0,
            verified: false,
        },
        caption: item.metadata.caption,
        tags: item.metadata.tags,
        views: 0,
        likes: 0,
        commentsCount: 0,
        createdAt: new Date(item.createdAt),
    } as Post));
  }, [localItems, user]);

  const suggestedPosts = useMemo(() => {
    // Combine locally created posts with fetched posts, ensuring no duplicates
    const postMap = new Map<string, Post>();
    newPosts.forEach(post => postMap.set(post.id, post));
    posts.forEach(post => {
        if (!postMap.has(post.id)) {
            postMap.set(post.id, post);
        }
    });
    return Array.from(postMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, newPosts]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-y-auto pt-14 md:ml-20 lg:ml-72 md:pb-0 pb-14">
        <div className="w-full max-w-lg mx-auto">
            <StoriesCarousel />
            <Separator />
            <div className="py-2">
              {isLoading && suggestedPosts.length === 0 && Array.from({length: 3}).map((_, i) => <PostCardSkeleton key={i}/>) }
              
              {suggestedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
              ))}
              
              <div ref={loaderRef} className="flex justify-center items-center py-10">
                {isLoadingMore && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
              </div>

               {!isLoading && !hasMore && suggestedPosts.length > 0 && (
                 <div className="text-center py-10 text-muted-foreground">
                    <p>You've reached the end of the feed.</p>
                 </div>
               )}
            </div>
        </div>
      </main>
    </div>
  );
}
