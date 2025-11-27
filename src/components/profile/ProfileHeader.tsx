'use client';

import Image from 'next/image';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Settings, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCompactNumber } from '@/lib/utils';
import Story from '../app/story';
import { useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';

interface ProfileHeaderProps {
  user: User;
  postsCount: number;
}

const StoryHighlight = ({ id, label }: { id: string; label: string }) => (
  <div className="flex flex-col items-center space-y-1">
    <div className="relative">
      <Avatar className="w-16 h-16 border-2 border-muted p-0.5">
        <AvatarImage src={`https://picsum.photos/seed/${id}/150/150`} alt={label} />
        <AvatarFallback>{label?.[0]}</AvatarFallback>
      </Avatar>
    </div>
    <p className="text-xs text-center">{label}</p>
  </div>
);

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


export default function ProfileHeader({ user: profileUser, postsCount }: ProfileHeaderProps) {
    const { user: currentUser, isUserLoading, followedUsers, toggleFollow } = useUser();
    
    if (isUserLoading || !profileUser) {
      return <ProfileHeaderSkeleton />;
    }

    const isMyProfile = currentUser?.uid === profileUser.id;
    const isFollowing = followedUsers.has(profileUser.username);

    const storyHighlights = [
        { id: 'trip1', label: 'LA Trip' },
        { id: 'foodie', label: 'Eats' },
        { id: 'devcon', label: 'DevCon' },
        { id: 'pets', label: 'My Pet' },
    ];

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
                        <div className="flex items-center gap-2">
                            {isMyProfile ? (
                                <>
                                    <Button variant="secondary" size="sm">Edit profile</Button>
                                    <Button variant="secondary" size="sm">View archive</Button>
                                    <Button variant="ghost" size="icon"><Settings className="h-5 w-5"/></Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => toggleFollow(profileUser.username)} size="sm" variant={isFollowing ? 'secondary' : 'default'}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                    <Button variant="secondary" size="sm">Message</Button>
                                     <Button variant="secondary" size="icon" className="h-9 w-9">
                                        <UserPlus className="h-4 w-4"/>
                                    </Button>
                                </>
                            )}
                        </div>
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

            {/* Story Highlights */}
            <div className="mt-8">
                <div className="flex space-x-4 overflow-x-auto">
                    {storyHighlights.map(highlight => (
                        <StoryHighlight key={highlight.id} id={highlight.id} label={highlight.label} />
                    ))}
                </div>
            </div>
        </header>
    )
}
