
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import Link from 'next/link';

// Mock data for stories
const stories = Array.from({ length: 15 }, (_, i) => ({
  id: `story-${i}`,
  user: {
    id: `user-${i + 2}`,
    username: `user_${i + 2}`,
    avatarUrl: `https://picsum.photos/seed/user${i + 2}/100/100`,
  },
}));

export default function StoriesCarousel() {
  const { user } = useUser();

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {/* Current User's Story */}
          {user && (
             <CarouselItem className="basis-auto pl-4">
              <Link href="/stories/create" className="flex flex-col items-center gap-2">
                 <div className="p-0.5 rounded-full relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt={user.displayName || 'Your Story'} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                   <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center border-2 border-background">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Your story</span>
              </Link>
            </CarouselItem>
          )}


          {/* Following Users' Stories */}
          {stories.map((story) => (
            <CarouselItem key={story.id} className="basis-auto pl-4">
              <Link href={`/stories/${story.user.username}`} className="flex flex-col items-center gap-2">
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                  <div className="p-0.5 bg-background rounded-full">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={story.user.avatarUrl} alt={story.user.username} />
                      <AvatarFallback>{story.user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs font-medium truncate w-16 text-center">{story.user.username}</span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
