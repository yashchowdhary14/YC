'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import type { Post } from '@/lib/types';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsRow from '@/components/profile/StatsRow';
import HighlightsCarousel from '@/components/profile/HighlightsCarousel';
import TabSwitcher from '@/components/profile/TabSwitcher';
import PostsGrid from '@/components/profile/PostsGrid';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Mock data as requested for the skeleton
  const mockUser = {
    id: user?.uid || '1',
    username: user?.email?.split('@')[0] || 'ycombinator',
    fullName: user?.displayName || 'YC User',
    bio: 'Building the future. This is a sample bio. Go to Edit Profile to change it.',
    profilePhoto: user?.photoURL || `https://picsum.photos/seed/${user?.uid || '1'}/150/150`,
    posts: 12,
    followers: 1234,
    following: 123,
  };

  const mockPosts = Array.from({ length: 12 }, (_, i) => ({
    id: `post-${i}`,
    imageUrl: `https://picsum.photos/seed/post${i}/400/400`,
    imageHint: 'user post',
    // Add other Post properties if needed by PostsGrid
    user: { id: '', username: '', avatarUrl: '', fullName: '' },
    caption: '',
    createdAt: new Date(),
    likes: 0,
    commentsCount: 0,
  }));
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const handleSignOut = async () => {
    // This functionality will be moved into a dropdown in the ProfileHeader later
    if (user) {
      await signOut(user.auth);
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
          <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <ProfileHeader user={mockUser} />
            <div className="my-8">
              <StatsRow stats={mockUser} />
            </div>
            <HighlightsCarousel />
            <Separator className="my-8" />
            <TabSwitcher />
            <PostsGrid posts={mockPosts} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
