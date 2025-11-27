
'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCreateStore } from '@/lib/create-store';
import { X, Zap, ZapOff } from 'lucide-react';
import CameraPreview from './CameraPreview';
import CameraControls from './CameraControls';
import { fileToDataUri } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type FacingMode = 'user' | 'environment';

interface CameraViewProps {
  onExit?: () => void;
}

export default function CameraView({ onExit }: CameraViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const addMedia = useCreateStore((s) => s.addMedia);
  const isMobile = useIsMobile();

  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExit = onExit || (() => router.back());

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip the image horizontally if it's from the front-facing camera
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg');
      
      canvas.toBlob((blob) => {
        if(blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            addMedia([file]);
        }
      }, 'image/jpeg');

    }
  }, [addMedia, facingMode, videoRef]);

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await addMedia(Array.from(files));
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load file',
          description: 'Could not process the selected file. Please try again.',
        });
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <CameraPreview
        videoRef={videoRef}
        facingMode={facingMode}
        flashEnabled={flashEnabled}
      />

      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
        <div className="flex items-center justify-between">
          <button onClick={handleExit} className="p-2 text-white">
            <X className="h-7 w-7" />
          </button>
          {isMobile && (
            <button
                onClick={() => setFlashEnabled(!flashEnabled)}
                className="p-2"
            >
                {flashEnabled ? (
                <Zap className="h-7 w-7 text-yellow-300" />
                ) : (
                <ZapOff className="h-7 w-7 text-white" />
                )}
            </button>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <CameraControls
        onCapture={handleCapture}
        onFlipCamera={handleFlipCamera}
        onOpenGallery={() => fileInputRef.current?.click()}
      />
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
