
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import {
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { dummyStreams, dummyCategories, dummyUsers } from '@/lib/dummy-data';
import type { Stream, Category, User } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import SuggestedStreamCarousel from '@/components/live/suggested-stream-carousel';

export default function LivePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const liveData = useMemo(() => {
    // For now, all data is from dummy data. In a real app, this would be from Firestore.
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

    const recommendedChannels = liveStreams.slice(0, 5);
    const featuredStream = liveStreams[0];
    const suggestedStreams = liveStreams.slice(1, 6);


    return {
      liveStreams,
      recommendedChannels,
      featuredStream,
      suggestedStreams,
      categories: dummyCategories,
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
    <div className="flex h-screen bg-zinc-900 text-white">
      <LiveSidebar recommendedChannels={liveData.recommendedChannels} />
      <div className="flex-1 flex flex-col md:ml-60">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="space-y-12">
                {liveData.featuredStream && (
                  <div>
                      <h2 className="text-xl font-bold mb-4">Featured Stream</h2>
                       <AspectRatio ratio={16/9} className="mb-4 rounded-xl overflow-hidden shadow-2xl group">
                          <Image 
                            src={liveData.featuredStream.thumbnailUrl!} 
                            alt={liveData.featuredStream.title} 
                            fill 
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-0.5 rounded-md text-sm font-bold">LIVE</div>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                           <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold text-lg">{liveData.featuredStream.title}</h3>
                                <p className="text-sm">{liveData.featuredStream.user.username}</p>
                           </div>
                      </AspectRatio>
                  </div>
                )}

                <Separator className="bg-zinc-700" />
                
                <div>
                    <h2 className="text-xl font-bold mb-4"><span className="text-primary">Live streams</span> we think you'll like</h2>
                    <SuggestedStreamCarousel streams={liveData.suggestedStreams} />
                </div>
                
                 <div>
                    <h2 className="text-xl font-bold mb-4">All Live Streams</h2>
                    <StreamGrid streams={liveData.liveStreams} />
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                    <h2 className="text-xl font-bold mb-4"><span className="text-primary">Categories</span> we think you'll like</h2>
                    <CategoryGrid categories={liveData.categories} />
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
