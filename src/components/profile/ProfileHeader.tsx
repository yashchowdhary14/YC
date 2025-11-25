'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    profilePhoto: string;
  };
  onEditProfile: () => void;
}

export default function ProfileHeader({ user, onEditProfile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 sm:gap-8 md:gap-16">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 shrink-0 cursor-pointer">
            <Avatar className="w-full h-full">
              <AvatarImage src={user.profilePhoto} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 border-0 max-w-md">
            <Image 
                src={user.profilePhoto}
                alt={`${user.username}'s profile photo`}
                width={500}
                height={500}
                className="rounded-md object-cover"
            />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="text-2xl font-light">{user.username}</h2>
          <Button variant="outline" size="sm" onClick={onEditProfile}>
            Edit Profile
          </Button>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold">{user.fullName}</h1>
          <p className="text-muted-foreground">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}
