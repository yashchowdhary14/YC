
'use client';

import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useUser } from '@/firebase';
import { dummyStreams, dummyUsers } from '@/lib/dummy-data';
import AppHeader from '@/components/app/header';
import { Loader2 } from 'lucide-react';
import LiveStreamPlayer from '@/components/live/live-stream-player';
import LiveChat from '@/components/live/live-chat';
import StreamInfo from '@/components/live/stream-info';
import { Separator } from '@/components/ui/separator';

export default function LiveWatchPage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isUserLoading } = useUser();

  const { streamer, stream } = useMemo(() => {
    const streamerData = dummyUsers.find(u => u.username === username);
    if (!streamerData) return { streamer: null, stream: null };

    const streamData = dummyStreams.find(s => s.streamerId === streamerData.id && s.isLive);
    if (!streamData) return { streamer: { ...streamerData, avatarUrl: `https://picsum.photos/seed/${streamerData.id}/100` }, stream: null };
    
    return {
      streamer: {
        ...streamerData,
        avatarUrl: `https://picsum.photos/seed/${streamerData.id}/100`,
      },
      stream: {
        title: streamData.title,
        category: streamData.category,
        viewers: streamData.viewerCount,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Placeholder video
      }
    };
  }, [username]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!streamer) {
    return notFound();
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <main className="lg:col-span-9 flex flex-col overflow-y-auto">
          <div className="aspect-video">
             <LiveStreamPlayer src={stream?.videoUrl}/>
          </div>
          <div className="p-4 flex-1">
             <StreamInfo streamer={streamer} stream={stream || { title: 'Offline', category: 'N/A', viewers: 0 }} />
             <Separator className="my-4" />
             <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2">About {streamer.username}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{streamer.bio}</p>
             </div>
          </div>
        </main>
        <aside className="lg:col-span-3 lg:border-l lg:flex flex-col hidden">
          <LiveChat streamer={streamer} />
        </aside>
      </div>
    </div>
  );
}
