
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import EditProfileDialog from '@/components/app/edit-profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import HighlightsCarousel from '@/components/profile/HighlightsCarousel';
import TabSwitcher from '@/components/profile/TabSwitcher';
import PostsGrid from '@/components/profile/PostsGrid';
import { Separator } from '@/components/ui/separator';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { dummyUsers, dummyPosts, dummyFollows } from '@/lib/dummy-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Post } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  const { profileUser, posts } = useMemo(() => {
    if (!user) return { profileUser: null, posts: [] };

    const userProfileData = dummyUsers.find(u => u.id === user.uid);
    if (!userProfileData) return { profileUser: null, posts: [] };

    const userPosts = dummyPosts
      .filter(p => p.userId === user.uid)
      .map(p => {
        const image = PlaceHolderImages.find(img => img.id === p.imageId)!;
        return {
          id: p.id,
          imageUrl: image.imageUrl,
          imageHint: image.imageHint,
          likes: p.likes,
          commentsCount: p.commentsCount,
        };
      });

    const followersCount = Object.values(dummyFollows).filter(followingList => followingList.includes(user.uid)).length;
    const followingCount = dummyFollows[user.uid]?.length || 0;

    const hydratedProfileUser = {
      ...userProfileData,
      id: user.uid,
      username: userProfileData.username,
      fullName: userProfileData.fullName,
      profilePhoto: `https://picsum.photos/seed/${user.uid}/150`,
      postsCount: userPosts.length,
      followersCount: followersCount,
      followingCount: followingCount,
    };

    return { profileUser: hydratedProfileUser, posts: userPosts };
  }, [user]);

  if (isUserLoading || !profileUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const emptyState = (
    <div className="text-center p-8">
      <h3 className="font-semibold text-lg">No content yet</h3>
      <p className="text-muted-foreground text-sm">
        This section is waiting for some action.
      </p>
    </div>
  );

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
              postsContent={<PostsGrid posts={posts as any} />}
              reelsContent={emptyState}
              taggedContent={emptyState}
            />
          </div>
        </main>
      </SidebarInset>
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        userProfile={profileUser}
      />
    </SidebarProvider>
  );
}
