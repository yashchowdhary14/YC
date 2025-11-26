
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      <LiveSidebar recommendedChannels={liveData.recommendedChannels} />
      <div className="flex-1 flex flex-col ml-0 md:ml-60">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-8">
            <div className="space-y-12">
                <div>
                    <h2 className="text-xl font-bold mb-4">Featured Stream</h2>
                    <AspectRatio ratio={16/9} className="mb-4 rounded-xl overflow-hidden shadow-2xl">
                        <Image src={liveData.featuredStream.thumbnailUrl!} alt={liveData.featuredStream.title} fill className="object-cover" />
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-0.5 rounded-md text-sm font-bold">LIVE</div>
                    </AspectRatio>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                    <h2 className="text-xl font-bold mb-4"><span className="text-primary">Live streams</span> we think you'll like</h2>
                    <StreamGrid streams={liveData.suggestedStreams} />
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
