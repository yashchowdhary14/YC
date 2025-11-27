
'use client';

import { useState, useRef, useOptimistic, useCallback, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Music, Volume2, VolumeX } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ReelCardProps {
    reel: Post;
    onUpdateReel: (updatedReel: Post) => void;
    onCommentClick: () => void;
    isFollowing: boolean;
    onFollowToggle: (username: string) => void;
}

export default function ReelCard({ reel, onUpdateReel, onCommentClick, isFollowing, onFollowToggle }: ReelCardProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [showBigHeart, setShowBigHeart] = useState(false);
    
    // Manage like state locally within the card
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(reel.likes);

    const handleLikeToggle = useCallback(() => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Please log in to like reels.' });
            return;
        }
        const newLikedState = !isLiked;
        const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;
        
        setIsLiked(newLikedState);
        setLikesCount(newLikesCount);
        
        if(newLikedState) {
            setShowBigHeart(true);
            setTimeout(() => setShowBigHeart(false), 800);
        }

    }, [isLiked, likesCount, user, toast]);

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // Ensure the double-click is on the video container itself, not on buttons overlaying it
        if ((e.target as HTMLElement).closest('button, a')) return;
        handleLikeToggle();
    };
    
    const handleToggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            const newMutedState = !videoRef.current.muted;
            videoRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
        }
    };

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            toast({ variant: 'destructive', title: 'Please log in to follow users.' });
            return;
        }
        onFollowToggle(reel.user.username);
    };

    return (
        <div className="relative h-full w-full bg-background rounded-lg" onDoubleClick={handleDoubleClick}>
            <video
                ref={videoRef}
                src={reel.mediaUrl}
                loop
                autoPlay
                muted={isMuted}
                className="h-full w-full object-contain"
                playsInline
                onClick={handleToggleMute}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

            {showBigHeart && (
                 <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-destructive/90 fill-destructive/90 animate-heart-pop pointer-events-none" />
            )}
            
            <div onClick={handleToggleMute} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full cursor-pointer">
                {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
            </div>

            <div className="absolute bottom-0 left-0 p-4 text-white w-full pointer-events-none">
                <div className="flex items-center gap-3">
                     <Link href={`/${reel.user.username}`} className="pointer-events-auto">
                        <Avatar>
                            <AvatarImage src={reel.user.avatarUrl} />
                            <AvatarFallback>{reel.user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                     </Link>
                     <Link href={`/${reel.user.username}`} className="font-semibold text-sm pointer-events-auto">{reel.user.username}</Link>
                    <Button 
                        variant={isFollowing ? 'secondary' : 'default'} 
                        size="sm" 
                        className={cn(
                            "h-7 text-xs px-3 py-1 rounded-md pointer-events-auto font-semibold",
                            isFollowing && "bg-secondary/80 text-secondary-foreground"
                        )}
                        onClick={handleFollow}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                </div>
                <p className="text-sm mt-2 truncate">{reel.caption}</p>
                 <div className="flex items-center gap-2 mt-2">
                    <Music className="h-4 w-4" />
                    <p className="text-sm truncate w-40">{reel.user.username} - Original audio</p>
                    <div className="ml-auto flex items-center gap-2">
                         <div className="w-6 h-6 bg-muted/50 rounded-full border-2 border-white animate-spin-slow">
                            <Music className="h-4 w-4 text-white m-auto mt-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-2 flex flex-col items-center gap-4 text-white">
                <Button variant="ghost" size="icon" className="h-auto p-0 flex-col gap-1 hover:bg-transparent" onClick={(e) => { e.stopPropagation(); handleLikeToggle(); }}>
                    <Heart className={cn("h-7 w-7", isLiked && "fill-destructive text-destructive")} />
                    <span className="text-xs font-semibold">{likesCount.toLocaleString()}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-auto p-0 flex-col gap-1 hover:bg-transparent" onClick={(e) => { e.stopPropagation(); onCommentClick(); }}>
                    <MessageCircle className="h-7 w-7" />
                    <span className="text-xs font-semibold">{reel.commentsCount.toLocaleString()}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-auto p-0 flex-col gap-1 hover:bg-transparent">
                    <Send className="h-7 w-7" />
                </Button>
                <Button variant="ghost" size="icon" className="h-auto p-0 flex-col gap-1 hover:bg-transparent">
                    <MoreHorizontal className="h-7 w-7" />
                </Button>
                 <div className="h-10 w-10 rounded-md border-2 border-white overflow-hidden mt-2">
                    <Music className="h-full w-full text-white p-1" />
                </div>
            </div>
        </div>
    );
}
