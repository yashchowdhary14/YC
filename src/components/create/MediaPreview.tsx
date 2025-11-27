
'use client';

import { useState, useMemo, useEffect } from 'react';
import { CreateMode } from './CreateChoiceScreen';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PostPreview from './preview/PostPreview';
import VideoPreview from './preview/VideoPreview';
import { useCreateStore } from '@/lib/create-store';

type MediaPreviewProps = {
  onBack: () => void;
  onConfirm: (validatedFiles: File[]) => void;
};

// Helper function to get video duration
const getVideoMetadata = (file: File): Promise<{duration: number, width: number, height: number}> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve({
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight
            });
        };
        video.onerror = reject;
        video.src = URL.createObjectURL(file);
    });
};

export default function MediaPreview({ onBack, onConfirm }: MediaPreviewProps) {
    const { mode, media, setStep } = useCreateStore();
    const files = useMemo(() => media.map(m => m.file), [media]);
    const { toast } = useToast();

    // Validation logic effect
    useEffect(() => {
        let isValid = true;
        const validate = async () => {
            if (mode === 'post') {
                if (files.length > 10) {
                    toast({ variant: 'destructive', title: 'Too many files', description: 'You can select a maximum of 10 files for a post.' });
                    isValid = false;
                }
            } else if (mode === 'reel' || mode === 'video' || mode === 'story') {
                const file = files[0];
                if (!file) {
                    isValid = false;
                    onBack(); // go back if no file exists
                    return;
                }
                if (!file.type.startsWith('video/')) {
                    if(mode === 'story' && file.type.startsWith('image/')) {
                        // image is ok for story
                    } else {
                        toast({ variant: 'destructive', title: 'Invalid file type', description: `Please select a video for your ${mode}.` });
                        isValid = false;
                    }
                } else {
                     const metadata = await getVideoMetadata(file);
                     if (mode === 'reel' && metadata.duration > 90) {
                        toast({ title: 'Video may be too long', description: 'Reels are best under 90 seconds.' });
                     }
                     if (mode === 'story' && metadata.duration > 60) {
                         toast({ title: 'Video may be too long', description: 'Stories are best under 60 seconds.' });
                     }
                }
            }
            if (!isValid) {
                // If validation fails, maybe we should automatically go back?
                // For now, user has to manually go back.
            }
        };

        validate();
    }, [files, mode, toast, onBack]);

    const handleConfirm = () => {
        onConfirm(files);
    };
    
    const renderPreview = () => {
        switch(mode) {
            case 'post':
                return <PostPreview />;
            case 'reel':
                 return <VideoPreview file={files[0]} aspectRatio="9:16" />;
            case 'video':
                 return <VideoPreview file={files[0]} aspectRatio="16:9" />;
            case 'story':
                if (files[0]?.type.startsWith('video/')) {
                    return <VideoPreview file={files[0]} aspectRatio="9:16" isStory={true} />;
                }
                // TODO: Add image story preview
                return <PostPreview isStory={true} />;
            default:
                return <div>Unsupported mode</div>;
        }
    }

    return (
        <div className="h-full w-full flex flex-col bg-black text-white">
            <header className="flex items-center justify-between p-2 flex-shrink-0 border-b border-gray-800 z-10">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft />
                </Button>
                <h2 className="font-semibold text-lg capitalize">{mode} Preview</h2>
                <Button variant="link" onClick={handleConfirm}>Next</Button>
            </header>
            <main className="flex-1 relative">
                {renderPreview()}
            </main>
        </div>
    );
}
