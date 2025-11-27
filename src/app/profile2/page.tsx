
'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { useUser } from '@/firebase';
import { dummyUsers, dummyPosts } from '@/lib/dummy-data';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostsGrid from '@/components/profile/PostsGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3x3, Clapperboard, UserSquare2 } from 'lucide-react';
import { Post } from '@/lib/types';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();

  // For this example, we'll just grab the first dummy user.
  // In a real app, you'd fetch based on the `username` param.
  const profileUser = dummyUsers[0];

  const userPosts: Post[] = useMemo(() => {
    if (!profileUser) return [];
    return dummyPosts.filter(p => p.uploaderId === profileUser.id && (p.type === 'photo' || p.type === 'reel'));
  }, [profileUser]);

  const userReels: Post[] = useMemo(() => {
    return userPosts.filter(p => p.type === 'reel');
  }, [userPosts]);
  
  const taggedPosts: Post[] = useMemo(() => {
    // Simulate finding posts the user is tagged in
    return dummyPosts.slice(5, 10);
  }, []);

  if (!profileUser) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <ProfileHeader user={profileUser} postsCount={userPosts.length} />

        <Tabs defaultValue="grid" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-3 md:w-1/2 mx-auto bg-transparent border-b rounded-none">
            <TabsTrigger value="grid" className="rounded-none">
              <Grid3x3 className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">POSTS</span>
            </TabsTrigger>
            <TabsTrigger value="reels" className="rounded-none">
              <Clapperboard className="h-4 w-4 mr-2" />
               <span className="hidden md:inline">REELS</span>
            </TabsTrigger>
            <TabsTrigger value="tagged" className="rounded-none">
              <UserSquare2 className="h-4 w-4 mr-2" />
               <span className="hidden md:inline">TAGGED</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-6">
            <PostsGrid posts={userPosts} />
          </TabsContent>
          <TabsContent value="reels" className="mt-6">
            <PostsGrid posts={userReels} />
          </TabsContent>
          <TabsContent value="tagged" className="mt-6">
             <PostsGrid posts={taggedPosts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
