
'use client';

import { useMemo, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
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

  const streamQuery = useMemoFirebase(() => {
    if (!firestore || !username) return null;
    return query(
      collection(firestore, 'streams'),
      where('user.username', '==', username),
      limit(1)
    );
  }, [firestore, username]);

  const { data: streams, isLoading: isStreamLoading } = useCollection<Stream>(streamQuery);

  const stream = useMemo(() => (streams && streams.length > 0 ? streams[0] : null), [streams]);

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
    // Wait until loading is false to show notFound
    if (!isStreamLoading) {
      return notFound();
    }
    // Return loader while stream is loading and not yet found.
    return (
       <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
          <LiveChat stream={stream} />
        </aside>
      </div>
    </div>
  );
}
