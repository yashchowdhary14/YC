
'use client';

import { HighlightBubble } from './HighlightBubble';
import { Skeleton } from '../ui/skeleton';
import { useUser, useCollection, useMemoFirebase } from '@/firebase';
<<<<<<< HEAD
import { collection, query, orderBy, limit } from 'firebase/firestore';
=======
import { collection, query, orderBy } from 'firebase/firestore';
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
import type { User, Highlight } from '@/lib/types';
import { useFirestore } from '@/firebase';

interface StoryHighlightsProps {
  profileUser: User;
}

export default function StoryHighlights({ profileUser }: StoryHighlightsProps) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const isMyProfile = currentUser?.uid === profileUser.id;

  const highlightsQuery = useMemoFirebase(() => {
    if (!profileUser) return null;
    // Query the subcollection path: users/{userId}/highlights
    return query(
<<<<<<< HEAD
      collection(firestore, 'users', profileUser.id, 'highlights'),
      orderBy('createdAt', 'desc'),
      limit(20)
=======
        collection(firestore, 'users', profileUser.id, 'highlights'),
        orderBy('createdAt', 'desc')
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    );
  }, [firestore, profileUser]);

  const { data: highlights, isLoading } = useCollection<Highlight>(highlightsQuery);

  if (isLoading) {
    return (
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
    );
  }

  const hasHighlights = highlights && highlights.length > 0;

  if (!isMyProfile && !hasHighlights) {
    return null; // Don't show anything if it's not our profile and there are no highlights
  }

  return (
    <div className="mt-8">
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
        {isMyProfile && (
          <HighlightBubble
            isNew={true}
            label="New"
            onClick={() => {
              // TODO: Open "Create Highlight" modal in the next step
              console.log('Open create highlight modal');
            }}
          />
        )}
        {highlights?.map(highlight => (
          <HighlightBubble
            key={highlight.id}
            coverUrl={highlight.coverImage}
            label={highlight.title}
            onClick={() => {
              // TODO: Open "View Highlight" modal in the next step
              console.log('View highlight:', highlight.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

<<<<<<< HEAD
=======
    
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
