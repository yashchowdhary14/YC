
'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { dummyPosts, dummyLiveBroadcasts } from '@/lib/dummy-data';
import type { ExploreItem } from '@/components/explore/types';
import ExploreGrid from '@/components/explore/ExploreGrid';
import { useIntersection } from '@/hooks/use-intersection';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 18;

export default function ExplorePage() {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<ExploreItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });

  // In a real app, this would be an API call.
  // Here, we simulate a fetch and shuffle.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        const postsAsItems: ExploreItem[] = dummyPosts.map(p => ({
            ...p,
            thumbnailUrl: p.thumbnailUrl,
        }));

        const liveAsItems: ExploreItem[] = dummyLiveBroadcasts
            .filter(s => s.isLive)
            .map(s => ({
                ...s,
                type: 'live',
                id: s.liveId,
                thumbnailUrl: s.liveThumbnail,
                caption: s.title,
                likes: undefined,
                commentsCount: undefined,
            }));
        
        const combined = [...postsAsItems, ...liveAsItems];
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        setItems(combined);
        setDisplayedItems(combined.slice(0, ITEMS_PER_PAGE));
        setHasMore(combined.length > ITEMS_PER_PAGE);
        setIsLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);


  const loadMoreItems = useCallback(() => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    const newItems = items.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedItems(newItems);
    setPage(nextPage);
    setHasMore(newItems.length < items.length);
  }, [page, hasMore, items, isLoading]);

  useEffect(() => {
    if (isLoaderVisible && hasMore && !isLoading) {
      const timer = setTimeout(() => {
        loadMoreItems();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaderVisible, hasMore, loadMoreItems, isLoading]);

  return (
      <div className="min-h-screen bg-background pt-14">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-4">Explore</h1>
          <ExploreGrid items={displayedItems} isLoading={isLoading} />
           {hasMore && !isLoading && (
              <div ref={loaderRef} className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
           )}
        </div>
      </div>
  );
}
