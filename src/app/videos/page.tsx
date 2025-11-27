'use client';

import { useMemo, useState, useEffect } from 'react';
import VideoCard from '@/components/app/video-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { Post } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { dummyPosts } from '@/lib/dummy-data';
import { useLocalFeedStore } from '@/store/localFeedStore';
import { useUser } from '@/firebase';

type SortOption = 'Trending' | 'Latest';

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<SortOption>('Trending');
  const [videos, setVideos] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const localItems = useLocalFeedStore(s => s.items);

  const newVideos = useMemo(() => {
    if (!user) return [];
    return localItems.filter(item => item.mode === 'video').map(item => ({
        id: item.id,
        type: 'video',
        mediaUrl: item.mediaUrls[0],
        thumbnailUrl: item.thumbnailUrl,
        uploaderId: user.uid,
        user: { 
            id: user.uid, 
            username: user.displayName?.split(' ')[0].toLowerCase() || 'user', 
            avatarUrl: user.photoURL || '',
            fullName: user.displayName || 'User',
            bio: '',
            followersCount: 0,
            followingCount: 0,
            verified: false,
        },
        caption: item.metadata.caption,
        tags: item.metadata.tags,
        views: 0,
        likes: 0,
        commentsCount: 0,
        createdAt: new Date(item.createdAt),
    } as Post));
  }, [localItems, user]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setVideos(dummyPosts.filter(p => p.type === 'video'));
      setIsLoading(false);
    }, 500);
  }, []);

  const allVideos = useMemo(() => {
    if (!videos) return newVideos;
    return [...newVideos, ...videos];
  }, [videos, newVideos]);

  const categories = useMemo(() => {
    if (!allVideos) return ['All'];
    const allCategories = allVideos.flatMap(video => video.tags.filter(t => t !== 'longform'));
    return ['All', ...Array.from(new Set(allCategories))];
  }, [allVideos]);

  const filteredAndSortedVideos = useMemo(() => {
    if (!allVideos) return [];
    
    let processedVideos = allVideos.map(v => ({
      ...v,
      createdAt: v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt)
    }));

    if (selectedCategory !== 'All') {
      processedVideos = processedVideos.filter(video => video.tags.includes(selectedCategory));
    }

    if (sortOption === 'Trending') {
      processedVideos.sort((a, b) => b.views - a.views);
    } else if (sortOption === 'Latest') {
      processedVideos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return processedVideos;
  }, [allVideos, selectedCategory, sortOption]);

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-[56px] z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <Button
              variant={sortOption === 'Trending' ? 'default' : 'secondary'}
              size="sm"
              className="rounded-lg shrink-0"
              onClick={() => setSortOption('Trending')}
            >
              Trending
            </Button>
            <Button
              variant={sortOption === 'Latest' ? 'default' : 'secondary'}
              size="sm"
              className="rounded-lg shrink-0"
              onClick={() => setSortOption('Latest')}
            >
              Latest
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                size="sm"
                className={cn(
                  "rounded-lg shrink-0 capitalize",
                  selectedCategory === category
                    ? "bg-primary/10 text-primary border border-primary/50"
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
        {isLoading ? (
            <div className="col-span-full text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
          { !isLoading && filteredAndSortedVideos.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
                <h3 className="text-xl font-semibold">No videos found</h3>
                <p>There are no videos in the &quot;{selectedCategory}&quot; category.</p>
            </div>
        )}
      </div>
    </main>
  );
}
