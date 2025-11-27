
'use client';

import { useState, useMemo, useCallback }from 'react';
import { useUser } from '@/firebase';
import { dummyPosts } from '@/lib/dummy-data';
import type { Post, ReelComment } from '@/lib/types';
import ReelCard from '@/components/app/reel-card';
import CommentsSheet from '@/components/app/comments-sheet';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ReelsPage() {
    const { user, followedUsers, toggleFollow } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [reels, setReels] = useState<Post[]>(() => dummyPosts.filter(p => p.type === 'reel'));
    const [activeReel, setActiveReel] = useState<Post | null>(null);

    const initialReelId = searchParams.get('reelId');

    const handleUpdateReel = useCallback((updatedReel: Post) => {
        setReels(prevReels => prevReels.map(r => r.id === updatedReel.id ? updatedReel : r));
    }, []);

    const handleUpdateComment = useCallback((reelId: string, updatedComments: ReelComment[]) => {
        setReels(prevReels => prevReels.map(r => {
            if (r.id === reelId) {
                return { ...r, comments: updatedComments, commentsCount: updatedComments.length };
            }
            return r;
        }));
    }, []);
    
    // Sort reels to show the initial one first, if provided
    const sortedReels = useMemo(() => {
        if (!initialReelId) return reels;
        const initialReel = reels.find(r => r.id === initialReelId);
        if (!initialReel) return reels;
        return [
            initialReel,
            ...reels.filter(r => r.id !== initialReelId)
        ];
    }, [reels, initialReelId]);


  return (
    <div className="h-screen bg-black snap-y snap-mandatory overflow-y-scroll overflow-x-hidden md:ml-20 lg:ml-72">
      {sortedReels.map((reel) => (
        <div key={reel.id} className="h-full w-full snap-center flex items-center justify-center relative">
            <ReelCard 
                reel={reel} 
                onUpdateReel={handleUpdateReel}
                onCommentClick={() => setActiveReel(reel)}
                isFollowing={followedUsers.has(reel.user.id)}
                onFollowToggle={() => toggleFollow(reel.user)}
            />
        </div>
      ))}
      <CommentsSheet
        reel={activeReel}
        onOpenChange={(isOpen) => !isOpen && setActiveReel(null)}
        onUpdateComment={handleUpdateComment}
        currentUser={user}
      />
    </div>
  );
}
