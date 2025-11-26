
'use client';

import { useMemo, useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useUser } from '@/firebase';
import AppHeader from '@/components/app/header';
import { Loader2 } from 'lucide-react';
import LiveStreamPlayer from '@/components/live/live-stream-player';
import LiveChat from '@/components/live/live-chat';
import StreamInfo from '@/components/live/stream-info';
import { Separator } from '@/components/ui/separator';
import type { Stream, User, LiveChatMessage } from '@/lib/types';
import { dummyStreams } from '@/lib/dummy-data';

export default function LiveWatchPage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isUserLoading } = useUser();
  const [streams, setStreams] = useState(dummyStreams);
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);

  useEffect(() => {
    // Effect to listen for storage changes to update live status
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dummyStreams' && event.newValue) {
        setStreams(JSON.parse(event.newValue));
      }
    };
    
    const storedStreams = localStorage.getItem('dummyStreams');
    if (storedStreams) {
        setStreams(JSON.parse(storedStreams));
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const stream = useMemo(() => {
    const s = streams.find(s => s.user.username === username);
    if (!s) return null;
    return s;
  }, [streams, username]);


  const streamer: User | null = useMemo(() => {
    if (!stream) return null;
    return stream.user;
  }, [stream]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!stream || !streamer || !stream.isLive) {
     return notFound();
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <main className="lg:col-span-9 flex flex-col overflow-y-auto">
          <div className="aspect-video">
             <LiveStreamPlayer src={(stream as any)?.videoUrl}/>
          </div>
          <div className="p-4 flex-1">
             <StreamInfo streamer={streamer} stream={{...stream, viewers: stream.viewerCount}} />
             <Separator className="my-4" />
             <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2">About {streamer.username}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{streamer.bio}</p>
             </div>
          </div>
        </main>
        <aside className="lg:col-span-3 lg:border-l lg:flex flex-col hidden">
          <LiveChat stream={stream} messages={chatMessages} setMessages={setChatMessages} />
        </aside>
      </div>
    </div>
  );
}
