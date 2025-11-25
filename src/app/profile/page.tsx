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
  const { data: posts, isLoading: arePostsLoading } = useCollection(postsQuery);


  const profileUser = useMemo(() => {
    if (!user || !userProfileData) return null;
    return {
      id: user.uid,
      username: userProfileData.username || user.email?.split('@')[0] || 'user',
      fullName: userProfileData.fullName || user.displayName || 'User',
      bio: userProfileData.bio || "Welcome to my profile!",
      profilePhoto: userProfileData.profilePhoto || user.photoURL || `https://picsum.photos/seed/${user.uid}/150/150`,
      postsCount: posts?.length ?? userProfileData.postsCount ?? 0,
      followersCount: userProfileData.followersCount ?? 0,
      followingCount: userProfileData.followingCount ?? 0,
    };
  }, [user, userProfileData, posts]);

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
      return null;
  }
  
  const emptyState = (
    <div className="text-center p-8">
      <h3 className="font-semibold text-lg">No content yet</h3>
      <p className="text-muted-foreground text-sm">This section is waiting for some action.</p>
    </div>
  );

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center bg-black text-white">
        <div className="w-full max-w-lg">
          {profileUser ? (
              <ProfileHeader user={profileUser} onEditClick={() => setIsEditDialogOpen(true)} />
          ) : (
              <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin" />
              </div>
          )}
        </div>
      </main>
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
