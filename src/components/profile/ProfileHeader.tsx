
'use client';

import Image from 'next/image';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Settings, UserPlus, Share2, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCompactNumber } from '@/lib/utils';
import Story from '../app/story';
import { useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
    user: User | null;
    postsCount: number;
    onSettingsClick: () => void;
}

const ProfileHeaderSkeleton = () => (
    <header>
        <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
                <Skeleton className="w-24 h-24 sm:w-36 sm:h-36 rounded-full" />
            </div>
            <div className="flex-grow space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <Skeleton className="h-8 w-40" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-8">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="text-sm space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    </header>
);


export default function ProfileHeader({ user: profileUser, postsCount, onSettingsClick }: ProfileHeaderProps) {
    const { user: currentUser, isUserLoading, followedUsers, toggleFollow } = useUser();

    if (isUserLoading || !profileUser) {
        return <ProfileHeaderSkeleton />;
    }

    const isMyProfile = currentUser?.uid === profileUser.id;

    return (
        <header className="mb-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                {/* Avatar Section */}
                <div className="flex-shrink-0 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <Avatar className="w-24 h-24 md:w-40 md:h-40 border-4 border-background relative">
                        <AvatarImage src={profileUser.avatarUrl} className="object-cover" />
                        <AvatarFallback className="text-4xl">{profileUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Info Section */}
                <div className="flex-grow space-y-6 text-center md:text-left w-full">
                    {/* Top Row: Username & Actions */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-xl md:text-2xl font-light tracking-wide">{profileUser.username}</h1>

                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {isMyProfile ? (
                                <>
                                    <Link href="/account/edit">
                                        <Button variant="secondary" className="h-8 px-4 font-semibold text-sm">Edit profile</Button>
                                    </Link>
                                    <Button variant="secondary" className="h-8 px-4 font-semibold text-sm">View archive</Button>
                                    <Button variant="ghost" size="icon" onClick={onSettingsClick} className="h-8 w-8">
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => toggleFollow(profileUser)}
                                        variant={followedUsers.has(profileUser.id) ? 'secondary' : 'default'}
                                        className={cn(
                                            "h-8 px-6 font-semibold text-sm transition-all",
                                            !followedUsers.has(profileUser.id) && "bg-primary hover:bg-primary/90"
                                        )}
                                    >
                                        {followedUsers.has(profileUser.id) ? 'Following' : 'Follow'}
                                    </Button>
                                    <Button variant="secondary" className="h-8 px-4 font-semibold text-sm">Message</Button>
                                    <Button variant="secondary" size="icon" className="h-8 w-8">
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Row (Desktop) */}
                    <div className="hidden md:flex items-center gap-10 text-base">
                        <div className="flex gap-1">
                            <span className="font-bold">{postsCount}</span>
                            <span className="text-muted-foreground">posts</span>
                        </div>
                        <div className="flex gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                            <span className="font-bold">{formatCompactNumber(profileUser.followersCount)}</span>
                            <span className="text-muted-foreground">followers</span>
                        </div>
                        <div className="flex gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                            <span className="font-bold">{formatCompactNumber(profileUser.followingCount)}</span>
                            <span className="text-muted-foreground">following</span>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="text-sm md:text-base max-w-md mx-auto md:mx-0">
                        <h2 className="font-bold mb-1">{profileUser.fullName}</h2>
                        <p className="whitespace-pre-wrap leading-relaxed">{profileUser.bio || "No bio yet."}</p>
                        {/* Mock Link - In real app, parse from bio */}
                        {profileUser.bio?.includes('http') && (
                            <a href="#" className="text-blue-400 hover:underline block mt-1 font-medium">
                                {profileUser.bio.match(/https?:\/\/[^\s]+/)?.[0]}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Stats Row */}
            <div className="flex md:hidden justify-around py-4 border-t border-b mt-6 bg-muted/20">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-sm">{postsCount}</span>
                    <span className="text-xs text-muted-foreground">posts</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-sm">{formatCompactNumber(profileUser.followersCount)}</span>
                    <span className="text-xs text-muted-foreground">followers</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-sm">{formatCompactNumber(profileUser.followingCount)}</span>
                    <span className="text-xs text-muted-foreground">following</span>
                </div>
            </div>
        </header>
    )
}
