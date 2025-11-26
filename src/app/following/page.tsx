
'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { dummyUsers } from '@/lib/dummy-data';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function FollowingPage() {
  const { user, isUserLoading, followedUsers, toggleFollow } = useUser();
  const router = useRouter();

  const followingList = useMemo(() => {
    // In dummy data, followedUsers is a Set of usernames. We find the full user object.
    return dummyUsers.filter(u => followedUsers.has(u.username));
  }, [followedUsers]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
        <AppHeader>
             <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </SidebarTrigger>
        </AppHeader>
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto max-w-md p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-4">Following</h1>
            <Card>
              <ScrollArea className="h-96">
                <div className="p-4 space-y-4">
                  {followingList.length > 0 ? (
                    followingList.map(followedUser => (
                      <div key={followedUser.id} className="flex items-center gap-4">
                        <Link href={`/${followedUser.username}`} className="flex items-center gap-4 flex-1">
                           <Avatar>
                              <AvatarImage src={`https://picsum.photos/seed/${followedUser.id}/100/100`} />
                              <AvatarFallback>{followedUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="font-semibold">{followedUser.username}</p>
                              <p className="text-sm text-muted-foreground">{followedUser.fullName}</p>
                           </div>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleFollow(followedUser.username)}
                        >
                          Following
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground p-8">
                      <p>You aren&apos;t following anyone yet.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
