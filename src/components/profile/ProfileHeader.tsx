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
    <div className="flex flex-col gap-8">
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

        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-light">{user.username}</h2>
            {isCurrentUser && (
                <Button variant="ghost" size="icon">
                  <Settings className="h-6 w-6" />
                  <span className="sr-only">Settings</span>
                </Button>
            )}
          </div>
          
          <p className="font-semibold">{user.fullName}</p>
          
          <div className="flex items-center gap-6 text-sm">
              <p><span className="font-semibold">{user.postsCount.toLocaleString()}</span> posts</p>
              <p><span className="font-semibold">{user.followersCount.toLocaleString()}</span> followers</p>
              <p><span className="font-semibold">{user.followingCount.toLocaleString()}</span> following</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <Link href={`/${user.username}`} className="font-medium text-blue-400 hover:underline">{user.username}</Link>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
       {isCurrentUser ? (
        <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={onEditClick} className="font-semibold">Edit profile</Button>
            <Button variant="secondary" className="font-semibold">View archive</Button>
        </div>
        ) : (
            <Button onClick={() => setIsFollowing(!isFollowing)} className="w-full">
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
  );
}
