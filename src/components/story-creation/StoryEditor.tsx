
'use client';

import { useStoryCreationStore, useActiveStorySlide, TextElement as TextElementType } from '@/lib/story-creation-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Type, Pen, Loader2 } from 'lucide-react';
import TextElement from './TextElement';
import DrawingCanvas from './DrawingCanvas';
import { useState } from 'react';
import { Button } from '../ui/button';
import { renderStory } from '@/lib/story/story-renderer';
import { useToast } from '@/hooks/use-toast';

export default function StoryEditor() {
  const activeSlide = useActiveStorySlide();
  const reset = useStoryCreationStore((s) => s.reset);
  const updateSlide = useStoryCreationStore((s) => s.updateSlide);
  const router = useRouter();
  const { toast } = useToast();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const handleBack = () => {
    reset();
    router.push('/create');
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
  
  const toggleDrawing = () => {
    if (isDrawing) {
        // Here you might want to confirm changes or just exit drawing mode
    }
    setIsDrawing(!isDrawing);
  }

  const handlePublish = async () => {
    if (!activeSlide) return;
    setIsRendering(true);
    try {
        const renderedOutput = await renderStory(activeSlide);
        console.log("Story rendered successfully:", renderedOutput);
        
        // TODO: In the next step, pass this to the upload flow
        // For now, we'll just go back to the create page
        toast({
            title: "Story Rendered! (Simulation)",
            description: "Your story is ready for the next step.",
        });
        handleBack();

    } catch (error) {
        console.error("Failed to render story:", error);
        toast({
            variant: "destructive",
            title: "Rendering Failed",
            description: "Could not process your story. Please try again.",
        });
    } finally {
        setIsRendering(false);
    }
  };

  if (!activeSlide) {
    if (typeof window !== 'undefined') {
       router.replace('/create');
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-black text-white">
        <p>Loading story editor...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
       {isRendering && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="text-lg font-semibold">Rendering your story...</p>
            </div>
       )}
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
      <div className="absolute inset-0 pointer-events-none">
        {activeSlide.texts.map(text => (
            <TextElement key={text.id} element={text} slideId={activeSlide.id} />
        ))}
      </div>
      
      {isDrawing && <DrawingCanvas />}

      {/* Header Tools */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-b from-black/50 to-transparent z-30">
        <div className="flex items-center justify-between">
           <button onClick={handleBack} className="p-2 text-white" disabled={isRendering}>
              <ArrowLeft className="h-7 w-7" />
           </button>
            <div className="flex items-center gap-2 sm:gap-4">
                 {isDrawing ? (
                   <Button onClick={toggleDrawing} variant="secondary" size="sm" disabled={isRendering}>Done</Button>
                ) : (
                   <>
                    <button onClick={toggleDrawing} className="p-2 text-white" disabled={isRendering}>
                        <Pen className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                    <button onClick={addTextElement} className="p-2 text-white" disabled={isRendering}>
                        <Type className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                   </>
                )}
            </div>
        </div>
      </div>
      
      {/* Footer / Sharing Tools */}
       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent z-30">
          <div className="flex items-center justify-end">
            <button onClick={handlePublish} className="bg-white text-black font-bold py-2 px-6 rounded-full" disabled={isRendering}>
                Post Story
            </button>
          </div>
      </div>
    </div>
  );
}
