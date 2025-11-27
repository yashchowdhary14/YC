'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersection } from '@/hooks/use-intersection';
import { cn } from '@/lib/utils';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LazyMediaProps {
    src: string;
    alt: string;
    type: 'photo' | 'video' | 'reel';
    className?: string;
    aspectRatio?: string; // e.g., "aspect-square"
}

export function LazyMedia({ src, alt, type, className, aspectRatio = "aspect-square" }: LazyMediaProps) {
    const ref = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isIntersecting = useIntersection(ref, { rootMargin: '200px', threshold: 0.5 }); // Load 200px before view
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        if (isIntersecting) {
            setHasBeenVisible(true);
        }
    }, [isIntersecting]);

    // Auto-play/pause based on visibility
    useEffect(() => {
        if (type === 'video' || type === 'reel') {
            const video = videoRef.current;
            if (!video) return;

            if (isIntersecting) {
                video.play().then(() => {
                    setIsPlaying(true);
                }).catch(err => {
                    console.log('Auto-play prevented:', err);
                });
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    }, [isIntersecting, type]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div
            ref={ref}
            className={cn("relative bg-muted overflow-hidden group", aspectRatio, className)}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {(!hasBeenVisible || !isLoaded) && (
                <Skeleton className="absolute inset-0 w-full h-full z-10" />
            )}

            {hasBeenVisible && (
                <>
                    {type === 'photo' ? (
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className={cn(
                                "object-cover transition-opacity duration-500",
                                isLoaded ? "opacity-100" : "opacity-0"
                            )}
                            onLoad={() => setIsLoaded(true)}
                        />
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                src={src}
                                loop
                                muted={isMuted}
                                playsInline
                                className={cn(
                                    "w-full h-full object-cover transition-opacity duration-500",
                                    isLoaded ? "opacity-100" : "opacity-0"
                                )}
                                onLoadedData={() => setIsLoaded(true)}
                            />

                            {/* Video Controls */}
                            {isLoaded && (
                                <div className={cn(
                                    "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                                    showControls ? "opacity-100" : "opacity-0"
                                )}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
                                        onClick={togglePlayPause}
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-8 w-8" />
                                        ) : (
                                            <Play className="h-8 w-8" />
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Mute/Unmute Button */}
                            {isLoaded && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white z-20"
                                    onClick={toggleMute}
                                >
                                    {isMuted ? (
                                        <VolumeX className="h-5 w-5" />
                                    ) : (
                                        <Volume2 className="h-5 w-5" />
                                    )}
                                </Button>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
