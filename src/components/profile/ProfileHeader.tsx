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

    const isMyProfile = currentUser?.uid === profileUser.id || currentUser?.email?.split('@')[0] === profileUser.username;

    return (
        <header>
            <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <Avatar className="w-24 h-24 sm:w-36 sm:h-36 text-6xl border-2">
                        <AvatarImage src={profileUser.avatarUrl} />
                        <AvatarFallback>{profileUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <h1 className="text-2xl font-light">{profileUser.username}</h1>
                        <div className="flex items-center gap-2 flex-1">
                            {isMyProfile ? (
                                <>
                                    <Link href="/account/edit" className="flex-1 md:flex-none">
                                        <Button variant="secondary" size="sm" className="w-full">Edit profile</Button>
                                    </Link>
                                    <Button variant="secondary" size="sm" className="flex-1 md:flex-none">View archive</Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => toggleFollow(profileUser)} size="sm" variant={followedUsers.has(profileUser.id) ? 'secondary' : 'default'} className="flex-1">
                                        {followedUsers.has(profileUser.id) ? 'Following' : 'Follow'}
                                    </Button>
                                    <Button variant="secondary" size="sm" className="flex-1">Message</Button>
                                     <Button variant="secondary" size="icon" className="h-9 w-9 hidden sm:flex">
                                        <Share2 className="h-4 w-4"/>
                                    </Button>
                                </>
                            )}
                        </div>
                         {isMyProfile && (
                            <Button variant="ghost" size="icon" onClick={onSettingsClick} className="order-first sm:order-last">
                                <Menu className="h-6 w-6"/>
                            </Button>
                         )}
                    </div>

                    <div className="hidden sm:flex items-center gap-8">
                        <div><span className="font-semibold">{postsCount}</span> posts</div>
                        <div><span className="font-semibold">{formatCompactNumber(profileUser.followersCount)}</span> followers</div>
                        <div><span className="font-semibold">{formatCompactNumber(profileUser.followingCount)}</span> following</div>
                    </div>
                    
                    <div className="text-sm">
                        <h2 className="font-semibold">{profileUser.fullName}</h2>
                        <p className="text-muted-foreground whitespace-pre-wrap">{profileUser.bio}</p>
                    </div>
                </div>
            </div>
            
            {/* Mobile Stats */}
            <div className="sm:hidden border-t mt-4 pt-2 flex justify-around text-center">
                 <div>
                    <div className="font-semibold">{postsCount}</div>
                    <div className="text-sm text-muted-foreground">posts</div>
                 </div>
                 <div>
                    <div className="font-semibold">{formatCompactNumber(profileUser.followersCount)}</div>
                     <div className="text-sm text-muted-foreground">followers</div>
                 </div>
                 <div>
                    <div className="font-semibold">{formatCompactNumber(profileUser.followingCount)}</div>
                     <div className="text-sm text-muted-foreground">following</div>
                 </div>
            </div>
        </header>
    )
}
