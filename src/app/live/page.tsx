
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import type { Stream, Category, User } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import FeaturedStreamCarousel from '@/components/live/featured-stream-carousel';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dummyStreams, dummyCategories, dummyUsers } from '@/lib/dummy-data';

export default function LivePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const { liveStreams, categories, recommendedChannels, featuredStreams, justChattingStreams } = useMemo(() => {
    // Hydrate stream data with user data
    const hydratedStreams: Stream[] = dummyStreams.map(stream => {
      const streamer = dummyUsers.find(u => u.id === stream.streamerId);
      return {
        ...stream,
        thumbnailUrl: stream.thumbnailUrl || `https://picsum.photos/seed/${stream.id}/640/360`,
        user: {
          ...streamer!,
          avatarUrl: streamer?.avatarUrl || `https://picsum.photos/seed/${streamer?.id}/100/100`,
        }
      };
    });

    const live = hydratedStreams.filter(s => s.isLive).sort((a, b) => b.viewerCount - a.viewerCount);
    const cats = dummyCategories.sort((a, b) => a.name.localeCompare(b.name));
    
    const recommended = live.slice(0, 7);
    const featured = live.slice(0, 5);
    const justChatting = live.filter(s => s.category === 'Just Chatting');

    return {
      liveStreams: live,
      categories: cats,
      recommendedChannels: recommended,
      featuredStreams: featured,
      justChattingStreams: justChatting
    };
  }, []);
  
  const isLoading = isUserLoading;

  if (isLoading && !isPageLoaded) {
     return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-900 text-white overscroll-contain">
        <LiveSidebar 
          recommendedChannels={recommendedChannels} 
          recommendedCategories={categories.slice(0,6)} 
        />
        <SidebarInset className="flex-1 flex flex-col">
          <AppHeader>
             <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </SidebarTrigger>
          </AppHeader>
          <main className={cn(
            "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-contain transition-opacity duration-500 ease-in-out",
            isPageLoaded ? "opacity-100" : "opacity-0"
          )}>
              {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
              ) : (
                <div className="space-y-12">
                    <FeaturedStreamCarousel streams={featuredStreams} />

                    <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">
                          <span className="text-primary hover:underline cursor-pointer">Live channels</span> we think you'll like
                        </h2>
                        <StreamGrid streams={liveStreams.slice(0,12)} />
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">
                            <span className="text-primary hover:underline cursor-pointer">Categories</span> we think you'll like
                        </h2>
                        <CategoryGrid categories={categories} />
                    </div>

                    {justChattingStreams.length > 0 && (
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">
                          <span className="text-primary hover:underline cursor-pointer">Just Chatting</span> channels
                        </h2>
                        <StreamGrid streams={justChattingStreams} />
                      </div>
                    )}
                </div>
              )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
