'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, AtSign } from 'lucide-react';
import Link from 'next/link';

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
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      {/* Profile Picture */}
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-black ring-2 ring-zinc-700">
          <AvatarImage src={user.profilePhoto} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="absolute -top-1 -right-2 rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium">
          Note...
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          {isCurrentUser && (
            <Settings className="h-5 w-5 text-zinc-400" />
          )}
        </div>
        
        <p className="font-medium text-zinc-300">{user.fullName}</p>
        
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span><span className="font-semibold text-white">{user.postsCount}</span> posts</span>
          <span><span className="font-semibold text-white">{user.followersCount}</span> followers</span>
          <span><span className="font-semibold text-white">{user.followingCount}</span> following</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm">
          <AtSign className="h-4 w-4 text-zinc-500" />
          <Link href={`/${user.username}`} className="font-medium text-blue-400 hover:underline">
            {user.username}
          </Link>
        </div>
      </div>
      
      {/* Action Buttons */}
      {isCurrentUser && (
        <div className="grid w-full grid-cols-2 gap-3">
          <Button onClick={onEditClick} className="rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 font-medium h-10">
            Edit profile
          </Button>
          <Button className="rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 font-medium h-10">
            View archive
          </Button>
        </div>
      )}
    </div>
  );
}
