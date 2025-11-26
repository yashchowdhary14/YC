
'use client';

import { useRef, useEffect, useState } from 'react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import ReelCard from '@/components/app/reel-card';
import { dummyReels } from '@/lib/dummy-data';
import type { Reel } from '@/lib/types';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function ReelsPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [reels, setReels] = useState<Reel[]>(dummyReels);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    const handleUpdateReel = (updatedReel: Reel) => {
      setReels(currentReels => 
        currentReels.map(reel => 
          reel.id === updatedReel.id ? updatedReel : reel
        )
      );
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
        <AppHeader />
        <main className="h-[calc(100vh-4rem)] bg-black flex justify-center">
            <div
              ref={containerRef}
              className="relative h-full w-full max-w-md snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
            >
              {reels.map((reel) => (
                <div key={reel.id} className="reel-card-container h-full w-full snap-start flex items-center justify-center">
                   <ReelCard reel={reel} onUpdateReel={handleUpdateReel} />
                </div>
              ))}
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
