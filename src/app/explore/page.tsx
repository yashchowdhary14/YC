
'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { dummyPosts, dummyLiveBroadcasts } from '@/lib/dummy-data';
import type { ExploreItem } from '@/components/explore/types';
import ExploreGrid from '@/components/explore/ExploreGrid';
import { useIntersection } from '@/hooks/use-intersection';

const ITEMS_PER_PAGE = 18;

export default function ExplorePage() {
  const [displayedItems, setDisplayedItems] = useState<ExploreItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });

  const allExploreItems = useMemo((): ExploreItem[] => {
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
    
    // Simple shuffle for variety
    const combined = [...postsAsItems, ...liveAsItems];
    for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined;
  }, []);

  // Initial items load
  useEffect(() => {
    setDisplayedItems(allExploreItems.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(allExploreItems.length > ITEMS_PER_PAGE);
  }, [allExploreItems]);

  const loadMoreItems = useCallback(() => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const newItems = allExploreItems.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedItems(newItems);
    setPage(nextPage);
    setHasMore(newItems.length < allExploreItems.length);
  }, [page, hasMore, allExploreItems]);

  useEffect(() => {
    if (isLoaderVisible && hasMore) {
      const timer = setTimeout(() => {
        loadMoreItems();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaderVisible, hasMore, loadMoreItems]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader>
             <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </SidebarTrigger>
        </AppHeader>
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-4">Explore</h1>
            <ExploreGrid items={displayedItems} />
             {hasMore && (
                <div ref={loaderRef} className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
             )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
