'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useAuth,
  useUser,
  useFirestore,
  useDoc,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Settings, Image as ImageIcon } from 'lucide-react';
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
import { signOut } from 'firebase/auth';

type Post = {
  id: string;
  imageUrl: string;
  imageHint: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userRef);

  const postsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'posts'), where('userId', '==', user.uid)) : null, [firestore, user]);
  const { data: posts, isLoading: arePostsLoading } = useCollection<Post>(postsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (user && firestore) {
        const postsCol = collection(firestore, 'users', user.uid, 'posts');
        const followersCol = collection(firestore, 'users', user.uid, 'followers');
        const followingCol = collection(firestore, 'users', user.uid, 'following');
        
        const postsSnapshot = await getCountFromServer(postsCol);
        const followersSnapshot = await getCountFromServer(followersCol);
        const followingSnapshot = await getCountFromServer(followingCol);

        setPostCount(postsSnapshot.data().count);
        setFollowerCount(followersSnapshot.data().count);
        setFollowingCount(followingSnapshot.data().count);
      }
    };
    fetchCounts();
  }, [user, firestore]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading || isProfileLoading || !userProfile) {
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
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <header className="flex items-center gap-8 md:gap-16 mb-8">
              <Avatar className="h-24 w-24 md:h-36 md:w-36 border-4 border-background ring-2 ring-primary">
                <AvatarImage src={userProfile.profilePhoto} alt={userProfile.username} />
                <AvatarFallback>{userProfile.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-light">{userProfile.username}</h1>
                  <Button variant="secondary" size="sm" className="hidden md:inline-flex">
                    Edit Profile
                  </Button>
                   <Button variant="ghost" size="icon" className="md:hidden">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
                 <Button variant="secondary" size="sm" className="w-full md:hidden">
                    Edit Profile
                  </Button>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{postCount}</span> posts
                  </div>
                  <div>
                    <span className="font-semibold">{followerCount}</span> followers
                  </div>
                  <div>
                    <span className="font-semibold">{followingCount}</span> following
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold">{userProfile.fullName}</h2>
                  <p className="text-muted-foreground">{userProfile.bio}</p>
                </div>
              </div>
            </header>

            <Separator />

            <div className="mt-8">
              {arePostsLoading ? (
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="aspect-square animate-pulse bg-muted"></Card>
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="aspect-square overflow-hidden relative group">
                      <Image
                        src={post.imageUrl}
                        alt={post.imageHint || 'User post'}
                        fill
                        className="object-cover"
                      />
                    </Card>
                  ))}
                </div>
              ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center mb-4">
                        <ImageIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Posts Yet</h2>
                    <p className="text-muted-foreground">When you share photos, they will appear on your profile.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
