
'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, ArrowUp } from 'lucide-react';
import type { Post, User } from '@/lib/types';
import { dummyUsers, dummyPosts, dummyFollows } from '@/lib/dummy-data';
import PostCard from '@/components/app/post-card';
import SidebarNav from '@/components/app/sidebar-nav';
import AppHeader from '@/components/app/header';
import StoriesCarousel from '@/components/app/stories-carousel';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIntersection } from '@/hooks/use-intersection';
import { cn } from '@/lib/utils';

const POSTS_PER_PAGE = 5;

function SuggestionCard({ suggestion }: { suggestion: User }) {
  const { followedUsers, toggleFollow } = useUser();
  const isFollowing = followedUsers.has(suggestion.username);

  const handleFollowToggle = () => {
    toggleFollow(suggestion.username);
  };

  return (
    <div key={suggestion.username} className="flex items-center gap-3">
      <Link href={`/${suggestion.username}`} className="flex items-center gap-3 flex-1">
        <Avatar>
          <AvatarImage src={suggestion.avatarUrl} alt={suggestion.username} />
          <AvatarFallback>{suggestion.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm truncate">{suggestion.username}</p>
          <p className="text-xs text-muted-foreground">Suggested for you</p>
        </div>
      </Link>
      <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs" onClick={handleFollowToggle}>
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  )
}

export default function Home() {
  const { user, isUserLoading, logout, followedUsers } = useUser();
  const router = useRouter();
  
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const { allFeedPosts, suggestions, isLoading } = useMemo(() => {
    if (!user) return { allFeedPosts: [], suggestions: [], isLoading: true };

    const followingIds = dummyFollows[user.uid] || [];
    const allFollowingUsernames = new Set([...Array.from(followedUsers), ...followingIds.map(id => dummyUsers.find(u => u.id === id)?.username).filter(Boolean) as string[]]);
    const allFollowingIds = dummyUsers.filter(u => allFollowingUsernames.has(u.username)).map(u => u.id);
    
    const hydratedPosts: Post[] = dummyPosts
      .filter(post => post.type === 'photo' && (allFollowingIds.includes(post.uploaderId) || post.uploaderId === user.uid))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const suggestedUsers = dummyUsers
      .filter(u => u.id !== user.uid && !allFollowingUsernames.has(u.username))
      .slice(0, 5)
      .map(u => ({
        ...u,
        avatarUrl: `https://picsum.photos/seed/${u.id}/100/100`,
      }));

    return { allFeedPosts: hydratedPosts, suggestions: suggestedUsers as User[], isLoading: false };
  }, [user, followedUsers]);

  // Initial posts load
  useEffect(() => {
    if (allFeedPosts.length > 0) {
      setDisplayedPosts(allFeedPosts.slice(0, POSTS_PER_PAGE));
      setPage(1);
      setHasMore(allFeedPosts.length > POSTS_PER_PAGE);
    }
  }, [allFeedPosts]);

  const loadMorePosts = useCallback(() => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const newPosts = allFeedPosts.slice(0, nextPage * POSTS_PER_PAGE);
    setDisplayedPosts(newPosts);
    setPage(nextPage);
    setHasMore(newPosts.length < allFeedPosts.length);
  }, [page, hasMore, allFeedPosts]);

  const loaderRef = useRef<HTMLDivElement>(null);
  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });

  useEffect(() => {
    if (isLoaderVisible && hasMore) {
      // Add a small delay to simulate network latency
      const timer = setTimeout(() => {
        loadMorePosts();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaderVisible, hasMore, loadMorePosts]);

  const handleSignOut = () => {
    if (logout) {
      logout();
      router.push('/login');
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 400) {
            setShowBackToTop(true);
        } else {
            setShowBackToTop(false);
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (isUserLoading || isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
        <SidebarFooter>
          <Separator className="my-2" />
          <div className="p-2">
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto max-w-screen-lg p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2" ref={feedContainerRef}>
                <div className="flex flex-col gap-8">
                  <StoriesCarousel />
                  {displayedPosts.length > 0 ? (
                     displayedPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
                      <h3 className="text-xl font-semibold text-foreground">Welcome to Instagram</h3>
                      <p className="mt-2">Your feed is empty.</p>
                      <p>Start following people to see their posts here.</p>
                       <Button asChild className="mt-4">
                         <Link href="/search">Find People to Follow</Link>
                       </Button>
                    </div>
                  )}

                  {hasMore && (
                    <div ref={loaderRef} className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}

                </div>
              </div>

              <div className="hidden lg:block lg:col-span-1">
                 <div className="sticky top-24">
                   <div className="flex items-center justify-between mb-4">
                     <p className="font-semibold text-muted-foreground">Suggestions for you</p>
                     <Button variant="link" size="sm" className="p-0 h-auto text-xs">See All</Button>
                   </div>
                   <div className="flex flex-col gap-4">
                    {suggestions.map((s) => (
                        <SuggestionCard key={s.id} suggestion={s} />
                    ))}
                  </div>
                 </div>
              </div>
            </div>
          </div>
        </main>
         {showBackToTop && (
            <Button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
                size="icon"
            >
                <ArrowUp className="h-6 w-6" />
                <span className="sr-only">Back to top</span>
            </Button>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
