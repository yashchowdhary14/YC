
'use client';

import { useStoryCreationStore, useActiveStorySlide } from '@/lib/story-creation-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Type } from 'lucide-react';

export default function StoryEditor() {
  const activeSlide = useActiveStorySlide();
  const reset = useStoryCreationStore((s) => s.reset);
  const router = useRouter();

  const handleBack = () => {
    reset();
    router.back();
  }

  if (!activeSlide) {
    // This case should ideally not be hit if navigation is handled correctly
    // but as a fallback, we can redirect.
    if (typeof window !== 'undefined') {
       router.replace('/create');
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p>Loading story editor...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Media Preview */}
      <div className="absolute inset-0">
        {activeSlide.media.type === 'photo' ? (
          <Image
            src={activeSlide.media.url}
            alt="Story preview"
            fill
            className="object-contain"
          />
        ) : (
          <video
            src={activeSlide.media.url}
            className="w-full h-full object-contain"
            autoPlay
            loop
            muted
          />
        )}
      </div>

      {/* Header Tools */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
           <button onClick={handleBack} className="p-2 text-white">
              <ArrowLeft className="h-7 w-7" />
           </button>
            <div className="flex items-center gap-4">
                <button className="p-2 text-white">
                    <Type className="h-7 w-7" />
                </button>
            </div>
        </div>
      </div>
      
      {/* Footer / Sharing Tools */}
       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-end">
            <button className="bg-white text-black font-bold py-2 px-6 rounded-full">
                Post
            </button>
          </div>
      </div>
    </div>
  );
}
