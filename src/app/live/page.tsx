
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import type { LiveBroadcast, Category } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import FeaturedStreamCarousel from '@/components/live/featured-stream-carousel';
import { cn } from '@/lib/utils';
import { dummyLiveBroadcasts, dummyCategories } from '@/lib/dummy-data';

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

  // --- Start of Local Data Usage ---
  // Replaced Firestore hooks with direct import of dummy data.
  const liveStreams: LiveBroadcast[] = dummyLiveBroadcasts;
  const categories: Category[] = dummyCategories;
  const justChattingStreams: LiveBroadcast[] = dummyLiveBroadcasts.filter(s => s.category === 'Just Chatting' && s.isLive).slice(0, 10);
  // --- End of Local Data Usage ---
  
  const { recommendedChannels, featuredStreams } = useMemo(() => {
    if (!liveStreams) return { recommendedChannels: [], featuredStreams: [] };
    const sorted = [...liveStreams]
        .filter(s => s.isLive)
        .sort((a, b) => b.viewerCount - a.viewerCount);
    return {
      recommendedChannels: sorted.slice(0, 7),
      featuredStreams: sorted.slice(0, 5),
    };
  }, [liveStreams]);

  const isLoading = isUserLoading;

  if (isLoading && !isPageLoaded) {
     return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white overscroll-contain">
        {/* Desktop Sidebar - Will be hidden on mobile by its own internal logic */}
        <LiveSidebar 
          recommendedChannels={recommendedChannels} 
          recommendedCategories={(categories?.slice(0,6) || [])} 
        />
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overscroll-contain pt-14 md:ml-60">
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

                      {liveStreams && liveStreams.length > 0 ? (
                      <div>
                          <h2 className="text-xl md:text-2xl font-bold mb-4">
                              <span className="text-primary hover:underline cursor-pointer">Live channels</span> we think you'll like
                          </h2>
                          <StreamGrid streams={liveStreams.filter(s => s.isLive).slice(0,12)} />
                      </div>
                      ) : (
                      <div className="text-center py-24 bg-zinc-800/50 rounded-lg">
                          <h2 className="text-2xl font-bold">No Channels are Live</h2>
                          <p className="text-muted-foreground mt-2">Check back later to see who is streaming.</p>
                      </div>
                      )}

                      <Separator className="bg-zinc-700" />

                      {categories && categories.length > 0 && (
                      <div>
                          <h2 className="text-xl md:text-2xl font-bold mb-4">
                              <span className="text-primary hover:underline cursor-pointer">Categories</span> we think you'll like
                          </h2>
                          <CategoryGrid categories={categories} />
                      </div>
                      )}

                      {justChattingStreams && justChattingStreams.length > 0 && (
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
  );
}
