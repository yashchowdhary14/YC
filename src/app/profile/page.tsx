
'use client';

import { useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import { useUser } from '@/firebase';

import ProfileHeader from '@/components/profile/ProfileHeader';
import PostsGrid from '@/components/profile/PostsGrid';
import StoryHighlights from '@/components/profile/StoryHighlights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3x3, Clapperboard, UserSquare2, Bookmark } from 'lucide-react';
import { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import ReelsGrid from '@/components/profile/ReelsGrid';
import SavedPostsGrid from '@/components/profile/SavedPostsGrid';
import TaggedPostsGrid from '@/components/profile/TaggedPostsGrid';
import SettingsSheet from '@/components/profile/SettingsSheet';

function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <ProfileHeader user={null} postsCount={0} onSettingsClick={() => { }} />
        <div className="mt-8 pb-2">
          <div className="flex space-x-4 overflow-x-hidden -mx-4 px-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
        <Tabs defaultValue="grid" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-3 md:w-1/2 mx-auto bg-transparent border-b rounded-none">
            <TabsTrigger value="grid"><Skeleton className="h-6 w-20" /></TabsTrigger>
            <TabsTrigger value="reels"><Skeleton className="h-6 w-20" /></TabsTrigger>
            <TabsTrigger value="tagged"><Skeleton className="h-6 w-20" /></TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-3 auto-rows-fr gap-1 md:gap-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="relative w-full aspect-square overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


export default function ProfilePage() {
  const { user: currentUser, appUser, isUserLoading } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const profileUser = useMemo(() => {
    return appUser;
  }, [appUser]);


  const userPosts: Post[] = []; // Real post count should come from user profile or a separate query

  if (isUserLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!profileUser) {
    // This could redirect to login or show a "Please Login" message
    return <ProfilePageSkeleton />;
  }

  const isMyProfile = currentUser?.uid === profileUser.id;

  return (
    <div className="min-h-screen bg-background pt-14">
      <SettingsSheet isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <ProfileHeader
          user={{ ...profileUser, avatarUrl: profileUser.avatarUrl || `https://picsum.photos/seed/${profileUser.id}/150/150` }}
          postsCount={userPosts.length}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />

        <StoryHighlights profileUser={profileUser} />

        <Tabs defaultValue="grid" className="w-full mt-8">
          <TabsList className="flex w-full justify-around md:justify-center gap-0 md:gap-12 bg-transparent border-t border-border/40 h-12 p-0">
            <TabsTrigger
              value="grid"
              className="flex-1 md:flex-none h-full rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground transition-all px-4 md:px-10 uppercase text-xs font-semibold tracking-widest"
            >
              <Grid3x3 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">POSTS</span>
            </TabsTrigger>

            <TabsTrigger
              value="reels"
              className="flex-1 md:flex-none h-full rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground transition-all px-4 md:px-10 uppercase text-xs font-semibold tracking-widest"
            >
              <Clapperboard className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">REELS</span>
            </TabsTrigger>

            {isMyProfile && (
              <TabsTrigger
                value="saved"
                className="flex-1 md:flex-none h-full rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground transition-all px-4 md:px-10 uppercase text-xs font-semibold tracking-widest"
              >
                <Bookmark className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">SAVED</span>
              </TabsTrigger>
            )}

            <TabsTrigger
              value="tagged"
              className="flex-1 md:flex-none h-full rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground transition-all px-4 md:px-10 uppercase text-xs font-semibold tracking-widest"
            >
              <UserSquare2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">TAGGED</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4 animate-in fade-in duration-500">
            <PostsGrid userId={profileUser.id} />
          </TabsContent>

          <TabsContent value="reels" className="mt-4 animate-in fade-in duration-500">
            <ReelsGrid userId={profileUser.id} />
          </TabsContent>

          {isMyProfile && (
            <TabsContent value="saved" className="mt-4 animate-in fade-in duration-500">
              <SavedPostsGrid userId={profileUser.id} />
            </TabsContent>
          )}

          <TabsContent value="tagged" className="mt-4 animate-in fade-in duration-500">
            <TaggedPostsGrid userId={profileUser.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
