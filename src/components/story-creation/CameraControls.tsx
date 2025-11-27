
'use client';

import { Camera, Image as ImageIcon, RotateCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
        {/* Gallery Picker */}
        <button onClick={onOpenGallery} className={cn("p-2", !isMobile && "w-20 h-20 border-4 border-white rounded-full flex items-center justify-center")}>
          <ImageIcon className="h-8 w-8 text-white" />
        </button>

        {isMobile && (
          <>
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
        )}
      </div>
    </div>
  );
}
