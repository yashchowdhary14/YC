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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { ScrollArea } from '@/components/ui/scroll-area';

import ProfileHeader from '@/components/profile/ProfileHeader';
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

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

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
      followersCount: userProfileData.followersCount || 0,
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


  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
      return null; // Or redirect to login
  }

  return (
    <>
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
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="min-h-full bg-background">
            <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
              {profileUser && <ProfileHeader user={profileUser} onEditClick={() => setIsEditDialogOpen(true)} />}

              <div className="my-8">
                 {/* This space is occupied by stats in the header on desktop */}
              </div>

              <div className="mb-8">
                <HighlightsCarousel />
              </div>
              <TabSwitcher 
                postsContent={arePostsLoading ? <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div> : <PostsGrid posts={posts} />}
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
