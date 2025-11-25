'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import PostCard from '@/components/app/post-card';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Card } from '@/components/ui/card';

export default function PostPage() {
  const { postId } = useParams();
  const firestore = useFirestore();

  const postRef = useMemoFirebase(
    () => (firestore && postId ? doc(firestore, 'posts', postId as string) : null),
    [firestore, postId]
  );
  
  // We need to fetch the post from the top-level 'posts' collection
  const { data: postData, isLoading, error } = useDoc(postRef);

  const post: Post | null = postData ? {
    id: postData.id,
    user: {
      id: postData.userId,
      username: 'loading...',
      fullName: 'loading...',
      avatarUrl: `https://picsum.photos/seed/${postData.userId}/100/100`,
    },
    imageUrl: postData.imageUrl,
    imageHint: postData.imageHint || '',
    caption: postData.caption,
    createdAt: postData.createdAt?.toDate ? postData.createdAt.toDate() : new Date(),
    likes: postData.likes?.length || 0,
    commentsCount: postData.commentsCount || 0,
  } : null;
  
   const userRef = useMemoFirebase(
    () => (firestore && post?.user.id ? doc(firestore, 'users', post.user.id) : null),
    [firestore, post]
  );
  const { data: userData } = useDoc(userRef);

  if (post && userData) {
      post.user.username = userData.username || 'unknown';
      post.user.fullName = userData.fullName || 'Unknown User';
      post.user.avatarUrl = userData.profilePhoto || `https://picsum.photos/seed/${post.user.id}/100/100`;
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
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="w-full max-w-md lg:max-w-4xl">
              {isLoading && (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {error && (
                <Card className="p-8 text-center">
                  <h2 className="text-xl font-semibold text-destructive">Error</h2>
                  <p className="text-muted-foreground mt-2">Could not load the post. It may have been removed or the link is incorrect.</p>
                </Card>
              )}
              {!isLoading && !error && post && (
                 <div className="lg:hidden">
                    <PostCard post={post} />
                </div>
              )}
               {!isLoading && !error && post && (
                <div className="hidden lg:block">
                  <Card className="grid grid-cols-2 overflow-hidden">
                     <div className="relative aspect-[4/5]">
                      <Image
                        src={post.imageUrl}
                        alt={post.imageHint || 'Post image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                        <PostCard post={post} isCard={false} />
                    </div>
                  </Card>
                </div>
              )}
               {!isLoading && !error && !post && (
                 <Card className="p-8 text-center">
                  <h2 className="text-xl font-semibold">Post not found</h2>
                  <p className="text-muted-foreground mt-2">This post may have been deleted or the URL is incorrect.</p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
