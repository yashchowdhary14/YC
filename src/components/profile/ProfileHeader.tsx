'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, AtSign } from 'lucide-react';

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
    <div className="flex flex-col items-center text-center p-4">
      {/* Profile Picture */}
      <div className="relative mb-4">
        <Avatar className="h-36 w-36">
          <AvatarImage src={user.profilePhoto} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-black rounded-full p-1">
             <p className="text-xs rounded-full bg-white text-black px-2 py-1">Note...</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{user.username}</h1>
            <Settings className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-300">{user.fullName}</p>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span><span className="font-semibold text-white">{user.postsCount}</span> posts</span>
          <span><span className="font-semibold text-white">{user.followersCount}</span> followers</span>
          <span><span className="font-semibold text-white">{user.followingCount}</span> following</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
            <AtSign className="h-3 w-3" />
            <span>{user.username}</span>
        </div>
      </div>

       {/* Buttons */}
      {isCurrentUser && (
        <div className="flex w-full gap-2 mt-6">
          <Button onClick={onEditClick} variant="secondary" className="flex-1 rounded-xl bg-[#26272b] hover:bg-zinc-700 text-white font-medium">
            Edit profile
          </Button>
          <Button variant="secondary" className="flex-1 rounded-xl bg-[#26272b] hover:bg-zinc-700 text-white font-medium">
            View archive
          </Button>
        </div>
      )}
    </div>
  );
}
