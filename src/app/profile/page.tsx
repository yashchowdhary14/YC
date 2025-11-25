'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import EditProfileDialog from '@/components/app/edit-profile';
import ProfileHeader from '@/components/profile/ProfileHeader';

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

  const profileUser = useMemo(() => {
    if (!user || !userProfileData) return null;
    return {
      id: userProfileData.id,
      username: userProfileData.username || user.email?.split('@')[0] || 'yashchowdhary_',
      fullName: userProfileData.fullName || user.displayName || 'Yash Chowdhary',
      bio: userProfileData.bio || '',
      profilePhoto: userProfileData.profilePhoto || user.photoURL || `https://picsum.photos/seed/user1/150/150`,
      postsCount: userProfileData.postsCount || 6,
      followersCount: userProfileData.followersCount || 780,
      followingCount: userProfileData.followingCount || 611,
    };
  }, [user, userProfileData]);

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
      return null;
  }

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-black p-4">
        {profileUser ? (
          <ProfileHeader user={profileUser} onEditClick={() => setIsEditDialogOpen(true)} />
        ) : (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
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
