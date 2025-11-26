
'use client';

import { useState, useRef, useOptimistic } from 'react';
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
}

export default function ReelCard({ reel }: ReelCardProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    const [optimisticReel, toggleOptimisticLike] = useOptimistic(
        reel,
        (state, _) => {
            if (!user) return state;
            const isLiked = state.likes.includes(user.uid);
            const newLikes = isLiked
                ? state.likes.filter(id => id !== user.uid)
                : [...state.likes, user.uid];
            return { ...state, likes: newLikes };
        }
    );

    const handleLike = () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Login Required', description: 'You must be logged in to like a reel.' });
            return;
        }
        toggleOptimisticLike(null);
    };
    
    const handleToggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };
    
    const isLiked = user ? optimisticReel.likes.includes(user.uid) : false;

    return (
        <div className="relative h-full w-full rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                src={reel.videoUrl}
                loop
                muted={isMuted}
                className="h-full w-full object-cover"
                playsInline
                onClick={handleToggleMute}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            <div onClick={handleToggleMute} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full cursor-pointer">
                {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
            </div>

            <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                <div className="flex items-center gap-3">
                     <Link href={`/${reel.user.username}`}>
                        <Avatar>
                            <AvatarImage src={reel.user.avatarUrl} />
                            <AvatarFallback>{reel.user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                     </Link>
                     <Link href={`/${reel.user.username}`} className="font-semibold text-sm">{reel.user.username}</Link>
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent border-white text-white hover:bg-white/20 hover:text-white">Follow</Button>
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
                <Button variant="ghost" size="icon" className="h-auto p-0 flex-col gap-1 hover:bg-transparent" onClick={handleLike}>
                    <Heart className={cn("h-7 w-7", isLiked && "fill-red-500 text-red-500")} />
                    <span className="text-xs font-semibold">{optimisticReel.likes.length.toLocaleString()}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-auto p-0 flex-col gap-1 hover:bg-transparent">
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

// Add to tailwind.config.ts if not present
// extend: {
//   animation: {
//     'spin-slow': 'spin 3s linear infinite',
//   },
// },
