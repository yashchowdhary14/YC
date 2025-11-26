
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { dummyStreams, dummyCategories, dummyUsers } from '@/lib/dummy-data';
import type { Stream, Category } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import FeaturedStreamCarousel from '@/components/live/featured-stream-carousel';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

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
      categories: dummyCategories.slice(0,18),
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
      <div className="flex min-h-screen bg-zinc-900 text-white overscroll-contain">
        <LiveSidebar recommendedChannels={liveData.recommendedChannels} recommendedCategories={liveData.categories.slice(0,6)} />
        <SidebarInset className="flex-1 flex flex-col">
          <AppHeader>
             <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </SidebarTrigger>
          </AppHeader>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-contain">
              <div className="space-y-12">
                  <FeaturedStreamCarousel streams={liveData.featuredStreams} />

                  <div>
                      <h2 className="text-2xl font-bold mb-4">
                        <span className="text-primary hover:underline cursor-pointer">Live channels</span> we think you'll like
                      </h2>
                      <StreamGrid streams={liveData.liveStreams.slice(0,12)} />
                  </div>

                  <Separator className="bg-zinc-700" />

                  <div>
                      <h2 className="text-2xl font-bold mb-4">
                          <span className="text-primary hover:underline cursor-pointer">Categories</span> we think you'll like
                      </h2>
                      <CategoryGrid categories={liveData.categories} />
                  </div>

                   <div>
                      <h2 className="text-2xl font-bold mb-4">
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
