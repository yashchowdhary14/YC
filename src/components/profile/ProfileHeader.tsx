
'use client';

import { useState, useOptimistic } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { dummyFollows } from '@/lib/dummy-data';

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    profilePhoto: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    verified: boolean;
  };
  onEditClick: () => void;
  onMessageClick?: () => void;
  isNavigatingToChat?: boolean;
  isCurrentUser?: boolean;
}

export default function ProfileHeader({
  user,
  onEditClick,
  onMessageClick,
  isNavigatingToChat = false,
  isCurrentUser = false
}: ProfileHeaderProps) {
  const { user: currentUser } = useUser();
  const { toast } = useToast();

  const isInitiallyFollowing = currentUser ? (dummyFollows[currentUser.uid] || []).includes(user.id) : false;

  const [optimisticState, toggleOptimistic] = useOptimistic(
    { following: isInitiallyFollowing, followersCount: user.followersCount },
    (state) => ({
      following: !state.following,
      followersCount: state.following ? state.followersCount - 1 : state.followersCount + 1,
    })
  );

  const handleFollowToggle = () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "You must be logged in to follow users." });
      return;
    }
    toggleOptimistic(null);
    // In a real app, this would call a server action.
    // For dummy data, the optimistic update is sufficient.
  };

  const renderBio = (bio: string) => {
    if (!bio) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = bio.split(urlRegex);
    return parts.map((part, index) =>
      urlRegex.test(part)
        ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{part}</a>
        : part
    );
  };

  return (
    <header className="flex gap-8 md:gap-16 items-start w-full">
      <div className="flex-shrink-0 w-24 h-24 md:w-36 md:h-36">
        <Avatar className="h-full w-full">
          <AvatarImage src={user.profilePhoto} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-normal text-foreground">{user.username}</h1>
            {user.verified && <CheckCircle className="h-5 w-5 text-blue-500 fill-current" />}
          </div>
          {isCurrentUser ? (
            <div className="flex items-center gap-2">
              <Button onClick={onEditClick} variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm">
                Edit profile
              </Button>
              <Button variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm">
                View archive
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant={optimisticState.following ? 'secondary' : 'default'} onClick={handleFollowToggle}>
                {optimisticState.following ? 'Following' : 'Follow'}
              </Button>
              <Button size="sm" variant="secondary" onClick={onMessageClick} disabled={isNavigatingToChat}>
                {isNavigatingToChat && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Message
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-base text-foreground">
          <span><span className="font-semibold">{user.postsCount}</span> posts</span>
          <span><span className="font-semibold">{optimisticState.followersCount.toLocaleString()}</span> followers</span>
          <span><span className="font-semibold">{user.followingCount.toLocaleString()}</span> following</span>
        </div>

        <div className="text-sm">
          <p className="font-semibold">{user.fullName}</p>
          <p className="whitespace-pre-wrap">{renderBio(user.bio)}</p>
        </div>
      </div>
    </header>
  );
}
