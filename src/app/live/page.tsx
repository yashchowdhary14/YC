
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import type { LiveBroadcast, Category } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import FeaturedStreamCarousel from '@/components/live/featured-stream-carousel';
import { cn } from '@/lib/utils';
import { WithId } from '@/firebase/firestore/use-collection';

export default function LivePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
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

  const liveStreamsQuery = useMemoFirebase(() => query(
    collection(firestore, 'streams'),
    where('isLive', '==', true),
    orderBy('viewerCount', 'desc')
  ), [firestore]);

  const categoriesQuery = useMemoFirebase(() => query(
    collection(firestore, 'categories'),
    orderBy('name')
  ), [firestore]);
  
  const justChattingQuery = useMemoFirebase(() => query(
    collection(firestore, 'streams'),
    where('isLive', '==', true),
    where('category', '==', 'Just Chatting'),
    orderBy('viewerCount', 'desc'),
    limit(10)
  ), [firestore]);


  const { data: liveStreams, isLoading: streamsLoading } = useCollection<LiveBroadcast>(liveStreamsQuery);
  const { data: categories, isLoading: categoriesLoading } = useCollection<Category>(categoriesQuery);
  const { data: justChattingStreams, isLoading: justChattingLoading } = useCollection<LiveBroadcast>(justChattingQuery);

  const { recommendedChannels, featuredStreams } = useMemo(() => {
    if (!liveStreams) return { recommendedChannels: [], featuredStreams: [] };
    const sorted = [...liveStreams].sort((a, b) => b.viewerCount - a.viewerCount);
    return {
      recommendedChannels: sorted.slice(0, 7),
      featuredStreams: sorted.slice(0, 5),
    };
  }, [liveStreams]);

  const isLoading = isUserLoading || streamsLoading || categoriesLoading || justChattingLoading;

  if (isLoading && !isPageLoaded) {
     return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white overscroll-contain">
        <LiveSidebar 
          recommendedChannels={recommendedChannels as WithId<LiveBroadcast>[]} 
          recommendedCategories={(categories?.slice(0,6) || []) as WithId<Category>[]} 
        />
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
                      {featuredStreams.length > 0 && <FeaturedStreamCarousel streams={featuredStreams as WithId<LiveBroadcast>[]} />}

                      {liveStreams && liveStreams.length > 0 ? (
                      <div>
                          <h2 className="text-xl md:text-2xl font-bold mb-4">
                              <span className="text-primary hover:underline cursor-pointer">Live channels</span> we think you'll like
                          </h2>
                          <StreamGrid streams={liveStreams.slice(0,12) as WithId<LiveBroadcast>[]} />
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
                          <CategoryGrid categories={categories as WithId<Category>[]} />
                      </div>
                      )}

                      {justChattingStreams && justChattingStreams.length > 0 && (
                      <div>
                          <h2 className="text-xl md:text-2xl font-bold mb-4">
                          <span className="text-primary hover:underline cursor-pointer">Just Chatting</span> channels
                          </h2>
                          <StreamGrid streams={justChattingStreams as WithId<LiveBroadcast>[]} />
                      </div>
                      )}
                  </div>
              )}
          </main>
        </div>
    </div>
  );
}
