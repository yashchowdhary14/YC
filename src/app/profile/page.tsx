'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

import EditProfileDialog from '@/components/app/edit-profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import HighlightsCarousel from '@/components/profile/HighlightsCarousel';
import TabSwitcher from '@/components/profile/TabSwitcher';
import PostsGrid from '@/components/profile/PostsGrid';
import { Separator } from '@/components/ui/separator';
import AppHeader from '@/components/app/header';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

import SidebarNav from '@/components/app/sidebar-nav';

export default function ProfilePage() {
  const router = useRouter();
  const firestore = useFirestore();

  const { user, isUserLoading } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  /* ---------------------------------------------
    REDIRECT IF NOT LOGGED IN
  ----------------------------------------------*/
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  /* ---------------------------------------------
    FIRESTORE DOC REFERENCES
  ----------------------------------------------*/
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const postsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;

    try {
      return query(
        collection(firestore, 'users', user.uid, 'posts'),
        orderBy('createdAt', 'desc')
      );
    } catch {
      // if createdAt missing, return without order
      return collection(firestore, 'users', user.uid, 'posts');
    }
  }, [firestore, user]);

  /* ---------------------------------------------
    LOAD DATA SAFELY
  ----------------------------------------------*/
  const {
    data: userProfileData,
    isLoading: isProfileLoading,
  } = userDocRef ? useDoc(userDocRef) : { data: null, isLoading: true };

  const {
    data: postsSnapshot,
    isLoading: arePostsLoading,
  } = postsQuery ? useCollection(postsQuery) : { data: null, isLoading: true };

  /* ---------------------------------------------
    PARSE PROFILE USER
  ----------------------------------------------*/
  const profileUser = useMemo(() => {
    if (!user) return null;

    return {
      id: user.uid,
      username:
        userProfileData?.username ||
        user.email?.split('@')[0] ||
        'user',
      fullName:
        userProfileData?.fullName ||
        user.displayName ||
        'User',
      bio: userProfileData?.bio || 'Welcome to my profile!',
      profilePhoto:
        userProfileData?.profilePhoto ||
        user.photoURL ||
        `https://picsum.photos/seed/${user.uid}/150`,

      postsCount: postsSnapshot?.length ?? 0,
      followersCount: userProfileData?.followersCount ?? 0,
      followingCount: userProfileData?.followingCount ?? 0,
      verified: userProfileData?.verified ?? false,
    };
  }, [user, userProfileData, postsSnapshot]);

  /* ---------------------------------------------
    MAP POSTS
  ----------------------------------------------*/
  const posts = useMemo(() => {
    if (!postsSnapshot) return [];

    return postsSnapshot.map((d) => ({
      id: d.id,
      ...d,
      likes: d.likes || [],
    }));
  }, [postsSnapshot]);

  /* ---------------------------------------------
    GLOBAL LOADING
  ----------------------------------------------*/
  if (isUserLoading || isProfileLoading) {
    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  /* ---------------------------------------------
    IF USER OR PROFILE MISSING
  ----------------------------------------------*/
  if (!user || !profileUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  /* ---------------------------------------------
    EMPTY STATE
  ----------------------------------------------*/
  const emptyState = (
    <div className="text-center p-8">
      <h3 className="font-semibold text-lg">No content yet</h3>
      <p className="text-muted-foreground text-sm">
        This section is waiting for some action.
      </p>
    </div>
  );

  /* ---------------------------------------------
    MAIN UI RENDER
  ----------------------------------------------*/
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
        </SidebarHeader>

        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <AppHeader />

        <main className="bg-background">
          <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">

            <ProfileHeader
              user={profileUser}
              onEditClick={() => setIsEditDialogOpen(true)}
              isCurrentUser={true}
            />

            <div className="my-8">
              <HighlightsCarousel />
            </div>

            <Separator />

            <TabSwitcher
              postsContent={<PostsGrid posts={posts} />}
              reelsContent={emptyState}
              taggedContent={emptyState}
            />
          </div>
        </main>
      </SidebarInset>

      {/* EDIT PROFILE DIALOG */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        userProfile={profileUser}
      />
    </SidebarProvider>
  );
}
