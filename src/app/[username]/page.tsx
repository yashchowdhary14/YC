
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, Grid3x3, Clapperboard, AtSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyUsers, dummyPosts } from '@/lib/dummy-data';
import type { User, Post } from '@/lib/types';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostsGrid from '@/components/profile/PostsGrid';
import { Skeleton } from '@/components/ui/skeleton';

type ProfileUser = User & {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
};

function ProfilePageSkeleton() {
    return (
        <div className="p-4 md:p-8">
            <div className="flex gap-4 md:gap-8 items-center">
                <Skeleton className="h-20 w-20 md:h-36 md:w-36 rounded-full" />
                <div className="flex-1 flex justify-around">
                    <div className="text-center"><Skeleton className="h-6 w-8 mb-1" /><Skeleton className="h-4 w-12" /></div>
                    <div className="text-center"><Skeleton className="h-6 w-8 mb-1" /><Skeleton className="h-4 w-16" /></div>
                    <div className="text-center"><Skeleton className="h-6 w-8 mb-1" /><Skeleton className="h-4 w-16" /></div>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 w-10 rounded-lg" />
            </div>
        </div>
    );
}


export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, followedUsers, toggleFollow, isUserLoading } = useUser();
  
  const [profileData, setProfileData] = useState<{user: User | null, posts: Post[]}>({ user: null, posts: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data based on username from dummy data
    const user = dummyUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (user) {
        const posts = dummyPosts.filter(p => p.uploaderId === user.id);
        setTimeout(() => { // simulate network delay
            setProfileData({ user: user as User, posts });
            setIsLoading(false);
        }, 300);
    } else {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    }
  }, [username]);

  const profileUser: ProfileUser | null = useMemo(() => {
    if (!profileData.user || !currentUser) return null;
    
    const isFollowing = followedUsers.has(profileData.user.username);
    const isCurrentUser = currentUser.uid === profileData.user.id;

    return {
      ...profileData.user,
      profilePhoto: `https://picsum.photos/seed/${profileData.user.id}/150/150`,
      postsCount: profileData.posts.length,
      // Using dummy counts from the user object for now
      followersCount: profileData.user.followersCount,
      followingCount: profileData.user.followingCount,
      isFollowing,
      isCurrentUser,
    };
  }, [profileData, currentUser, followedUsers]);


  const handleFollowToggle = () => {
    if (profileUser && !profileUser.isCurrentUser) {
      toggleFollow(profileUser.username);
    }
  };

  const handleMessageClick = () => {
    if (profileUser && !profileUser.isCurrentUser && currentUser) {
      // In a real app, you would check if a chat exists or create one.
      // Here we just navigate to a predictable chat URL.
      const chatId = [currentUser.uid, profileUser.id].sort().join('_');
      window.location.href = `/chat/${chatId}`;
    }
  }

  if (isLoading || isUserLoading) {
    return (
        <div className="container mx-auto max-w-4xl pt-14">
            <ProfilePageSkeleton />
        </div>
    )
  }

  if (!profileUser) {
    return notFound();
  }

  const reels = profileData.posts.filter(p => p.type === 'reel' || p.type === 'video');
  const taggedPosts = dummyPosts.slice(5, 11); // just some random posts for demo

  return (
    <div className="container mx-auto max-w-4xl p-0 md:p-4 md:pt-8 pt-14">
        <ProfileHeader 
            user={profileUser}
            onFollowToggle={handleFollowToggle}
            onMessageClick={handleMessageClick}
        />
        <Tabs defaultValue="grid" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="grid"><Grid3x3 /></TabsTrigger>
                <TabsTrigger value="reels"><Clapperboard /></TabsTrigger>
                <TabsTrigger value="tagged"><AtSign /></TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
                <PostsGrid posts={profileData.posts} />
            </TabsContent>
            <TabsContent value="reels">
                <PostsGrid posts={reels} columns={2} />
            </TabsContent>
            <TabsContent value="tagged">
                <PostsGrid posts={taggedPosts} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
