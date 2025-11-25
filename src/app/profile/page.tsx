'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
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
import { ScrollArea } from '@/components/ui/scroll-area';

import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsRow from '@/components/profile/StatsRow';
import HighlightsCarousel from '@/components/profile/HighlightsCarousel';
import TabSwitcher from '@/components/profile/TabSwitcher';
import PostsGrid from '@/components/profile/PostsGrid';
import EditProfileDialog from '@/components/app/edit-profile';
import { Card } from '@/components/ui/card';
import type { Post } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfileData, isLoading: isProfileLoading } = useDoc(userDocRef);

  const postsCollectionRef = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'users', user.uid, 'posts') : null),
    [firestore, user]
  );
  const { data: postsData, isLoading: arePostsLoading } = useCollection(postsCollectionRef);

  const profileUser = useMemo(() => {
    if (!user || !userProfileData) return null;
    return {
      id: userProfileData.id,
      username: userProfileData.username || user.email?.split('@')[0] || 'user',
      fullName: userProfileData.fullName || user.displayName || 'YC User',
      bio: userProfileData.bio || 'Edit your profile to add a bio.',
      profilePhoto: userProfileData.profilePhoto || user.photoURL || `https://picsum.photos/seed/${user.uid}/150/150`,
      postsCount: postsData?.length || 0,
      followersCount: userProfileData.followersCount || 0, // Assuming these fields exist
      followingCount: userProfileData.followingCount || 0,
    };
  }, [user, userProfileData, postsData]);

  const posts = useMemo(() => {
    if (!postsData) return [];
    return postsData.map(p => ({
      id: p.id,
      imageUrl: p.imageUrl,
      imageHint: p.imageHint || 'user post',
      likes: p.likes?.length || 0,
      commentsCount: p.commentsCount || 0,
    }));
  }, [postsData]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (isUserLoading || isProfileLoading || !user || !profileUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
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
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="min-h-full bg-background">
            <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
              <ProfileHeader user={profileUser} onEditClick={() => setIsEditDialogOpen(true)} />
              
              <div className="my-4 sm:hidden">
                <StatsRow stats={profileUser} />
              </div>

              <div className="hidden sm:block my-8">
                 {/* This space is occupied by stats in the header on desktop */}
              </div>

              <div className="mb-8">
                <HighlightsCarousel />
              </div>
              <TabSwitcher 
                postsContent={<PostsGrid posts={posts} />}
                reelsContent={
                  <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Reels will be displayed here.</p>
                  </Card>
                }
                taggedContent={
                  <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Tagged posts will be displayed here.</p>
                  </Card>
                }
              />
            </div>
          </main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
    {user && profileUser && (
      <EditProfileDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        userProfile={profileUser}
      />
    )}
    </>
  );
}
