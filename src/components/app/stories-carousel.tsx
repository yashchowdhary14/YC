
'use client';

import { useMemo } from 'react';
import Story from './story';
import { dummyUsers } from '@/lib/dummy-data';
import type { User } from '@/lib/types';

export default function StoriesCarousel() {
  const storyUsers = useMemo(() => {
    // Just use a slice of the dummy users for the story carousel
    return dummyUsers.slice(0, 8).map(u => ({...u, profilePhoto: `https://picsum.photos/seed/${u.id}/150/150`}));
  }, []);

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      <Story user={{ id: 'you', username: 'Your story', profilePhoto: '' }} isYou={true} />
      {storyUsers.map(user => (
        <Story key={user.id} user={user} />
      ))}
    </div>
  );
}
