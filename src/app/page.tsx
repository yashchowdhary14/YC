'use client';

import { useMemo, useState, useEffect } from 'react';
import PostCard from '@/components/app/post-card';
import AppHeader from '@/components/app/header';
import StoriesCarousel from '@/components/app/stories-carousel';
import { Separator } from '@/components/ui/separator';
import MobileNav from '@/components/app/mobile-nav';
import { dummyPosts } from '@/lib/dummy-data';
import type { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function PostCardSkeleton() {
    return (
        <div className="mb-4">
            <div className="flex items-center p-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="ml-2 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-20 ml-auto" />
            </div>
            <Skeleton className="w-full aspect-square" />
            <div className="p-2 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching posts
    setIsLoading(true);
    setTimeout(() => {
        setPosts(dummyPosts);
        setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);

  const suggestedPosts = useMemo(() => {
    return posts.slice(0, 10);
  }, [posts]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* The main header is now part of the layout, so we might not need it here unless it's page-specific */}
      <main className="flex-1 overflow-y-auto pt-14 md:ml-20 lg:ml-72 md:pb-0 pb-14">
        <div className="w-full max-w-lg mx-auto">
            <StoriesCarousel />
            <Separator />
            <div className="py-2">
              {isLoading && Array.from({length: 3}).map((_, i) => <PostCardSkeleton key={i}/>) }
              {!isLoading && suggestedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
              ))}
            </div>
        </div>
      </main>
      {/* MobileNav is now in the root layout, so it doesn't need to be here */}
    </div>
  );
}
