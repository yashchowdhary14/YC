
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { dummyStreams, dummyCategories, dummyUsers } from '@/lib/dummy-data';
import type { Stream, Category, User } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import FeaturedStreamCarousel from '@/components/live/featured-stream-carousel';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function LivePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const liveData = useMemo(() => {
    const liveStreams: Stream[] = dummyStreams.map(s => {
      const streamer = dummyUsers.find(u => u.id === s.streamerId);
      return {
        ...s,
        user: {
            ...streamer!,
            avatarUrl: `https://picsum.photos/seed/${streamer!.id}/100/100`,
        },
        thumbnailUrl: `https://picsum.photos/seed/${s.id}/640/360`,
      };
    });

    const recommendedChannels = liveStreams.slice(0, 7);
    const featuredStreams = liveStreams.slice(0, 5);

    return {
      liveStreams,
      recommendedChannels,
      featuredStreams,
      categories: dummyCategories.slice(0,6),
    };
  }, []);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-zinc-900 text-white">
        <LiveSidebar recommendedChannels={liveData.recommendedChannels} recommendedCategories={liveData.categories} />
        <SidebarInset className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="space-y-12">
                  <FeaturedStreamCarousel streams={liveData.featuredStreams} />

                  <div>
                      <h2 className="text-xl font-bold mb-4">
                        <span className="text-primary hover:underline cursor-pointer">Live channels</span> we think you'll like
                      </h2>
                      <StreamGrid streams={liveData.liveStreams.slice(0,4)} />
                  </div>

                  <Separator className="bg-zinc-700" />

                  <div>
                      <h2 className="text-xl font-bold mb-4">
                          <span className="text-primary hover:underline cursor-pointer">Categories</span> we think you'll like
                      </h2>
                      <CategoryGrid categories={liveData.categories} />
                  </div>

                   <div>
                      <h2 className="text-xl font-bold mb-4">
                        <span className="text-primary hover:underline cursor-pointer">Just Chatting</span> channels
                      </h2>
                      <StreamGrid streams={liveData.liveStreams.filter(s => s.category === 'Just Chatting')} />
                  </div>
              </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
