
'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { Loader2, ArrowUp } from 'lucide-react';
import type { Post, User } from '@/lib/types';
import StoriesCarousel from '@/components/app/stories-carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, getDocs, doc, setDoc, deleteDoc, startAfter, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import PostCard from '@/components/app/post-card';
import { useIntersection } from '@/hooks/use-intersection';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

function SuggestionCard({ suggestion, onFollowToggle, isFollowing }: { suggestion: User, onFollowToggle: (user: User) => void, isFollowing: boolean }) {
  const handleFollowToggle = () => {
    onFollowToggle(suggestion);
  };

  return (
    <div key={suggestion.username} className="flex items-center gap-3">
      <Link href={`/${suggestion.username}`} className="flex items-center gap-3 flex-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={suggestion.avatarUrl} alt={suggestion.username} />
          <AvatarFallback>{suggestion.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm truncate">{suggestion.username}</p>
          <p className="text-xs text-muted-foreground">Suggested for you</p>
        </div>
      </Link>
      <Button variant="link" size="sm" className="p-0 h-auto text-primary font-semibold text-xs" onClick={handleFollowToggle}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </div>
  )
}

const POSTS_PER_PAGE = 5;

function EmptyFeedContent({ suggestions, onFollowToggle, followedUsers }: { suggestions: User[], onFollowToggle: (user: User) => void, followedUsers: Set<string> }) {
  return (
    <div className="text-center py-16 text-muted-foreground bg-background rounded-lg mt-4 md:mt-0">
      <h3 className="text-xl font-semibold text-foreground">Welcome to YCP</h3>
      <p className="mt-2">Your feed is empty because you aren't following anyone yet.</p>
      <p>Find people to follow to see their posts here.</p>
      
      {suggestions.length > 0 && (
        <div className="max-w-sm mx-auto text-left mt-8">
          <h4 className="font-semibold text-foreground mb-4">Suggestions For You</h4>
          <div className="flex flex-col gap-4">
            {suggestions.map((s) => (
              <SuggestionCard 
                key={s.id} 
                suggestion={s} 
                onFollowToggle={onFollowToggle}
                isFollowing={followedUsers.has(s.username)}
              />
            ))}
          </div>
        </div>
      )}

      <Button asChild className="mt-8">
        <Link href="/explore">Explore More</Link>
      </Button>
    </div>
  );
}

function FeedSkeleton() {
    return (
        <div className="lg:col-span-2">
            <div className="flex flex-col md:gap-8">
                {/* Stories Skeleton */}
                <div className="md:border-b md:border-border md:pb-4 p-4 md:p-0">
                    <div className="flex space-x-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <Skeleton className="w-16 h-16 rounded-full" />
                                <Skeleton className="w-14 h-4" />
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Post Skeletons */}
                <div className="flex flex-col items-center gap-8 mt-4 md:mt-0">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="w-full max-w-xl mx-auto p-2 md:p-0">
                            <div className="flex items-center gap-3 mb-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-3 w-1/6" />
                                </div>
                            </div>
                            <Skeleton className="w-full aspect-square" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default function Home() {
  const { user, isUserLoading, followedUsers, toggleFollow } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const isLoaderVisible = useIntersection(loaderRef, { threshold: 0.1 });


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const followingIds = useMemo(() => {
    if (!user || !followedUsers) return [];
    // A bit of a hack to ensure the current user's own posts don't appear in the feed
    // In a real scenario, you'd likely not follow yourself, but this prevents it.
    return Array.from(followedUsers).filter(id => id !== user.uid);
  }, [user, followedUsers]);
  
  const fetchPosts = useCallback(async (lastVisible: QueryDocumentSnapshot<DocumentData> | null = null) => {
    if (!user || followingIds.length === 0 || isLoadingMore || !hasMore) {
        if (followingIds.length === 0) {
            setPosts([]);
            setHasMore(false);
            setIsInitialLoad(false);
        }
        return;
    }
    setIsLoadingMore(true);

    const postCollection = collection(firestore, 'posts');
    const constraints = [
        where('uploaderId', 'in', followingIds.slice(0, 10)),
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
    ];

    if (lastVisible) {
        constraints.push(startAfter(lastVisible));
    }
    
    const q = query(postCollection, ...constraints);
    const postSnapshot = await getDocs(q);

    const newPosts = postSnapshot.docs.map(doc => doc.data() as Post);
    const lastVisibleDoc = postSnapshot.docs[postSnapshot.docs.length - 1];
    
    setPosts(prev => lastVisible ? [...prev, ...newPosts] : newPosts);
    setLastDoc(lastVisibleDoc || null);
    setHasMore(newPosts.length === POSTS_PER_PAGE);
    setIsLoadingMore(false);
    if(isInitialLoad) setIsInitialLoad(false);
  }, [user, firestore, followingIds, isLoadingMore, hasMore, isInitialLoad]);


  // Initial post fetch
  useEffect(() => {
    if (user && !isUserLoading) {
      // Simulate a slightly longer load time to make skeleton visible
      setTimeout(() => {
          fetchPosts();
      }, 500);
    }
  }, [user, isUserLoading, followedUsers]); // Depend on followedUsers to refetch if they change
  
  // Infinite scroll
  useEffect(() => {
    if (isLoaderVisible && hasMore && !isLoadingMore) {
        fetchPosts(lastDoc);
    }
  }, [isLoaderVisible, hasMore, isLoadingMore, fetchPosts, lastDoc]);

  // Fetch suggestions for you
  useEffect(() => {
    if (user && firestore) {
      const fetchSuggestions = async () => {
        const excludedIds = [user.uid, ...followingIds].slice(0, 10);
        let q;
        if (excludedIds.length > 0) {
            q = query(collection(firestore, 'users'), where('id', 'not-in', excludedIds), limit(5));
        } else {
            q = query(collection(firestore, 'users'), limit(6));
        }
        
        const snapshot = await getDocs(q);
        const userSuggestions = snapshot.docs
          .map(doc => doc.data() as User)
          .filter(suggestion => suggestion.id !== user.uid);
          
        setSuggestions(userSuggestions);
      };
      fetchSuggestions();
    }
  }, [user, firestore, followingIds]);

  
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

  const handleFollowToggleInSuggestion = async (targetUser: User) => {
    toggleFollow(targetUser.username);
  };


  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto max-w-screen-lg md:p-4 lg:p-8 md:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {isInitialLoad ? <FeedSkeleton /> : (
              <div className="lg:col-span-2">
                <div className="flex flex-col md:gap-8">
                  <div className="md:border-b md:border-border md:pb-4">
                    <StoriesCarousel />
                  </div>
                  {posts.length > 0 ? (
                      <div className="flex flex-col items-center gap-8 mt-4 md:mt-0">
                        {posts.map((post, index) => (
                          <motion.div
                              key={post.id}
                              className="w-full"
                              initial={{ opacity: 0, y: 30, scale: 0.98 }}
                              whileInView={{ opacity: 1, y: 0, scale: 1 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                          >
                              <PostCard post={post} />
                          </motion.div>
                        ))}
                        {isLoadingMore && (
                          <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <div ref={loaderRef} />
                      </div>
                  ) : (
                    <EmptyFeedContent suggestions={suggestions} onFollowToggle={handleFollowToggleInSuggestion} followedUsers={followedUsers} />
                  )}
                </div>
              </div>
            )}

            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                {user && (
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.photoURL || ''} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user.displayName || user.email?.split('@')[0]}</p>
                      <p className="text-sm text-muted-foreground">{user.displayName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-muted-foreground text-sm">Suggestions for you</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                      <Link href="/explore">See All</Link>
                    </Button>
                </div>
                <div className="flex flex-col gap-4">
                    {suggestions.map((s) => (
                        <SuggestionCard 
                          key={s.id} 
                          suggestion={s} 
                          onFollowToggle={handleFollowToggleInSuggestion}
                          isFollowing={followedUsers.has(s.username)}
                        />
                    ))}
                </div>
              </div>
            </div>
          </div>
      </div>
      {showBackToTop && (
          <Button
              onClick={scrollToTop}
              className="fixed bottom-20 right-6 h-12 w-12 rounded-full shadow-lg z-50 md:bottom-6"
              size="icon"
          >
              <ArrowUp className="h-6 w-6" />
              <span className="sr-only">Back to top</span>
          </Button>
      )}
    </>
  );
}

    

    