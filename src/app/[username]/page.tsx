
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
} from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { dummyUsers, dummyPosts } from '@/lib/dummy-data';
import type { Post, User } from '@/lib/types';
import { createOrGetChat } from '@/app/actions';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const profileUser = useMemo(() => {
    return dummyUsers.find(u => u.username === username);
  }, [username]);

  const posts = useMemo(() => {
    if (!profileUser) return [];
    return dummyPosts
      .filter(p => p.userId === profileUser.id)
      .map(p => ({
        ...p,
        user: { 
          id: p.userId,
          username: profileUser.username,
          avatarUrl: profileUser.avatarUrl,
          fullName: profileUser.fullName,
        },
      }));
  }, [profileUser]);

  const handleMessageClick = async () => {
    if (!currentUser || !profileUser || isCurrentUser) return;
    setIsNavigating(true);
    const result = await createOrGetChat(profileUser.id, currentUser.uid);
    if (result.success && result.chatId) {
      router.push(`/chat/${result.chatId}`);
    } else {
      console.error(result.error);
      setIsNavigating(false);
    }
  };


  if (!profileUser) {
     return notFound();
  }

  const isCurrentUser = currentUser?.uid === profileUser.id;

  const headerUser = {
      username: profileUser.username,
      fullName: profileUser.fullName,
      bio: profileUser.bio,
      profilePhoto: profileUser.avatarUrl,
      postsCount: posts.length,
      followersCount: profileUser.followersCount,
      followingCount: profileUser.followingCount,
      verified: profileUser.verified,
  };
  
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
              user={headerUser}
              onEditClick={() => setIsEditDialogOpen(true)}
              onMessageClick={handleMessageClick}
              isNavigatingToChat={isNavigating}
              isCurrentUser={isCurrentUser}
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
      {isCurrentUser && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userProfile={profileUser}
        />
      )}
    </SidebarProvider>
  );
}
