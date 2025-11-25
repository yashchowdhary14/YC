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
    const renderBio = (bio: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = bio.split(urlRegex);
        return parts.map((part, index) => 
            urlRegex.test(part) 
            ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{part}</a> 
            : part
        );
    };

  return (
    <header className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start w-full">
        {/* Profile Picture */}
        <div className="shrink-0">
            <Avatar className="h-24 w-24 md:h-36 md:w-36">
                <AvatarImage src={user.profilePhoto} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
        
        {/* Profile Info */}
        <div className="flex flex-col gap-4 w-full text-center md:text-left">
            {/* Username and Actions */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-xl font-light text-foreground">{user.username}</h1>
                 {isCurrentUser ? (
                    <div className="flex items-center gap-2">
                         <Button onClick={onEditClick} variant="secondary" size="sm" className="bg-secondary hover:bg-zinc-700 text-white font-medium">
                            Edit profile
                        </Button>
                        <Button variant="secondary" size="sm" className="bg-secondary hover:bg-zinc-700 text-white font-medium">
                            View archive
                        </Button>
                         <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5 text-gray-400" />
                        </Button>
                    </div>
                 ) : (
                    <div className="flex items-center gap-2">
                        <Button size="sm">Follow</Button>
                        <Button size="sm" variant="secondary">Message</Button>
                    </div>
                 )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-foreground">
                <span><span className="font-semibold">{user.postsCount}</span> posts</span>
                <span><span className="font-semibold">{user.followersCount}</span> followers</span>
                <span><span className="font-semibold">{user.followingCount}</span> following</span>
            </div>

            {/* Bio */}
            <div className="text-sm">
                <p className="font-semibold">{user.fullName}</p>
                <p className="whitespace-pre-wrap">{renderBio(user.bio)}</p>
            </div>
        </div>
    </header>
  );
}
