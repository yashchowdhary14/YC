
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import type { LiveBroadcast, Category } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import FeaturedStreamCarousel from '@/components/live/featured-stream-carousel';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import SidebarNav from '@/components/app/sidebar-nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dummyLiveBroadcasts, dummyCategories } from '@/lib/dummy-data';

export default function LivePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [liveBroadcasts, setLiveBroadcasts] = useState<LiveBroadcast[]>(dummyLiveBroadcasts);
  const [categories, setCategories] = useState<Category[]>(dummyCategories);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Effect to listen for storage changes to update live status
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dummyLiveBroadcasts' && event.newValue) {
        setLiveBroadcasts(JSON.parse(event.newValue));
      }
    };
    
    const storedBroadcasts = localStorage.getItem('dummyLiveBroadcasts');
    if (storedBroadcasts) {
      setLiveBroadcasts(JSON.parse(storedBroadcasts));
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const { liveStreams, recommendedChannels, featuredStreams, justChattingStreams } = useMemo(() => {
    const live = (liveBroadcasts || []).filter(s => s.isLive).sort((a, b) => b.viewerCount - a.viewerCount);
    
    const recommended = live.slice(0, 7);
    const featured = live.slice(0, 5);
    const justChatting = live.filter(s => s.category === 'Just Chatting');

    return {
      liveStreams: live,
      recommendedChannels: recommended,
      featuredStreams: featured,
      justChattingStreams: justChatting
    };
  }, [liveBroadcasts]);

  const sortedCategories = useMemo(() => {
    return (categories || []).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);
  
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
        <Sidebar>
            <SidebarHeader>
                <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarNav />
            </SidebarContent>
        </Sidebar>

        <div className="flex min-h-screen bg-zinc-900 text-white overscroll-contain">
            <LiveSidebar 
              recommendedChannels={recommendedChannels} 
              recommendedCategories={sortedCategories.slice(0,6)} 
            />
            <div className="flex-1 flex flex-col overscroll-contain md:ml-60">
              <AppHeader>
                  <div className="md:hidden">
                    {/* This is a placeholder for the mobile sidebar trigger for the LiveSidebar */}
                    {/* We can wire this up if mobile-specific behavior for LiveSidebar is needed */}
                  </div>
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
                          {featuredStreams.length > 0 && <FeaturedStreamCarousel streams={featuredStreams} />}

                          {liveStreams.length > 0 ? (
                          <div>
                              <h2 className="text-xl md:text-2xl font-bold mb-4">
                                  <span className="text-primary hover:underline cursor-pointer">Live channels</span> we think you'll like
                              </h2>
                              <StreamGrid streams={liveStreams.slice(0,12)} />
                          </div>
                          ) : (
                          <div className="text-center py-24 bg-zinc-800/50 rounded-lg">
                              <h2 className="text-2xl font-bold">No Channels are Live</h2>
                              <p className="text-muted-foreground mt-2">Check back later to see who is streaming.</p>
                          </div>
                          )}

                          <Separator className="bg-zinc-700" />

                          {sortedCategories.length > 0 && (
                          <div>
                              <h2 className="text-xl md:text-2xl font-bold mb-4">
                                  <span className="text-primary hover:underline cursor-pointer">Categories</span> we think you'll like
                              </h2>
                              <CategoryGrid categories={sortedCategories} />
                          </div>
                          )}

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
            </div>
        </div>
    </SidebarProvider>
  );
}
