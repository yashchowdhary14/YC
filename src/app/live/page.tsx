'use client';

import { useEffect, useMemo } from 'react';
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
import LiveStreamPlayer from '@/components/live/live-stream-player';
import LiveChat from '@/components/live/live-chat';
import StreamInfo from '@/components/live/stream-info';
import type { User, Video } from '@/lib/types';
import { dummyUsers, dummyVideos } from '@/lib/dummy-data';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Let's pick a user and a video to be our "featured streamer"
const FEATURED_STREAMER_USERNAME = 'ethan_bytes';
const FEATURED_VIDEO_ID = 'vid_1';

export default function LiveStreamPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const streamData = useMemo(() => {
    const streamer = dummyUsers.find(u => u.username === FEATURED_STREAMER_USERNAME) as User;
    const video = dummyVideos.find(v => v.id === FEATURED_VIDEO_ID);
    if (!streamer || !video) return null;
    
    return {
      streamer: {
        ...streamer,
        avatarUrl: `https://picsum.photos/seed/${streamer.id}/150/150`,
      },
      stream: {
        title: video.title,
        videoUrl: video.videoUrl,
        category: video.category,
        viewers: Math.floor(video.views / 100) + 500, // Make up a viewer count
      },
    };
  }, []);

  if (isUserLoading || !user || !streamData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { streamer, stream } = streamData;

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
        <main className="h-[calc(100vh-3.5rem)]">
           <div className="grid grid-cols-12 h-full">
              <div className="col-span-12 xl:col-span-9 flex flex-col">
                <div className="flex-grow p-4">
                  <AspectRatio ratio={16 / 9}>
                    <LiveStreamPlayer src={stream.videoUrl} />
                  </AspectRatio>
                  <StreamInfo streamer={streamer} stream={stream} />
                </div>
              </div>
              <div className="hidden xl:block xl:col-span-3 border-l h-full">
                 <LiveChat streamer={streamer} />
              </div>
           </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
