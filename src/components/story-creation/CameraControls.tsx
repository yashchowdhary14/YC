
'use client';

import { Camera, Image as ImageIcon, RotateCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface CameraControlsProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  onOpenGallery: () => void;
}

export default function CameraControls({
  onCapture,
  onFlipCamera,
  onOpenGallery,
}: CameraControlsProps) {
  const isMobile = useIsMobile();

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <div className={cn("flex items-center", isMobile ? "justify-between" : "justify-center")}>
        
        {isMobile ? (
          <>
            {/* Gallery Picker on Mobile */}
            <button onClick={onOpenGallery} className="p-2">
              <ImageIcon className="h-8 w-8 text-white" />
            </button>
            {/* Shutter Button */}
            <button
              onClick={onCapture}
              className="w-20 h-20 rounded-full bg-transparent border-4 border-white flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 transition-transform active:scale-90"></div>
            </button>

            {/* Flip Camera */}
            <button onClick={onFlipCamera} className="p-2">
              <RotateCw className="h-8 w-8 text-white" />
            </button>
          </>
        ) : (
          // Centered Gallery button for Web
          <Button onClick={onOpenGallery} className="h-16 rounded-full px-8 gap-2">
             <ImageIcon className="h-6 w-6" />
             <span className="text-lg font-semibold">Upload from Device</span>
          </Button>
        )}
      </div>
    </div>
  );
}
