
'use client';

import { useMemo, useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import LiveStreamPlayer from '@/components/live/live-stream-player';
import LiveChat from '@/components/live/live-chat';
import StreamInfo from '@/components/live/stream-info';
import { Separator } from '@/components/ui/separator';
import type { LiveBroadcast, User, LiveChatMessage } from '@/lib/types';
import { dummyLiveBroadcasts, getInitialChatMessages } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';

export default function LiveWatchPage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isUserLoading } = useUser();
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);

  // --- Start of Local Data Usage ---
  // Find the stream document based on the streamer's username from local dummy data
  const stream: LiveBroadcast | undefined = useMemo(() => {
    return dummyLiveBroadcasts.find(s => s.streamerName === username);
  }, [username]);

  useEffect(() => {
    if (stream) {
      setChatMessages(getInitialChatMessages(stream.streamerName));
    }
  }, [stream]);
  // --- End of Local Data Usage ---

  const streamer: User | null = useMemo(() => {
    if (!stream) return null;
    return stream.user;
  }, [stream]);

  const [isTheaterMode, setIsTheaterMode] = useState(false);

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
    <div className="h-screen flex flex-col bg-background text-foreground pt-14">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        <main className={cn(
          "flex flex-col overflow-y-auto transition-all duration-300",
          isTheaterMode ? "lg:col-span-12" : "lg:col-span-9"
        )}>
          <div className="relative group">
            <div className={cn("w-full", isTheaterMode ? "h-[calc(100vh-3.5rem)]" : "aspect-video")}>
              <LiveStreamPlayer src={stream.streamUrl} />
            </div>

            {/* Theater Mode Toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title={isTheaterMode ? "Exit Theater Mode" : "Enter Theater Mode"}
            >
              {isTheaterMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              )}
            </button>

            {/* Chat Overlay (Theater Mode) */}
            {isTheaterMode && (
              <div className="absolute top-0 right-0 bottom-0 w-80 p-4 z-20 pointer-events-none">
                <div className="h-full pointer-events-auto">
                  <LiveChat stream={stream} messages={chatMessages} setMessages={setChatMessages} variant="overlay" />
                </div>
              </div>
            )}
          </div>

          {!isTheaterMode && (
            <div className="p-4 flex-1">
              <StreamInfo streamer={streamer} stream={{ ...stream, viewers: stream.viewerCount }} />
              <Separator className="my-4" />
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2">About {streamer.username}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{streamer.bio}</p>
              </div>
            </div>
          )}
        </main>

        {/* Sidebar Chat (Default Mode) */}
        {!isTheaterMode && (
          <aside className="lg:col-span-3 lg:border-l lg:flex flex-col hidden h-full">
            <LiveChat stream={stream} messages={chatMessages} setMessages={setChatMessages} />
          </aside>
        )}
      </div>
    </div>
  );
}
