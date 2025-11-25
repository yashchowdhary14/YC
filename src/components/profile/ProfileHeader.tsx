'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, UserPlus, Check, Link as LinkIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
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
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-16">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group">
              <Avatar className="w-36 h-36 md:w-40 md:h-40 border-4 border-transparent">
                <AvatarImage src={user.profilePhoto} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-md w-full aspect-square bg-transparent border-0">
              <Image src={user.profilePhoto} alt={user.username} layout="fill" objectFit="cover" className="rounded-md"/>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Info & Actions */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        {/* Username & Settings */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-light text-gray-400">{user.username}</h2>
          {isCurrentUser ? (
            <>
              <Button variant="secondary" onClick={onEditClick} className="flex-1 font-semibold max-w-xs">Edit profile</Button>
              <Button variant="secondary" className="flex-1 font-semibold max-w-xs">View archive</Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-6 w-6" />
                <span className="sr-only">Settings</span>
              </Button>
            </>
           ) : (
             <Button onClick={() => setIsFollowing(!isFollowing)} className="flex-1">
              {isFollowing ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Follow
                </>
              )}
            </Button>
           )}
        </div>

        {/* User Details (Name, Stats, Bio) */}
        <div className="flex items-center gap-6 text-sm">
            <button><span className="font-semibold">{user.postsCount.toLocaleString()}</span> posts</button>
            <button><span className="font-semibold">{user.followersCount.toLocaleString()}</span> followers</button>
            <button><span className="font-semibold">{user.followingCount.toLocaleString()}</span> following</button>
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-sm text-gray-400 whitespace-pre-line">{user.bio}</p>
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <Link href={`/${user.username}`} className="font-medium text-blue-400 hover:underline">{user.username}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
