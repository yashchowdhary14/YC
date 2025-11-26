
'use client';

import { useMemo, useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useFirestore, useUser, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import LiveStreamPlayer from '@/components/live/live-stream-player';
import LiveChat from '@/components/live/live-chat';
import StreamInfo from '@/components/live/stream-info';
import { Separator } from '@/components/ui/separator';
import type { LiveBroadcast, User, LiveChatMessage } from '@/lib/types';
import { WithId } from '@/firebase/firestore/use-collection';

export default function LiveWatchPage() {
  const { username } = useParams<{ username: string }>();
  const firestore = useFirestore();
  const { user: currentUser, isUserLoading } = useUser();

  // Find the stream document ID based on the streamer's username.
  // This is not ideal for performance. In a real app, you'd likely have a direct lookup.
  const streamsQuery = useMemoFirebase(() => query(collection(firestore, 'streams')), [firestore]);
  const { data: streams, isLoading: streamsLoading } = useCollection<LiveBroadcast>(streamsQuery);

  const streamId = useMemo(() => {
    return streams?.find(s => s.streamerName === username)?.id;
  }, [streams, username]);

  const streamDocRef = useMemoFirebase(() => {
    if (!streamId) return null;
    return doc(firestore, 'streams', streamId);
  }, [firestore, streamId]);
  
  const { data: stream, isLoading: streamLoading } = useDoc<LiveBroadcast>(streamDocRef);

  const chatMessagesQuery = useMemoFirebase(() => {
    if (!streamId) return null;
    return query(
        collection(firestore, 'streams', streamId, 'live-chat-messages'),
        orderBy('timestamp', 'asc')
    );
  }, [firestore, streamId]);

  const { data: chatMessages, isLoading: chatLoading } = useCollection<LiveChatMessage>(chatMessagesQuery);
  
  const streamer: User | null = useMemo(() => {
    if (!stream) return null;
    return stream.user;
  }, [stream]);

  if (isUserLoading || streamsLoading || streamLoading) {
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
    <div className="h-screen flex flex-col bg-background text-foreground pt-14">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <main className="lg:col-span-9 flex flex-col overflow-y-auto">
          <div className="aspect-video">
             <LiveStreamPlayer src={'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}/>
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
          <LiveChat stream={stream as WithId<LiveBroadcast>} messages={chatMessages || []} />
        </aside>
      </div>
    </div>
  );
}
