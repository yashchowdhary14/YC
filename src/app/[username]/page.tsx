
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import type { Post } from '@/lib/types';
import { dummyUsers, dummyPosts, dummyFollows, dummyChats } from '@/lib/dummy-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const { profileUser, posts, isCurrentUser } = useMemo(() => {
    const userFromSlug = dummyUsers.find(u => u.username === username);
    if (!userFromSlug) return { profileUser: null, posts: [], isCurrentUser: false };

    const userPosts = dummyPosts
      .filter(p => p.userId === userFromSlug.id)
      .map(p => {
        const image = PlaceHolderImages.find(img => img.id === p.imageId)!;
        return {
          ...p,
          imageUrl: image.imageUrl,
          imageHint: image.imageHint,
        };
      });

    const followersCount = Object.values(dummyFollows).filter(followingList => followingList.includes(userFromSlug.id)).length;
    const followingCount = dummyFollows[userFromSlug.id]?.length || 0;
    
    const hydratedProfileUser = {
      ...userFromSlug,
      profilePhoto: `https://picsum.photos/seed/${userFromSlug.id}/150/150`,
      postsCount: userPosts.length,
      followersCount,
      followingCount,
    };

    const isCurrentUserProfile = currentUser?.uid === hydratedProfileUser.id;

    return { profileUser: hydratedProfileUser, posts: userPosts, isCurrentUser: isCurrentUserProfile };
  }, [username, currentUser]);

  const handleMessageClick = () => {
    if (!currentUser || !profileUser || isCurrentUser) return;
    const sortedIds = [currentUser.uid, profileUser.id].sort();
    const chatId = sortedIds.join('_');
    router.push(`/chat/${chatId}`);
  };

  if (!profileUser) {
    return notFound();
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
        <AppHeader>
             <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </SidebarTrigger>
        </AppHeader>
        <main className="bg-background">
          <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <ProfileHeader
              user={profileUser}
              onEditClick={() => setIsEditDialogOpen(true)}
              onMessageClick={handleMessageClick}
              isNavigatingToChat={false} // This is just for UI, not critical for dummy data
              isCurrentUser={isCurrentUser}
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
      {isCurrentUser && profileUser && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userProfile={profileUser}
        />
      )}
    </SidebarProvider>
  );
}
