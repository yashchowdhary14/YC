
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
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

  const postsQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'users', user.uid, 'posts'), orderBy('createdAt', 'desc')) : null),
    [firestore, user]
  );
  const { data: postsData, isLoading: arePostsLoading } = useCollection(postsQuery);


  const profileUser = useMemo(() => {
    if (!user || !userProfileData) return null;
    return {
      id: user.uid,
      username: userProfileData.username || user.email?.split('@')[0] || 'user',
      fullName: userProfileData.fullName || user.displayName || 'User',
      bio: userProfileData.bio || "Welcome to my profile!",
      profilePhoto: userProfileData.profilePhoto || user.photoURL || `https://picsum.photos/seed/${user.uid}/150/150`,
      postsCount: postsData?.length ?? userProfileData.postsCount ?? 0,
      followersCount: userProfileData.followersCount ?? 0,
      followingCount: userProfileData.followingCount ?? 0,
    };
  }, [user, userProfileData, postsData]);

  const posts = useMemo(() => {
    if (!postsData) return [];
    return postsData.map(post => ({
        ...post,
        likes: post.likes || [],
    }));
  }, [postsData]);

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user || !profileUser) {
      return null;
  }
  
  const emptyState = (
    <div className="text-center p-8">
      <h3 className="font-semibold text-lg">No content yet</h3>
      <p className="text-muted-foreground text-sm">This section is waiting for some action.</p>
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
             <ProfileHeader user={profileUser} onEditClick={() => setIsEditDialogOpen(true)} isCurrentUser={true} />
             
             {/* Bio for mobile */}
            <div className="text-sm mt-4 sm:hidden">
                <p className="font-semibold">{profileUser.fullName}</p>
                <p className="whitespace-pre-wrap">{profileUser.bio}</p>
            </div>
            
            {/* Stats for mobile */}
            <Separator className="my-4 sm:hidden" />
             <div className="flex sm:hidden items-center justify-around text-center text-sm">
                <div><span className="font-semibold">{profileUser.postsCount}</span><br/>posts</div>
                <div><span className="font-semibold">{profileUser.followersCount}</span><br/>followers</div>
                <div><span className="font-semibold">{profileUser.followingCount}</span><br/>following</div>
            </div>
             <Separator className="my-4 sm:hidden" />


             <div className="my-8">
                <HighlightsCarousel />
             </div>

             <TabSwitcher 
                postsContent={<PostsGrid posts={posts} />}
                reelsContent={emptyState}
                taggedContent={emptyState}
             />
          </div>
        </main>
      </SidebarInset>
      {user && profileUser && (
        <EditProfileDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userProfile={profileUser}
        />
      )}
    </SidebarProvider>
  );
}
