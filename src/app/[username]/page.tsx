
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

import EditProfileDialog from '@/components/app/edit-profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import HighlightsCarousel from '@/components/profile/HighlightsCarousel';
import TabSwitcher from '@/components/profile/TabSwitcher';
import PostsGrid from '@/components/profile/PostsGrid';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Post, User as UserType } from '@/lib/types';

interface ProfileData {
  user: UserType;
  posts: Post[];
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  // 1. Fetch user by username
  useEffect(() => {
    if (!firestore || !username) return;

    setIsLoading(true);
    const fetchUserAndPosts = async () => {
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', username), limit(1));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
          setProfileData(null);
          return;
        }

        const profileUserDoc = userSnapshot.docs[0];
        const profileUserData = profileUserDoc.data() as UserType;
        
        // 2. Fetch posts for that user
        const postsRef = collection(firestore, 'posts');
        const postsQuery = query(postsRef, where('uploaderId', '==', profileUserDoc.id));
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(doc => doc.data() as Post);

        setProfileData({ user: profileUserData, posts: userPosts });

      } catch (error) {
        console.error("Error fetching profile data:", error);
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [firestore, username]);

  const { profileUser, posts } = useMemo(() => {
    if (!profileData) return { profileUser: null, posts: [] };

    // Hydrate user data - in a real app this could involve more logic
    const hydratedProfileUser = {
      ...profileData.user,
      postsCount: profileData.posts.length,
      followersCount: profileData.user.followers?.length || 0,
      followingCount: profileData.user.following?.length || 0,
    };

    return { profileUser: hydratedProfileUser, posts: profileData.posts };
  }, [profileData]);


  const handleMessageClick = () => {
    if (!currentUser || !profileUser || isCurrentUser) return;
    const sortedIds = [currentUser.uid, profileUser.id].sort();
    const chatId = sortedIds.join('_');
    router.push(`/chat/${chatId}`);
  };

  if (isLoading) {
      return (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  if (!profileUser) {
    return notFound();
  }
  
  const isCurrentUser = currentUser?.uid === profileUser.id;

  const emptyState = (
    <div className="text-center p-8">
      <h3 className="font-semibold text-lg">No content yet</h3>
      <p className="text-muted-foreground text-sm">
        This section is waiting for some action.
      </p>
    </div>
  );

  return (
    <>
      <div className="bg-background pt-14">
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
          <ProfileHeader
            user={profileUser as any}
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
      </div>
      {isCurrentUser && profileUser && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userProfile={profileUser as any}
        />
      )}
    </>
  );
}
