
'use client';

import { useMemo, useState } from 'react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import VideoCard from '@/components/app/video-card';
import { dummyVideos } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const allCategories = dummyVideos.map(video => video.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, []);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'All') {
      return dummyVideos;
    }
    return dummyVideos.filter(video => video.category === selectedCategory);
  }, [selectedCategory]);

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
          <div className="sticky top-[56px] z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
               <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    size="sm"
                    className={cn(
                      "rounded-lg shrink-0",
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
             {filteredVideos.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                    <h3 className="text-xl font-semibold">No videos found</h3>
                    <p>There are no videos in the &quot;{selectedCategory}&quot; category.</p>
                </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
