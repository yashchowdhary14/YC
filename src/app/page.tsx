
'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { Loader2, ArrowUp } from 'lucide-react';
import type { Post, User } from '@/lib/types';
import PostCard from '@/components/app/post-card';
import StoriesCarousel from '@/components/app/stories-carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIntersection } from '@/hooks/use-intersection';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

const POSTS_PER_PAGE = 5;

function SuggestionCard({ suggestion, onFollowToggle }: { suggestion: User, onFollowToggle: (id: string) => void }) {
  const handleFollowToggle = () => {
    onFollowToggle(suggestion.id);
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
        Follow
      </Button>
    </div>
  )
}

export default function Home() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Fetch posts from users you follow
  const followingQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/following`));
  }, [user, firestore]);
  const { data: followingList } = useCollection<{id: string}>(followingQuery as any);

  const postsQuery = useMemo(() => {
    if (!followingList || followingList.length === 0) return null;
    const followingIds = followingList.map(f => f.id);
    return query(collection(firestore, 'posts'), where('uploaderId', 'in', followingIds));
  }, [followingList, firestore]);
  const { data: posts, isLoading: postsLoading } = useCollection<Post>(postsQuery as any);
  
  // Fetch suggestions
  useEffect(() => {
    if (user && firestore) {
      const fetchSuggestions = async () => {
        const followingIds = followingList?.map(f => f.id) || [];
        const excludedIds = [user.uid, ...followingIds];

        const q = query(collection(firestore, 'users'), where('id', 'not-in', excludedIds.slice(0,10)), limit(5));
        const snapshot = await getDocs(q);
        const userSuggestions = snapshot.docs.map(doc => doc.data() as User);
        setSuggestions(userSuggestions);
      };
      fetchSuggestions();
    }
  }, [user, firestore, followingList]);

  useEffect(() => {
    if (posts) {
      setDisplayedPosts(posts);
    }
  }, [posts]);

  
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


  if (isUserLoading || postsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleFollowToggle = (userId: string) => {
    // This will be implemented in a future step
    console.log("Toggling follow for user:", userId);
  };

  return (
    <>
      <div className="container mx-auto max-w-screen-lg p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <div className="flex flex-col gap-8">
              <StoriesCarousel />
              {displayedPosts.length > 0 ? (
                  displayedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                  ))
              ) : (
                  <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground">Welcome to YCP</h3>
                  <p className="mt-2">Your feed is empty.</p>
                  <p>Start following people to see their posts here.</p>
                  <Button asChild className="mt-4">
                      <Link href="/explore">Find People to Follow</Link>
                  </Button>
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
                      <SuggestionCard key={s.id} suggestion={s} onFollowToggle={handleFollowToggle} />
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
    </>
  );
}
