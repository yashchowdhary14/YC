
'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useUser } from '@/firebase';
import ReelCard from '@/components/app/reel-card';
import { dummyPosts } from '@/lib/dummy-data';
import type { Post, ReelComment } from '@/lib/types';
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
    <>
        <div className="h-screen bg-black flex justify-center items-center overflow-hidden">
            <div
              ref={containerRef}
              className="relative h-full w-full max-w-[450px] snap-y snap-mandatory overflow-y-scroll scrollbar-hide pt-14"
            >
              {reels.map((reel) => (
                <div key={reel.id} className="reel-card-container h-full w-full snap-start flex items-center justify-center">
                   <ReelCard 
                        reel={reel} 
                        onUpdateReel={handleUpdateReel} 
                        onCommentClick={() => setSelectedReelForComments(reel)}
                        isFollowing={followedUsers ? followedUsers.has(reel.user.username) : false}
                        onFollowToggle={toggleFollow}
                    />
                </div>
              ))}
            </div>
        </div>
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
    </>
  );
}
