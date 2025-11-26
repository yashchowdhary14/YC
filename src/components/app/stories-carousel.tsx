'use client';

import { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import Story from './story';

export default function StoriesCarousel() {
  const firestore = useFirestore();
  const { data: stories, isLoading } = useCollection(collection(firestore, 'stories'));

  const storyUsers = useMemo(() => {
    if (isLoading || !stories) return [];
    // simple mock of story users
    return stories.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 5);
  }, [stories, isLoading]);

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      <Story user={{ id: 'you', username: 'Your story', profilePhoto: '' }} isYou={true} />
      {storyUsers.map(user => (
        <Story key={user.id} user={user} />
      ))}
    </div>
  );
}
