
'use client';

import { useMemo, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useUser } from '@/firebase';
import { dummyUsers, dummyPosts } from '@/lib/dummy-data';
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
            <ProfileHeader user={null} postsCount={0} onSettingsClick={() => {}} />
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
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isUserLoading } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const profileUser = useMemo(() => {
    return dummyUsers.find(u => u.username === username);
  }, [username]);

  const userPosts: Post[] = useMemo(() => {
    if (!profileUser) return [];
    return dummyPosts.filter(p => p.uploaderId === profileUser.id && (p.type === 'photo' || p.type === 'video'));
  }, [profileUser]);

  const isMyProfile = currentUser?.email?.split('@')[0] === username;

  if (isUserLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!profileUser) {
      return notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      <SettingsSheet isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <ProfileHeader 
            user={{...profileUser, avatarUrl: `https://picsum.photos/seed/${profileUser.id}/150/150`}} 
            postsCount={userPosts.length}
            onSettingsClick={() => setIsSettingsOpen(true)}
        />

        <StoryHighlights profileUser={profileUser} />

        <Tabs defaultValue="grid" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-3 mx-auto bg-transparent border-t pt-4">
            <TabsTrigger value="grid" className="rounded-none data-[state=active]:border-t-2 border-foreground">
              <Grid3x3 className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">POSTS</span>
            </TabsTrigger>
            <TabsTrigger value="reels" className="rounded-none data-[state=active]:border-t-2 border-foreground">
              <Clapperboard className="h-5 w-5 md:mr-2" />
               <span className="hidden md:inline">REELS</span>
            </TabsTrigger>
            <TabsTrigger value="tagged" className="rounded-none data-[state=active]:border-t-2 border-foreground">
              <UserSquare2 className="h-5 w-5 md:mr-2" />
               <span className="hidden md:inline">TAGGED</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-6">
            <PostsGrid userId={profileUser.id} />
          </TabsContent>
          <TabsContent value="reels" className="mt-6">
            <ReelsGrid userId={profileUser.id} />
          </TabsContent>
          <TabsContent value="tagged" className="mt-6">
             <TaggedPostsGrid userId={profileUser.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
