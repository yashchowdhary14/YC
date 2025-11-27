'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import PostCard from '@/components/app/post-card';
import StoriesCarousel from '@/components/app/stories-carousel';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalFeedStore } from '@/store/localFeedStore';
import { useUser } from '@/firebase';
import { usePosts } from '@/hooks/use-posts';
import type { Post } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useIntersection } from '@/hooks/use-intersection';
<<<<<<< HEAD
import { HomeRightSidebar } from '@/components/home/home-right-sidebar';

function PostCardSkeleton() {
  return (
    <div className="mb-4">
      <div className="flex items-center p-2 px-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="ml-3 space-y-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
=======

function PostCardSkeleton() {
    return (
        <div className="mb-4">
            <div className="flex items-center p-2 px-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <Skeleton className="w-full aspect-square" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
}


export default function Home() {
  const { user } = useUser();
  const loaderRef = useRef<HTMLDivElement>(null);
<<<<<<< HEAD

=======
  
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
  // The usePosts hook now fetches real data. We assume for now it fetches for 'all' users.
  // In a real feed, this would be more complex (e.g., fetching from followed users).
  // For this step, we'll fetch all posts to demonstrate the feed mechanism.
  // We'll pass a placeholder or empty string for userId to signify "all posts".
  const { posts, isLoading, isLoadingMore, hasMore, loadMore } = usePosts('');
  const localItems = useLocalFeedStore(s => s.items);

<<<<<<< HEAD
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });
  useEffect(() => {
    if (isLoaderVisible && hasMore && !isLoadingMore) {
      loadMore();
=======
  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });
  useEffect(() => {
    if (isLoaderVisible && hasMore && !isLoadingMore) {
        loadMore();
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    }
  }, [isLoaderVisible, hasMore, isLoadingMore, loadMore]);

  const newPosts = useMemo(() => {
    if (!user) return [];
    return localItems.filter(item => item.mode === 'post').map(item => ({
<<<<<<< HEAD
      id: item.id,
      type: 'post',
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
      location: item.metadata.location,
      category: item.metadata.settings?.category,
      tags: item.metadata.tags,
      taggedUsers: item.metadata.taggedUsers,
      accessibility: item.metadata.accessibility,
      views: 0,
      likes: 0,
      hideLikes: item.metadata.settings?.hideLikes,
      disableComments: item.metadata.settings?.disableComments,
      disableRemix: item.metadata.settings?.disableRemix,
      visibility: item.metadata.settings?.visibility,
      commentsCount: 0,
      createdAt: new Date(item.createdAt),
=======
        id: item.id,
        type: 'post',
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
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    } as Post));
  }, [localItems, user]);

  const suggestedPosts = useMemo(() => {
    // Combine locally created posts with fetched posts, ensuring no duplicates
    const postMap = new Map<string, Post>();
    newPosts.forEach(post => postMap.set(post.id, post));
    posts.forEach(post => {
<<<<<<< HEAD
      if (!postMap.has(post.id)) {
        postMap.set(post.id, post);
      }
=======
        if (!postMap.has(post.id)) {
            postMap.set(post.id, post);
        }
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    });
    return Array.from(postMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, newPosts]);

  return (
    <div className="flex flex-col h-screen bg-background">
<<<<<<< HEAD
      <main className="flex-1 overflow-y-auto pt-14 md:ml-20 lg:ml-72 md:pb-0 pb-14 scrollbar-hide">
        <div className="container mx-auto flex justify-center gap-10 px-0 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Feed Column */}
          <div className="w-full max-w-[470px] flex-shrink-0">
            <StoriesCarousel />
            <div className="mt-6 space-y-4">
              {isLoading && suggestedPosts.length === 0 && Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

=======
      <main className="flex-1 overflow-y-auto pt-14 md:ml-20 lg:ml-72 md:pb-0 pb-14">
        <div className="w-full max-w-lg mx-auto">
            <StoriesCarousel />
            <Separator />
            <div className="py-2">
              {isLoading && suggestedPosts.length === 0 && Array.from({length: 3}).map((_, i) => <PostCardSkeleton key={i}/>) }
              
              {suggestedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
              ))}
              
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
              <div ref={loaderRef} className="flex justify-center items-center py-10">
                {isLoadingMore && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
              </div>

<<<<<<< HEAD
              {!isLoading && !hasMore && suggestedPosts.length > 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>You've reached the end of the feed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (Desktop) */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <HomeRightSidebar />
            </div>
          </div>
=======
               {!isLoading && !hasMore && suggestedPosts.length > 0 && (
                 <div className="text-center py-10 text-muted-foreground">
                    <p>You've reached the end of the feed.</p>
                 </div>
               )}
            </div>
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
        </div>
      </main>
    </div>
  );
}
