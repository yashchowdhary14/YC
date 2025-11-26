
'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, ArrowUp } from 'lucide-react';
import type { Post, User } from '@/lib/types';
import { dummyUsers, dummyPosts, dummyFollows } from '@/lib/dummy-data';
import PostCard from '@/components/app/post-card';
import SidebarNav from '@/components/app/sidebar-nav';
import StoriesCarousel from '@/components/app/stories-carousel';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
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
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
      <div className="flex min-h-svh bg-background">
        <div className="fixed left-0 top-0 h-full z-10 hidden lg:flex flex-col border-r bg-background w-72">
           <div className="h-14 flex items-center border-b p-4">
             <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
           </div>
           <SidebarNav />
        </div>
        <div className="fixed left-0 top-0 h-full z-10 hidden md:flex lg:hidden flex-col border-r bg-background p-3 gap-4 w-20">
            <div className="p-2">
                 <svg aria-label="Instagram" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M32.8,0.6c-4.3,0-4.8,0-13.6,0C4.9,0.6,0.6,4.9,0.6,19.2c0,8.7,0,9.3,0,13.6c0,14.3,4.3,18.6,18.6,18.6c8.7,0,9.3,0,13.6,0c14.3,0,18.6-4.3,18.6-18.6c0-4.3,0-4.8,0-13.6C51.4,4.9,47.1,0.6,32.8,0.6z M47.4,32.8c0,12.1-3.4,15.4-15.4,15.4c-8.7,0-9.2,0-13.6,0c-12.1,0-15.4-3.4-15.4-15.4c0-8.7,0-9.2,0-13.6c0-12.1,3.4-15.4,15.4-15.4c4.5,0,4.9,0,13.6,0c12.1,0,15.4,3.4,15.4,15.4C47.4,23.6,47.4,24.2,47.4,32.8z"></path><path d="M25.9,12.5c-7.4,0-13.4,6-13.4,13.4s6,13.4,13.4,13.4s13.4-6,13.4-13.4S33.3,12.5,25.9,12.5z M25.9,35.3c-5.2,0-9.4-4.2-9.4-9.4s4.2-9.4,9.4-9.4s9.4,4.2,9.4,9.4S31.1,35.3,25.9,35.3z"></path><circle cx="38.3" cy="11.1" r="3.2"></circle></svg>
            </div>
            <SidebarNav isCollapsed />
        </div>
        <main className="flex-1 md:ml-20 lg:ml-72 bg-background min-h-svh pt-14">
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
                            <Link href="/explore">Find People to Follow</Link>
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
            {showBackToTop && (
                <Button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
                    size="icon"
                >
                    <ArrowUp className="h-6 w-6" />
                    <span className="sr-only">Back to top</span>
                </Button>
            )}
        </main>
      </div>
  );
}
