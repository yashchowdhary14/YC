'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import the components for the profile page
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsRow from '@/components/profile/StatsRow';
import HighlightsCarousel from '@/components/profile/HighlightsCarousel';
import TabSwitcher from '@/components/profile/TabSwitcher';
import PostsGrid from '@/components/profile/PostsGrid';
import EditProfileDialog from '@/components/app/edit-profile';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Placeholder state for user object and posts as per the plan
  const [profileUser] = useState({
    id: '1',
    username: 'ycombinator',
    fullName: 'YC User',
    bio: 'Building the future. This is a sample bio with a link to my portfolio https://example.com and some #hashtags to check out. #innovation #tech',
    profilePhoto: `https://picsum.photos/seed/1/150/150`,
    postsCount: 12,
    followersCount: 1234,
    followingCount: 123,
  });

  const [posts] = useState(Array.from({ length: 12 }, (_, i) => ({
    id: `post-${i}`,
    imageUrl: `https://picsum.photos/seed/post${i}/400/400`,
    imageHint: 'user post',
    likes: Math.floor(Math.random() * 50) + 10,
    commentsCount: Math.floor(Math.random() * 20),
  })));

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">YC</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <div className="p-2">
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="min-h-full bg-background">
            <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
              {/* Future Firestore hook will go here */}
              <ProfileHeader user={profileUser} onEditClick={() => setIsEditDialogOpen(true)} />
              
              {/* Stats for mobile view */}
              <div className="my-4 sm:hidden">
                <StatsRow stats={profileUser} />
              </div>

              <div className="hidden sm:block my-8">
                 {/* This space is occupied by stats in the header on desktop */}
              </div>

              <div className="mb-8">
                <HighlightsCarousel />
              </div>
              <TabSwitcher 
                postsContent={<PostsGrid posts={posts} />}
                reelsContent={
                  <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Reels will be displayed here.</p>
                  </Card>
                }
                taggedContent={
                  <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Tagged posts will be displayed here.</p>
                  </Card>
                }
              />
            </div>
          </main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
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
