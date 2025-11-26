
'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useIntersection } from '@/hooks/use-intersection';
import { dummyUsers, dummyPosts, dummyLiveBroadcasts } from '@/lib/dummy-data';
import type { User as UserType } from '@/lib/types';
import ExploreGrid from '@/components/explore/ExploreGrid';
import type { ExploreItem } from '@/components/explore/types';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ITEMS_PER_PAGE = 18;

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    
    const [displayedItems, setDisplayedItems] = useState<ExploreItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const allExploreItems: ExploreItem[] = useMemo(() => {
        const photos: ExploreItem[] = dummyPosts.filter(p => p.type === 'photo');
        const reels: ExploreItem[] = dummyPosts.filter(p => p.type === 'reel');
        const videos: ExploreItem[] = dummyPosts.filter(p => p.type === 'video');
        const liveStreams: ExploreItem[] = dummyLiveBroadcasts.filter(s => s.isLive).map(s => ({
            ...s,
            type: 'live' as const,
        }));

        // Combine and shuffle for a mixed feed
        return shuffleArray([...photos, ...reels, ...videos, ...liveStreams]);
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

    const loaderRef = useRef<HTMLDivElement>(null);
    const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });

    useEffect(() => {
        if (isLoaderVisible && hasMore) {
            const timer = setTimeout(() => {
                loadMoreItems();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isLoaderVisible, hasMore, loadMoreItems]);


    const filteredUsers = useMemo(() => {
        if (!searchTerm) return [];
        return dummyUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10);
    }, [searchTerm]);

    const showSearchResults = isFocused || searchTerm.length > 0;

  return (
    <SidebarProvider>
      <Sidebar className="w-96 hidden md:flex">
        <SidebarHeader className="p-4 h-auto">
          <h1 className="text-2xl font-bold py-4">Search</h1>
          <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="w-full rounded-lg bg-muted pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
          </div>
        </SidebarHeader>
        <Separator/>
        <SidebarContent className="py-4">
            {showSearchResults ? (
                 <div className="px-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <Link href={`/${user.username}`} key={user.id}>
                                <div className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} alt={user.username} />
                                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm">{user.username}</p>
                                        <p className="text-xs text-muted-foreground">{user.fullName}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                       <div className="p-4 text-center text-sm text-muted-foreground">
                            No users found for &quot;{searchTerm}&quot;.
                        </div>
                    )}
                 </div>
            ) : (
                <div className="px-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-sm">Recent</h3>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs">Clear all</Button>
                    </div>
                     <div className="p-4 text-center text-sm text-muted-foreground">
                        No recent searches.
                    </div>
                </div>
            )}
        </SidebarContent>
      </Sidebar>

      <div className="flex min-h-svh bg-background">
        {/* Collapsed Sidebar Nav */}
        <div className="fixed left-0 top-0 h-full z-50 hidden md:flex flex-col border-r bg-background p-3 gap-4 w-20">
            <div className="p-2">
                 <svg aria-label="Instagram" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M32.8,0.6c-4.3,0-4.8,0-13.6,0C4.9,0.6,0.6,4.9,0.6,19.2c0,8.7,0,9.3,0,13.6c0,14.3,4.3,18.6,18.6,18.6c8.7,0,9.3,0,13.6,0c14.3,0,18.6-4.3,18.6-18.6c0-4.3,0-4.8,0-13.6C51.4,4.9,47.1,0.6,32.8,0.6z M47.4,32.8c0,12.1-3.4,15.4-15.4,15.4c-8.7,0-9.2,0-13.6,0c-12.1,0-15.4-3.4-15.4-15.4c0-8.7,0-9.2,0-13.6c0-12.1,3.4-15.4,15.4-15.4c4.5,0,4.9,0,13.6,0c12.1,0,15.4,3.4,15.4,15.4C47.4,23.6,47.4,24.2,47.4,32.8z"></path><path d="M25.9,12.5c-7.4,0-13.4,6-13.4,13.4s6,13.4,13.4,13.4s13.4-6,13.4-13.4S33.3,12.5,25.9,12.5z M25.9,35.3c-5.2,0-9.4-4.2-9.4-9.4s4.2-9.4,9.4-9.4s9.4,4.2,9.4,9.4S31.1,35.3,25.9,35.3z"></path><circle cx="38.3" cy="11.1" r="3.2"></circle></svg>
            </div>
            <SidebarNav isCollapsed />
        </div>

        <main className="flex-1 md:ml-20 lg:ml-96 bg-background min-h-svh">
             <div className="container mx-auto max-w-5xl py-4 px-1 md:px-4">
                <ExploreGrid items={displayedItems} />
                {hasMore && (
                  <div ref={loaderRef} className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
            </div>
        </main>
      </div>

    </SidebarProvider>
  );
}
