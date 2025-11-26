
'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { notFound } from 'next/navigation';
import { dummyVideos, dummyUsers } from '@/lib/dummy-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { formatCompactNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function WatchPage() {
  const { videoId } = useParams();

  const video = useMemo(() => {
    const videoData = dummyVideos.find(v => v.id === videoId);
    if (!videoData) return null;
    return videoData;
  }, [videoId]);

  if (!video) {
    return notFound();
  }

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
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted mb-4">
                  <video
                    src={video.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatCompactNumber(video.views)} views</span>
                    <span>{formatDistanceToNow(video.createdAt, { addSuffix: true })}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={video.user.avatarUrl} />
                        <AvatarFallback>{video.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{video.user.username}</p>
                        <p className="text-sm text-muted-foreground">{formatCompactNumber(video.user.followersCount || 0)} followers</p>
                    </div>
                    <Button variant="secondary" className="ml-4">Subscribe</Button>
                </div>
                 <Separator className="my-4" />
                 <p className="text-sm">
                    This is a placeholder for the video description. In a real application, this would be a detailed summary of the video content.
                 </p>
              </div>
              <div className="lg:col-span-1">
                 <h2 className="text-xl font-bold mb-4">Up next</h2>
                 {/* Placeholder for related videos */}
                 <div className="text-center text-muted-foreground p-8 border rounded-lg">
                    <p>Related videos will appear here.</p>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
