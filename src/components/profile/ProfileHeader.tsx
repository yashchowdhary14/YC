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
  };
  onEditClick: () => void;
  isCurrentUser?: boolean;
}

export default function ProfileHeader({ user, onEditClick, isCurrentUser = true }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const renderBio = (bio: string) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const hashtagRegex = /#(\w+)/g;

    const parts = bio.split(new RegExp(`(${linkRegex.source}|${hashtagRegex.source})`, 'g'));

    return parts.map((part, index) => {
      if (part.match(linkRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {part}
          </a>
        );
      }
      if (part.match(hashtagRegex)) {
        return (
          <span key={index} className="text-primary hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer">
            <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-background ring-2 ring-primary/50">
              <AvatarImage src={user.profilePhoto} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 max-w-md w-full aspect-square">
            <Image src={user.profilePhoto} alt={user.username} layout="fill" objectFit="cover" className="rounded-md"/>
        </DialogContent>
      </Dialog>


      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <h2 className="text-2xl font-light text-foreground">{user.username}</h2>
          <div className="flex items-center gap-2">
            {isCurrentUser ? (
              <>
                <Button variant="secondary" onClick={onEditClick}>Edit Profile</Button>
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

        <div className="hidden sm:block mb-4">
            {/* This is visible only on larger screens, stats row handles mobile */}
            <div className="flex gap-8">
                <div><span className="font-semibold">12</span> posts</div>
                <div><span className="font-semibold">1,234</span> followers</div>
                <div><span className="font-semibold">123</span> following</div>
            </div>
        </div>

        <div>
          <h1 className="font-semibold">{user.fullName}</h1>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{renderBio(user.bio)}</p>
        </div>
      </div>
    </div>
  );
}
