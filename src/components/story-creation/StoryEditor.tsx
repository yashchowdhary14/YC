
'use client';

import { useStoryCreationStore, useActiveStorySlide } from '@/lib/story-creation-store';
import Image from 'next/image';

// This is a placeholder for the editor UI.
// It will be expanded in future steps.
export default function StoryEditor() {
  const activeSlide = useActiveStorySlide();
  const reset = useStoryCreationStore((s) => s.reset);

  if (!activeSlide) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p>No active story slide.</p>
        <button onClick={reset} className="text-primary">Start Over</button>
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

      {/* Placeholder for Editor Tools */}
      <div className="absolute top-4 left-4">
        <button onClick={reset} className="bg-black/50 p-2 rounded-full text-white">
          Back
        </button>
      </div>
      <div className="absolute top-4 right-4 text-white">
        <p>Editor Tools Here</p>
      </div>

       <div className="absolute bottom-4 right-4 text-white">
        <button className="bg-white text-black font-bold py-2 px-4 rounded-full">
            Post Story
        </button>
      </div>
    </div>
  );
}
