
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import { Loader2, Database } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Stream, Category } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LiveSidebar from '@/components/live/live-sidebar';
import StreamGrid from '@/components/live/stream-grid';
import CategoryGrid from '@/components/live/category-grid';
import FeaturedStreamCarousel from '@/components/live/featured-stream-carousel';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { seedDatabase } from '@/lib/seed-db';
import { useToast } from '@/hooks/use-toast';


export default function LivePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const streamsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'streams'), where('isLive', '==', true), orderBy('viewerCount', 'desc')) : null
  , [firestore]);
  
  const categoriesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'categories'), orderBy('name')) : null
  , [firestore]);

  const recommendedChannelsQuery = useMemoFirebase(() =>
    firestore ? query(collection(firestore, 'streams'), where('isLive', '==', true), orderBy('viewerCount', 'desc'), limit(7)) : null
  , [firestore]);

  const { data: liveStreams, isLoading: streamsLoading } = useCollection<Stream>(streamsQuery);
  const { data: categories, isLoading: categoriesLoading } = useCollection<Category>(categoriesQuery);
  const { data: recommendedChannels, isLoading: channelsLoading } = useCollection<Stream>(recommendedChannelsQuery);

  const { featuredStreams, justChattingStreams } = useMemo(() => {
    if (!liveStreams) return { featuredStreams: [], justChattingStreams: [] };
    const featured = liveStreams.slice(0, 5);
    const justChatting = liveStreams.filter(s => s.category === 'Just Chatting');
    return { featuredStreams: featured, justChattingStreams: justChatting };
  }, [liveStreams]);
  
  const handleSeedDb = useCallback(async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
      await seedDatabase(firestore);
      toast({
        title: 'Database Seeded!',
        description: 'Your Firestore database has been populated with sample data.',
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'Could not seed the database. Check the console for errors.',
      });
    } finally {
      setIsSeeding(false);
    }
  }, [firestore, toast]);


  const isLoading = isUserLoading || streamsLoading || categoriesLoading || channelsLoading;

  if (!user && !isUserLoading) {
     return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <p>Please log in to view this page.</p>
      </div>
    );
  }
  
  const hasData = liveStreams && liveStreams.length > 0 && categories && categories.length > 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-900 text-white overscroll-contain">
        <LiveSidebar 
          recommendedChannels={recommendedChannels || []} 
          recommendedCategories={(categories || []).slice(0,6)} 
        />
        <SidebarInset className="flex-1 flex flex-col">
          <AppHeader>
             <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </SidebarTrigger>
          </AppHeader>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-contain">
              {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
              ) : !hasData ? (
                 <div className="flex flex-col items-center justify-center text-center h-full max-w-md mx-auto">
                    <Database className="h-16 w-16 text-muted-foreground" />
                    <h2 className="mt-4 text-2xl font-bold">No Live Data Found</h2>
                    <p className="mt-2 text-muted-foreground">
                      Your database appears to be empty. Click the button below to seed it with sample streams and categories to get started.
                    </p>
                    <Button onClick={handleSeedDb} disabled={isSeeding} className="mt-6">
                      {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                      Seed Database
                    </Button>
                </div>
              ) : (
                <div className="space-y-12">
                    <FeaturedStreamCarousel streams={featuredStreams} />

                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                          <span className="text-primary hover:underline cursor-pointer">Live channels</span> we think you'll like
                        </h2>
                        <StreamGrid streams={(liveStreams || []).slice(0,12)} />
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            <span className="text-primary hover:underline cursor-pointer">Categories</span> we think you'll like
                        </h2>
                        <CategoryGrid categories={categories || []} />
                    </div>

                    {justChattingStreams.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">
                          <span className="text-primary hover:underline cursor-pointer">Just Chatting</span> channels
                        </h2>
                        <StreamGrid streams={justChattingStreams} />
                      </div>
                    )}
                </div>
              )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

    