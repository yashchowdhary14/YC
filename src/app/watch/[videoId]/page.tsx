
'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
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
import RelatedVideoCard from '@/components/app/related-video-card';
import { Skeleton } from '@/components/ui/skeleton';

function WatchPageSkeleton() {
  return (
    <div className="container mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-xl mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/4 mb-4" />
          <Separator className="my-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3 mb-1" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <Separator className="my-4" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="aspect-video w-40 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function WatchPage() {
  const { videoId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const { video, relatedVideos } = useMemo(() => {
    const videoData = dummyVideos.find(v => v.id === videoId);
    if (!videoData) return { video: null, relatedVideos: [] };

    const related = dummyVideos.filter(v => v.id !== videoId && v.category === videoData.category).slice(0, 5);
    if (related.length < 5) {
      related.push(...dummyVideos.filter(v => v.id !== videoId && v.category !== videoData.category).slice(0, 5 - related.length));
    }

    return { video: videoData, relatedVideos: related };
  }, [videoId]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (video) {
        setIsLoading(false);
      }
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [video]);

  if (!video && !isLoading) {
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
          {isLoading ? <WatchPageSkeleton /> : (
            <div className="container mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted mb-4">
                    <video
                      src={video!.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{video!.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatCompactNumber(video!.views)} views</span>
                      <span>{formatDistanceToNow(video!.createdAt, { addSuffix: true })}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                          <Avatar>
                              <AvatarImage src={video!.user.avatarUrl} />
                              <AvatarFallback>{video!.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="font-semibold">{video!.user.username}</p>
                              <p className="text-sm text-muted-foreground">{formatCompactNumber(video!.user.followersCount || 0)} followers</p>
                          </div>
                          <Button variant="secondary" className="ml-4 rounded-full font-bold">Subscribe</Button>
                      </div>
                       <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-full bg-secondary">
                             <Button variant="secondary" className="rounded-r-none rounded-l-full">
                                 <ThumbsUp className="mr-2 h-4 w-4"/>
                                 {formatCompactNumber(video!.views / 50)}
                             </Button>
                             <Separator orientation="vertical" className="h-6"/>
                             <Button variant="secondary" className="rounded-l-none rounded-r-full">
                                 <ThumbsDown />
                             </Button>
                          </div>
                          <Button variant="secondary" className="rounded-full">
                              <Share className="mr-2 h-4 w-4"/>
                              Share
                          </Button>
                           <Button variant="secondary" className="rounded-full">
                              <Download className="mr-2 h-4 w-4"/>
                              Download
                          </Button>
                      </div>
                  </div>
                   <Separator className="my-4" />
                   <div className="p-4 rounded-lg bg-secondary text-sm">
                      <p className="font-bold">About this video:</p>
                      <p className="whitespace-pre-wrap mt-2">
                        This is a placeholder for the video description. In a real application, this would be a detailed summary of the video content, including links, chapters, and other relevant information to give viewers context.
                      </p>
                   </div>
                </div>
                <div className="lg:col-span-1">
                   <h2 className="text-xl font-bold mb-4">Up next</h2>
                   <div className="space-y-4">
                      {relatedVideos.map(relatedVideo => (
                          <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
