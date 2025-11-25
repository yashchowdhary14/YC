'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { Post } from '@/lib/types';
import PostCard from '@/components/app/post-card';
import SidebarNav from '@/components/app/sidebar-nav';
import AppHeader from '@/components/app/header';
import StoriesCarousel from '@/components/app/stories-carousel';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useHydratedPosts } from '@/firebase/firestore/use-hydrated-posts';
import { signOut } from 'firebase/auth';

const suggestions = [
  {
    username: 'coffee_lover',
    reason: 'Followed by user4',
    avatarUrl: 'https://picsum.photos/seed/suggestion1/100/100',
  },
  {
    username: 'travel_bug',
    reason: 'New to YC',
    avatarUrl: 'https://picsum.photos/seed/suggestion2/100/100',
  },
  {
    username: 'code_wizard',
    reason: 'Followed by user2',
    avatarUrl: 'https://picsum.photos/seed/suggestion3/100/100',
  },
  {
    username: 'art_enthusiast',
    reason: 'Popular on YC',
    avatarUrl: 'https://picsum.photos/seed/suggestion4/100/100',
  },
];

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
    () => (firestore ? collection(firestore, 'posts') : null),
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

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
      return null; // or a login page redirect
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">YC</h1>
          </div>
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
                      <div key={s.username} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={s.avatarUrl} alt={s.username} />
                          <AvatarFallback>{s.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                           <p className="font-semibold text-sm">{s.username}</p>
                           <p className="text-xs text-muted-foreground">{s.reason}</p>
                        </div>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary">Follow</Button>
                      </div>
                    ))}
                  </div>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
