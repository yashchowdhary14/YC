'use client';

import { useStoryCreationStore, useActiveStorySlide, TextElement as TextElementType } from '@/lib/story-creation-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Type, Pen } from 'lucide-react';
import TextElement from './TextElement';

export default function StoryEditor() {
  const activeSlide = useActiveStorySlide();
  const reset = useStoryCreationStore((s) => s.reset);
  const updateSlide = useStoryCreationStore((s) => s.updateSlide);
  const router = useRouter();

  const handleBack = () => {
    reset();
    router.back();
  }
  
  const addTextElement = () => {
    if (!activeSlide) return;

    const newText: TextElementType = {
        id: `text_${Date.now()}`,
        text: 'Your Text',
        font: 'sans-serif',
        color: '#FFFFFF',
        position: { x: 50, y: 50 }, // Center percentage
        scale: 1,
        rotation: 0,
    };
    updateSlide(activeSlide.id, { texts: [...activeSlide.texts, newText] });
  };

  if (!activeSlide) {
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
      
       {/* Interactive Elements */}
      <div className="absolute inset-0">
        {activeSlide.texts.map(text => (
            <TextElement key={text.id} element={text} slideId={activeSlide.id} />
        ))}
      </div>


      {/* Header Tools */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
           <button onClick={handleBack} className="p-2 text-white">
              <ArrowLeft className="h-7 w-7" />
           </button>
            <div className="flex items-center gap-4">
                <button onClick={() => {}} className="p-2 text-white">
                    <Pen className="h-7 w-7" />
                </button>
                <button onClick={addTextElement} className="p-2 text-white">
                    <Type className="h-7 w-7" />
                </button>
            </div>
        </div>
      </div>
      
      {/* Footer / Sharing Tools */}
       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-end">
            <button className="bg-white text-black font-bold py-2 px-6 rounded-full">
                Post Story
            </button>
          </div>
      </div>
    </div>
  );
}
