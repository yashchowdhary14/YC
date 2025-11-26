
'use client';

import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { formatCompactNumber } from '@/lib/utils';
import { useOptimistic } from 'react';

type ProfileUser = User & {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
  profilePhoto?: string;
};

interface ProfileHeaderProps {
  user: ProfileUser;
  onFollowToggle: () => void;
  onMessageClick: () => void;
}

const highlights = [
    { id: '1', label: 'Travel', image: 'https://picsum.photos/seed/h1/150/150' },
    { id: '2', label: 'Food', image: 'https://picsum.photos/seed/h2/150/150' },
    { id: '3', label: 'Projects', image: 'https://picsum.photos/seed/h3/150/150' },
    { id: '4', label: 'Friends', image: 'https://picsum.photos/seed/h4/150/150' },
    { id: '5', label: '2024', image: 'https://picsum.photos/seed/h5/150/150' },
]

export default function ProfileHeader({ user, onFollowToggle, onMessageClick }: ProfileHeaderProps) {
  const [optimisticFollow, toggleOptimisticFollow] = useOptimistic(
    { isFollowing: user.isFollowing, followersCount: user.followersCount },
    (state, _) => {
      const newFollowingState = !state.isFollowing;
      return {
        isFollowing: newFollowingState,
        followersCount: newFollowingState ? state.followersCount + 1 : state.followersCount - 1,
      };
    }
  );

  const handleFollow = () => {
    toggleOptimisticFollow(null);
    onFollowToggle();
  };
  
  return (
    <div className="flex flex-col p-4">
      {/* Top section: Avatar and Stats */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-1/4">
           <Avatar className="h-20 w-20 md:h-36 md:w-36 border-2 border-muted">
             <AvatarImage src={user.profilePhoto} alt={user.username} />
             <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
           </Avatar>
        </div>
        <div className="flex-1 flex justify-around text-center">
          <div>
            <p className="font-bold text-lg">{user.postsCount}</p>
            <p className="text-sm text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="font-bold text-lg">{formatCompactNumber(optimisticFollow.followersCount)}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-bold text-lg">{formatCompactNumber(user.followingCount)}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-4">
        <p className="font-bold">{user.fullName}</p>
        <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
        <a href="#" className="text-sm text-blue-400 font-semibold">linkin.bio/{user.username}</a>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {user.isCurrentUser ? (
          <>
            <Button variant="secondary" className="flex-1 rounded-lg">Edit Profile</Button>
            <Button variant="secondary" className="flex-1 rounded-lg">Share Profile</Button>
          </>
        ) : (
          <>
            <Button 
                variant={optimisticFollow.isFollowing ? 'secondary' : 'default'} 
                className="flex-1 rounded-lg"
                onClick={handleFollow}
            >
              {optimisticFollow.isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button variant="secondary" className="flex-1 rounded-lg" onClick={onMessageClick}>Message</Button>
          </>
        )}
      </div>

      {/* Story Highlights */}
      <div className="mt-6">
        <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2">
                 {highlights.map((highlight) => (
                    <CarouselItem key={highlight.id} className="basis-auto pl-4">
                         <div className="flex flex-col items-center gap-2">
                             <div className="p-0.5 rounded-full bg-muted">
                                 <Avatar className="w-16 h-16 border-2 border-background">
                                     <AvatarImage src={highlight.image} />
                                     <AvatarFallback />
                                 </Avatar>
                             </div>
                             <span className="text-xs font-medium truncate w-16 text-center">{highlight.label}</span>
                         </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
