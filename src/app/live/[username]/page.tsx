
'use client';

import { useMemo, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import AppHeader from '@/components/app/header';
import { Loader2 } from 'lucide-react';
import LiveStreamPlayer from '@/components/live/live-stream-player';
import LiveChat from '@/components/live/live-chat';
import StreamInfo from '@/components/live/stream-info';
import { Separator } from '@/components/ui/separator';
import type { Stream, User } from '@/lib/types';

export default function LiveWatchPage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Find the streamer's ID from the username (this is a simulation, in a real app you'd query this)
  // For this to work with Firestore, we'd need a users collection to look up the username.
  // We'll assume for now that the stream document contains enough info.
  // This part is tricky without a `users` collection query by username.
  // A better real-world structure might be to stream by `streamId` not username,
  // or have a `users` collection to query first. Let's assume we can find the stream.
  
  // This is a placeholder for finding the right stream document.
  // In a real app, you would query the `streams` collection `where("streamerName", "==", username)`.
  // Since we don't have that query hook set up, we'll have to improvise or assume an ID.
  // Let's find the stream from the dummy data to get its ID, then fetch that doc.
  const { dummyStreams } = require('@/lib/dummy-data');
  const streamData = dummyStreams.find((s: any) => s.user?.username === username || s.streamerName === username);

  const streamRef = useMemoFirebase(() => {
      if (!firestore || !streamData) return null;
      return doc(firestore, 'streams', streamData.id);
  }, [firestore, streamData]);

  const { data: stream, isLoading: isStreamLoading } = useDoc<Stream>(streamRef);

  const streamer: User | null = useMemo(() => {
    if (!stream) return null;
    return {
      id: stream.streamerId,
      username: stream.user.username,
      avatarUrl: stream.user.avatarUrl,
      fullName: stream.user.fullName,
      bio: stream.user.bio,
      followersCount: stream.user.followersCount,
      followingCount: stream.user.followingCount,
      verified: stream.user.verified,
    };
  }, [stream]);

  if (isUserLoading || isStreamLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stream || !streamer) {
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
             <StreamInfo streamer={streamer} stream={{...stream, viewers: stream.viewerCount}} />
             <Separator className="my-4" />
             <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2">About {streamer.username}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{streamer.bio}</p>
             </div>
          </div>
        </main>
        <aside className="lg:col-span-3 lg:border-l lg:flex flex-col hidden">
          <LiveChat stream={stream} />
        </aside>
      </div>
    </div>
  );
}
