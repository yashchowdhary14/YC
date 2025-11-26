
'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import ReelCard from '@/components/app/reel-card';
import { dummyPosts } from '@/lib/dummy-data';
import type { Post, ReelComment } from '@/lib/types';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CommentsSheet from '@/components/app/comments-sheet';


export default function ReelsPage() {
    const { user, isUserLoading, followedUsers, toggleFollow } = useUser();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    
    const allReels = useMemo(() => dummyPosts.filter(p => p.type === 'reel'), []);

    const [reels, setReels] = useState<Post[]>(allReels);
    const [selectedReelForComments, setSelectedReelForComments] = useState<Post | null>(null);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    const handleUpdateReel = (updatedReel: Post) => {
      setReels(currentReels => 
        currentReels.map(reel => 
          reel.id === updatedReel.id ? updatedReel : reel
        )
      );
    };

    const handleUpdateComment = (reelId: string, updatedComments: ReelComment[]) => {
        setReels(currentReels => 
            currentReels.map(reel => 
              reel.id === reelId ? {...reel, comments: updatedComments} as Post : reel
            )
        );
        if (selectedReelForComments?.id === reelId) {
            setSelectedReelForComments(prev => prev ? ({...prev, comments: updatedComments} as Post) : null);
        }
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.8, // Trigger when 80% of the video is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const videoElement = entry.target.querySelector('video');
                if (videoElement) {
                    if (entry.isIntersecting) {
                        videoElement.play().catch(e => console.error("Autoplay failed:", e));
                    } else {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                    }
                }
            });
        }, options);

        const reelElements = containerRef.current?.querySelectorAll('.reel-card-container');
        if (reelElements) {
            reelElements.forEach(el => observer.observe(el));
        }

        return () => {
            if (reelElements) {
                reelElements.forEach(el => observer.unobserve(el));
            }
        };
    }, [reels]);


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
        <main className="h-[calc(100svh-4rem)] bg-black flex justify-center items-center overflow-hidden">
            <div
              ref={containerRef}
              className="relative h-full w-full max-w-[450px] snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
            >
              {reels.map((reel) => (
                <div key={reel.id} className="reel-card-container h-full w-full snap-start flex items-center justify-center">
                   <ReelCard 
                        reel={reel} 
                        onUpdateReel={handleUpdateReel} 
                        onCommentClick={() => setSelectedReelForComments(reel)}
                        isFollowing={followedUsers.has(reel.user.username)}
                        onFollowToggle={toggleFollow}
                    />
                </div>
              ))}
            </div>
        </main>
        <CommentsSheet 
            reel={selectedReelForComments} 
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSelectedReelForComments(null);
                }
            }}
            onUpdateComment={handleUpdateComment}
            currentUser={user}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
