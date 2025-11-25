'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, UserPlus, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

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
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 md:gap-24">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group shrink-0">
             <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-transparent">
              <AvatarImage src={user.profilePhoto} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 max-w-md w-full aspect-square bg-transparent border-0">
            <Image src={user.profilePhoto} alt={user.username} layout="fill" objectFit="cover" className="rounded-md"/>
        </DialogContent>
      </Dialog>


      <div className="flex-1 text-center sm:text-left space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <h2 className="text-xl font-light text-foreground">{user.username}</h2>
          <div className="flex items-center gap-2">
            {isCurrentUser ? (
              <>
                <Button variant="secondary" onClick={onEditClick} className="font-semibold">Edit profile</Button>
                <Button variant="secondary" className="font-semibold">View archive</Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </>
            ) : (
               <Button onClick={() => setIsFollowing(!isFollowing)}>
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
        </div>

        <div className="flex justify-center sm:justify-start gap-8">
            <button className="text-sm"><span className="font-semibold">{user.postsCount.toLocaleString()}</span> posts</button>
            <button className="text-sm"><span className="font-semibold">{user.followersCount.toLocaleString()}</span> followers</button>
            <button className="text-sm"><span className="font-semibold">{user.followingCount.toLocaleString()}</span> following</button>
        </div>

        <div>
          <h1 className="font-semibold">{user.fullName}</h1>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}
