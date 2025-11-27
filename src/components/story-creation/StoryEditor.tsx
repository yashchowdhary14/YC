
'use client';

import { useStoryCreationStore, useActiveStorySlide, TextElement as TextElementType, StoryEffects } from '@/lib/story-creation-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Type, Pen, Loader2, Sticker, Sparkles, SlidersHorizontal } from 'lucide-react';
import TextElement from './TextElement';
import DrawingCanvas from './DrawingCanvas';
import { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { renderStory } from '@/lib/story/story-renderer';
import { useToast } from '@/hooks/use-toast';
import FilterStrip, { filters as filterPresets } from './FilterStrip';
import { interpolateFilter } from '@/lib/story/filterUtils';
import { cn } from '@/lib/utils';
import EffectsPanel from './effects/EffectsPanel';


export default function StoryEditor() {
  const activeSlide = useActiveStorySlide();
  const reset = useStoryCreationStore((s) => s.reset);
  const updateSlide = useStoryCreationStore((s) => s.updateSlide);
  const router = useRouter();
  const { toast } = useToast();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [activePanel, setActivePanel] = useState<'none' | 'filters' | 'effects'>('none');

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
    setActivePanel('none');
  }

  const togglePanel = (panel: 'filters' | 'effects') => {
    setActivePanel(prev => (prev === panel ? 'none' : panel));
    setIsDrawing(false);
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

  const activeFilterPreset = filterPresets.find(p => p.name === activeSlide?.filterName);
  const liveFilterStyle = activeFilterPreset
    ? interpolateFilter(activeFilterPreset.style, activeSlide?.filterIntensity ?? 1)
    : 'none';
  
  const effects = activeSlide?.effects;
  const effectsStyle: React.CSSProperties = useMemo(() => {
    if (!effects) return {};
    const filters: string[] = [];
    if (effects.glow > 0) filters.push(`blur(${effects.glow * 5}px)`);
    if (effects.blur > 0) filters.push(`blur(${effects.blur * 10}px)`);
    return { filter: filters.join(' ') };
  }, [effects]);

  const overlayStyle: React.CSSProperties = useMemo(() => {
    if (!effects) return {};
    return {
      '--grain-opacity': effects.grain,
      '--vignette-opacity': effects.vignette,
    } as React.CSSProperties;
  }, [effects]);


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
    <div className="relative w-full h-full bg-black overflow-hidden">
       {isRendering && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="text-lg font-semibold">Rendering your story...</p>
            </div>
       )}
      {/* Media Preview */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full relative" 
          style={{ ...effectsStyle, ...overlayStyle }}
        >
            <div className="w-full h-full" style={{ filter: liveFilterStyle }}>
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
            {/* Effects Overlays */}
            <div className={cn("absolute inset-0 pointer-events-none vignette-overlay")}></div>
            <div className={cn("absolute inset-0 pointer-events-none grain-overlay")}></div>
        </div>
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
                    <button className="p-2 text-white" disabled={isRendering}>
                        <Sticker className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                     <button onClick={() => togglePanel('filters')} className="p-2 text-white" disabled={isRendering}>
                        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                     <button onClick={() => togglePanel('effects')} className="p-2 text-white" disabled={isRendering}>
                        <SlidersHorizontal className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
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
       <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
          {activePanel === 'filters' && <FilterStrip />}
          {activePanel === 'effects' && <EffectsPanel />}
          {activePanel === 'none' && !isDrawing && (
            <div className="bg-gradient-to-t from-black/50 to-transparent -m-4 p-4 pt-16 flex items-center justify-end">
              <button onClick={handlePublish} className="bg-white text-black font-bold py-2 px-6 rounded-full" disabled={isRendering}>
                  Post Story
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
