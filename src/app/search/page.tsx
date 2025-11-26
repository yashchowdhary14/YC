
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
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
import { dummyUsers, dummyPosts, dummyReels, dummyVideos, dummyStreams } from '@/lib/dummy-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { User as UserType } from '@/lib/types';
import ExploreGrid from '@/components/explore/ExploreGrid';
import type { ExploreItem } from '@/components/explore/types';

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
    const { user } = useUser();
    
    const [displayedItems, setDisplayedItems] = useState<ExploreItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const allExploreItems: ExploreItem[] = useMemo(() => {
        const photos = dummyPosts.map(p => {
            const image = PlaceHolderImages.find(img => img.id === p.imageId)!;
            return {
                id: p.id,
                type: 'photo' as const,
                imageUrl: image.imageUrl,
                imageHint: image.imageHint,
                likes: p.likes.length,
                comments: p.commentsCount,
            }
        });
        const reels = dummyReels.map(r => ({
            id: r.id,
            type: 'reel' as const,
            imageUrl: r.thumbnailUrl || `https://picsum.photos/seed/${r.id}/400/700`,
            imageHint: 'reel video',
            likes: r.likes,
            comments: r.commentsCount,
        }));
        const videos = dummyVideos.map(v => ({
            id: v.id,
            type: 'video' as const,
            imageUrl: v.thumbnailUrl,
            imageHint: 'video content',
            likes: v.views, // Using views as likes for variety
            comments: Math.floor(v.views / 100),
        }));
        const liveStreams = dummyStreams.filter(s => s.isLive).map(s => ({
            id: s.id,
            type: 'live' as const,
            imageUrl: s.thumbnailUrl || `https://picsum.photos/seed/${s.id}/640/360`,
            imageHint: 'live stream',
            viewerCount: s.viewerCount,
            streamer: s.user
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
    
    const loadMoreItems = () => {
        if (!hasMore) return;
        const nextPage = page + 1;
        const newItems = allExploreItems.slice(0, nextPage * ITEMS_PER_PAGE);
        setDisplayedItems(newItems);
        setPage(nextPage);
        setHasMore(newItems.length < allExploreItems.length);
    };

    const loaderRef = useRef<HTMLDivElement>(null);
    const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });

    useEffect(() => {
        if (isLoaderVisible && hasMore) {
            const timer = setTimeout(() => {
                loadMoreItems();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isLoaderVisible, hasMore]);


    const filteredUsers = useMemo(() => {
        if (!searchTerm) return [];
        return dummyUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10);
    }, [searchTerm]);

    const showSearchResults = isFocused && searchTerm.length > 0;

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
        <AppHeader />
        <main className="bg-background min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            <div className="sticky top-[calc(3.5rem)] z-20 bg-background py-4 mb-4 -mt-4">
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
                 {showSearchResults && (
                    <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-30 shadow-lg">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <Link href={`/${user.username}`} key={user.id}>
                                    <div className="flex items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer">
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
                    </Card>
                )}
              </div>
            </div>
            
            <ExploreGrid items={displayedItems} />

            <div ref={loaderRef} className="flex justify-center items-center py-8">
                {hasMore && <Button onClick={loadMoreItems} variant="secondary">Load More</Button>}
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
