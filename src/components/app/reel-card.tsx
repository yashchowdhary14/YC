
'use client';

import { useState, useRef, useOptimistic, useCallback, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Music, Volume2, VolumeX } from 'lucide-react';
import type { Reel } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ReelCardProps {
    reel: Reel;
    onUpdateReel: (updatedReel: Reel) => void;
    onCommentClick: () => void;
}

export default function ReelCard({ reel, onUpdateReel, onCommentClick }: ReelCardProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [showBigHeart, setShowBigHeart] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleLikeToggle = useCallback(() => {
        const newLikedState = !reel.isLiked;
        const newLikesCount = newLikedState ? reel.likes + 1 : reel.likes - 1;
        onUpdateReel({ ...reel, isLiked: newLikedState, likes: newLikesCount });
        
        if(newLikedState) {
            setShowBigHeart(true);
            setTimeout(() => setShowBigHeart(false), 800);
        }

    }, [reel, onUpdateReel]);

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.detail === 2) {
            handleLikeToggle();
        }
    };
    
    const handleToggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowing(prev => !prev);
    };

    return (
        <div className="relative h-full w-full rounded-lg overflow-hidden" onClick={handleDoubleClick}>
            <video
                ref={videoRef}
                src={reel.videoUrl}
                loop
                muted={isMuted}
                className="h-full w-full object-cover"
                playsInline
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

            {showBigHeart && (
                 <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-white/90 fill-white/90 animate-heart-pop" />
            )}
            
            <div onClick={(e) => { e.stopPropagation(); handleToggleMute(); }} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full cursor-pointer">
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
                        variant={isFollowing ? 'secondary' : 'outline'} 
                        size="sm" 
                        className="h-7 text-xs bg-transparent border-white text-white hover:bg-white/20 hover:text-white pointer-events-auto data-[following=true]:bg-white/90 data-[following=true]:text-black"
                        onClick={handleFollow}
                        data-following={isFollowing}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                </div>
                <p className="text-sm mt-2 truncate">{reel.caption}</p>
                 <div className="flex items-center gap-2 mt-2">
                    <Music className="h-4 w-4" />
                    <p className="text-sm truncate w-40">{reel.user.username} - Original audio</p>
                    <div className="ml-auto flex items-center gap-2">
                         <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-white animate-spin-slow">
                            <Music className="h-4 w-4 text-white m-auto mt-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-2 flex flex-col items-center gap-4 text-white">
                <Button variant="ghost" size="icon" className="h-auto p-0 flex-col gap-1 hover:bg-transparent" onClick={(e) => { e.stopPropagation(); handleLikeToggle(); }}>
                    <Heart className={cn("h-7 w-7", reel.isLiked && "fill-red-500 text-red-500")} />
                    <span className="text-xs font-semibold">{reel.likes.toLocaleString()}</span>
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
