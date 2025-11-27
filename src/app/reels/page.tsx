'use client';

import { useState, useMemo, useCallback } from 'react';
import { useUser } from '@/firebase';
import { dummyPosts } from '@/lib/dummy-data';
import type { Post, ReelComment } from '@/lib/types';
import ReelCard from '@/components/app/reel-card';
import CommentsSheet from '@/components/app/comments-sheet';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocalFeedStore } from '@/store/localFeedStore';

export default function ReelsPage() {
    const { user, followedUsers, toggleFollow } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [reels, setReels] = useState<Post[]>(() => dummyPosts.filter(p => p.type === 'reel'));
    const [activeReel, setActiveReel] = useState<Post | null>(null);

    const initialReelId = searchParams.get('reelId');

    const localItems = useLocalFeedStore(s => s.items);

    const newReels = useMemo(() => {
      if (!user) return [];
      return localItems.filter(item => item.mode === 'reel').map(item => ({
          id: item.id,
          type: 'reel',
          mediaUrl: item.mediaUrls[0],
          thumbnailUrl: item.thumbnailUrl,
          uploaderId: user.uid,
          user: { 
              id: user.uid, 
              username: user.displayName?.split(' ')[0].toLowerCase() || 'user', 
              avatarUrl: user.photoURL || '',
              fullName: user.displayName || 'User',
              bio: '',
              followersCount: 0,
              followingCount: 0,
              verified: false,
          },
          caption: item.metadata.caption,
          tags: item.metadata.tags,
          views: 0,
          likes: 0,
          commentsCount: 0,
          createdAt: new Date(item.createdAt),
          comments: [],
      } as Post));
    }, [localItems, user]);


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
        const allReels = [...newReels, ...reels];
        if (!initialReelId) return allReels;

        const initialReelIndex = allReels.findIndex(r => r.id === initialReelId);
        if (initialReelIndex === -1) return allReels;

        const initialReel = allReels[initialReelIndex];
        const remainingReels = [
            ...allReels.slice(0, initialReelIndex),
            ...allReels.slice(initialReelIndex + 1)
        ];
        return [initialReel, ...remainingReels];

    }, [reels, newReels, initialReelId]);


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
