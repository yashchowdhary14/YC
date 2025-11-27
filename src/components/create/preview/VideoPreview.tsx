
'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type VideoPreviewProps = {
    file: File;
    aspectRatio: '9:16' | '16:9';
    isStory?: boolean;
};

export default function VideoPreview({ file, aspectRatio, isStory = false }: VideoPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [metadata, setMetadata] = useState({
        duration: 0,
        resolution: 'N/A',
    });
    
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleMetadata = () => {
            setMetadata({
                duration: video.duration,
                resolution: `${video.videoWidth}x${video.videoHeight}`,
            });
        };

        video.addEventListener('loadedmetadata', handleMetadata);
        return () => video.removeEventListener('loadedmetadata', handleMetadata);

    }, [file]);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div
                className={cn(
                    "relative bg-black rounded-lg overflow-hidden shadow-2xl",
                    aspectRatio === '9:16' ? 'aspect-[9/16] h-full' : 'aspect-video w-full'
                )}
            >
                <video
                    ref={videoRef}
                    src={URL.createObjectURL(file)}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-contain"
                />
                
                {!isStory && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <Badge variant="secondary">{formatDuration(metadata.duration)}</Badge>
                        <Badge variant="secondary">{metadata.resolution}</Badge>
                        <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>
                )}
                 {isStory && (
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                       <Badge variant="secondary" className="bg-black/50 text-white">Story Preview</Badge>
                    </div>
                 )}
            </div>
        </div>
    );
}
