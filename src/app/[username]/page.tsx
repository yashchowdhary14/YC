
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Post } from '@/lib/types';
import { createOrGetChat } from '@/app/actions';
import { doc, query, collection, where, getDocs } from 'firebase/firestore';


export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isUserLoading: isCurrentUserLoading } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const firestore = useFirestore();

  const [profileUser, setProfileUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Fetch user by username
  useEffect(() => {
    if (!firestore || !username) return;

    const fetchUser = async () => {
      setIsUserLoading(true);
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setProfileUser(null);
        } else {
          const userDoc = querySnapshot.docs[0];
          setProfileUser({ id: userDoc.id, ...userDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setProfileUser(null);
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchUser();
  }, [firestore, username]);
  
  const postsQuery = useMemoFirebase(
    () => (firestore && profileUser ? query(collection(firestore, 'users', profileUser.id, 'posts')) : null),
    [firestore, profileUser]
  );
  const { data: postsData, isLoading: arePostsLoading } = useCollection(postsQuery);
  

  const isCurrentUser = currentUser?.uid === profileUser?.id;
  
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

  const posts = useMemo(() => {
    if (!postsData) return [];
    return postsData.map(p => ({...p}));
  }, [postsData]);


  if (isUserLoading || isCurrentUserLoading || arePostsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isUserLoading && !profileUser) {
     return notFound();
  }
  
  const headerUser = {
      id: profileUser!.id,
      username: profileUser!.username,
      fullName: profileUser!.fullName,
      bio: profileUser!.bio,
      profilePhoto: profileUser!.profilePhoto,
      postsCount: posts.length,
      followersCount: profileUser!.followersCount,
      followingCount: profileUser!.followingCount,
      verified: profileUser!.verified,
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
