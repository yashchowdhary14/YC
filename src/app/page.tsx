'use client';

import { useEffect, useState, useOptimistic } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { Post } from '@/lib/types';
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
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useHydratedPosts } from '@/firebase/firestore/use-hydrated-posts';
import { signOut } from 'firebase/auth';
import { followUser, unfollowUser } from './actions';
import { useToast } from '@/hooks/use-toast';

const suggestions = [
  {
    id: 'user_suggestion_1',
    username: 'coffee_lover',
    reason: 'Followed by user4',
    avatarUrl: 'https://picsum.photos/seed/suggestion1/100/100',
  },
  {
    id: 'user_suggestion_2',
    username: 'travel_bug',
    reason: 'New to YC',
    avatarUrl: 'https://picsum.photos/seed/suggestion2/100/100',
  },
  {
    id: 'user_suggestion_3',
    username: 'code_wizard',
    reason: 'Followed by user2',
    avatarUrl: 'https://picsum.photos/seed/suggestion3/100/100',
  },
  {
    id: 'user_suggestion_4',
    username: 'art_enthusiast',
    reason: 'Popular on YC',
    avatarUrl: 'https://picsum.photos/seed/suggestion4/100/100',
  },
];

function SuggestionCard({ suggestion, currentUserId }: { suggestion: typeof suggestions[0], currentUserId: string }) {
    const [optimisticFollowing, toggleOptimisticFollowing] = useOptimistic(
        false,
        (state) => !state
    );
    const { toast } = useToast();

    const handleFollowToggle = async () => {
        toggleOptimisticFollowing(null);
        const action = optimisticFollowing ? unfollowUser : followUser;
        const result = await action(currentUserId, suggestion.id);
        if (!result.success) {
            toast({
                variant: 'destructive',
                title: `Failed to ${optimisticFollowing ? 'unfollow' : 'follow'}`,
                description: result.error,
            });
            toggleOptimisticFollowing(null); // Revert on failure
        }
    };
    
    return (
        <div key={suggestion.username} className="flex items-center gap-3">
            <Avatar>
            <AvatarImage src={suggestion.avatarUrl} alt={suggestion.username} />
            <AvatarFallback>{suggestion.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
            <p className="font-semibold text-sm">{suggestion.username}</p>
            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto text-primary" onClick={handleFollowToggle}>
                {optimisticFollowing ? 'Following' : 'Follow'}
            </Button>
        </div>
    )
}

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const postsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'posts'), orderBy('createdAt', 'desc')) : null),
    [firestore]
  );
  const { data: postsData, isLoading: postsLoading } = useCollection<Omit<Post, 'user'>>(postsQuery);
  const { posts, isLoading: isHydrating } = useHydratedPosts(postsData);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
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
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-8">
                  <StoriesCarousel />
                  {postsLoading || isHydrating ? (
                     <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : posts.length > 0 ? (
                     posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      No posts to show. Follow some people!
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-1">
                 <div className="sticky top-24">
                   <div className="flex items-center justify-between mb-4">
                     <p className="font-semibold text-muted-foreground">Suggestions for you</p>
                     <Button variant="link" size="sm" className="p-0 h-auto">See All</Button>
                   </div>
                   <div className="flex flex-col gap-4">
                    {suggestions.map((s) => (
                        <SuggestionCard key={s.id} suggestion={s} currentUserId={user.uid} />
                    ))}
                  </div>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
