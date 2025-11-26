
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, limit } from 'firebase/firestore';
import { motion, useScroll, useTransform } from 'framer-motion';

import EditProfileDialog from '@/components/app/edit-profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import HighlightsCarousel from '@/components/profile/HighlightsCarousel';
import TabSwitcher from '@/components/profile/TabSwitcher';
import PostsGrid from '@/components/profile/PostsGrid';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Post, User as UserType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  user: UserType;
  posts: Post[];
}

function ProfileSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 pt-20">
            <header className="flex gap-4 md:gap-16 items-start w-full">
                <Skeleton className="rounded-full w-20 h-20 md:w-36 md:h-36 shrink-0" />
                <div className="flex flex-col gap-4 flex-grow">
                    <div className="flex flex-wrap items-center gap-4">
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="hidden md:block space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </header>
             <div className="my-8">
                 <div className="flex space-x-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <Skeleton className="w-14 h-4" />
                        </div>
                    ))}
                </div>
             </div>
            <Separator />
            <div className="grid grid-cols-3 gap-1 mt-4">
                 {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square" />
                 ))}
            </div>
        </div>
    )
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const { scrollYProgress } = useScroll();
  const avatarScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.5]);
  const avatarY = useTransform(scrollYProgress, [0, 0.1], [0, -20]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 0.5, 0]);

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
          setIsLoading(false);
          return;
        }

        const profileUserDoc = userSnapshot.docs[0];
        const profileUserData = profileUserDoc.data() as UserType;
        
        const postsRef = collection(firestore, 'posts');
        const postsQuery = query(postsRef, where('userId', '==', profileUserDoc.id));
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(doc => doc.data() as Post);

        setProfileData({ user: profileUserData, posts: userPosts });

      } catch (error) {
        console.error("Error fetching profile data:", error);
        setProfileData(null);
      } finally {
        // Simulate a small delay for skeleton visibility
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchUserAndPosts();
  }, [firestore, username]);

  const { profileUser, posts } = useMemo(() => {
    if (!profileData) return { profileUser: null, posts: [] };

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
          <div className="bg-background">
            <ProfileSkeleton />
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
      <div className="bg-background">
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 pt-20">
          <ProfileHeader
            user={profileUser as any}
            onEditClick={() => setIsEditDialogOpen(true)}
            onMessageClick={handleMessageClick}
            isNavigatingToChat={false} 
            isCurrentUser={isCurrentUser}
            animatedAvatar={{ scale: avatarScale, y: avatarY }}
            animatedHeader={{ opacity: headerOpacity }}
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
