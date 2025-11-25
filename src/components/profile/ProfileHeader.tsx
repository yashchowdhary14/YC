'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface ProfileHeaderProps {
  user: {
    username: string;
    fullName: string;
    bio: string;
    profilePhoto: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  onEditClick: () => void;
  isCurrentUser?: boolean;
}

export default function ProfileHeader({ user, onEditClick, isCurrentUser = true }: ProfileHeaderProps) {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-6 p-4 md:flex-row md:items-start md:gap-16">
      {/* Profile Picture */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-36 w-36 md:h-40 md:w-40 border-4 border-background ring-2 ring-zinc-800">
          <AvatarImage src={user.profilePhoto} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col gap-4 w-full text-center md:text-left">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <h1 className="text-xl font-light text-zinc-300">{user.username}</h1>
           {isCurrentUser && (
            <div className="flex items-center gap-2">
                 <Button onClick={onEditClick} variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700">
                    Edit profile
                </Button>
                <Button variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700">
                    View archive
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-5 w-5 text-zinc-300" />
                </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-8 text-sm justify-center md:justify-start">
          <span><span className="font-semibold text-white">{user.postsCount}</span> posts</span>
          <span><span className="font-semibold text-white">{user.followersCount}</span> followers</span>
          <span><span className="font-semibold text-white">{user.followingCount}</span> following</span>
        </div>
        
        <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">{user.fullName}</p>
            <p className="text-sm whitespace-pre-line text-zinc-300">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}
