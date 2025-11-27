
'use client';

import { useStoryCreationStore, useActiveStorySlide, StoryEffects, defaultEffects } from '@/lib/story-creation-store';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import EffectToggle from './EffectToggle';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Image, CircleDot, Wind, Sun } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function EffectsPanel() {
  const activeSlide = useActiveStorySlide();
  const updateSlide = useStoryCreationStore(s => s.updateSlide);

  if (!activeSlide) return null;
  const { effects } = activeSlide;

  const handleEffectChange = (key: keyof Omit<StoryEffects, 'tiltShift'>, value: number) => {
    updateSlide(activeSlide.id, { effects: { [key]: value } });
  };
  
  const handleTiltShiftModeChange = (mode: 'none' | 'linear' | 'radial') => {
    updateSlide(activeSlide.id, { effects: { tiltShift: { ...effects.tiltShift, mode } } });
  }

  const handleTiltShiftIntensityChange = (intensity: number) => {
     updateSlide(activeSlide.id, { effects: { tiltShift: { ...effects.tiltShift, intensity } } });
  }
  
  const resetAllEffects = () => {
    updateSlide(activeSlide.id, { effects: defaultEffects });
  };

  return (
    <motion.div
      className="w-full pb-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="flex justify-between items-center px-4 mb-2">
        <h3 className="text-white font-semibold">Effects</h3>
        <Button variant="ghost" size="sm" onClick={resetAllEffects}>Reset All</Button>
      </div>
      <ScrollArea className="h-48">
        <div className="px-4 space-y-4">
            <EffectToggle
                icon={<Sun className="h-5 w-5" />}
                label="Glow"
                value={effects.glow}
                onValueChange={(val) => handleEffectChange('glow', val)}
            />
            <EffectToggle
                icon={<Image className="h-5 w-5" />}
                label="Blur"
                value={effects.blur}
                onValueChange={(val) => handleEffectChange('blur', val)}
            />
            <EffectToggle
                icon={<SlidersHorizontal className="h-5 w-5" />}
                label="Vignette"
                value={effects.vignette}
                onValueChange={(val) => handleEffectChange('vignette', val)}
            />
             <EffectToggle
                icon={<Wind className="h-5 w-5" />}
                label="Grain"
                value={effects.grain}
                onValueChange={(val) => handleEffectChange('grain', val)}
            />

            <div className="pt-2">
                <Label className="text-white font-semibold">Tilt Shift</Label>
                <div className="flex gap-2 mt-2">
                     <Select value={effects.tiltShift.mode} onValueChange={handleTiltShiftModeChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Tilt-Shift mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                            <SelectItem value="linear">Linear</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 {effects.tiltShift.mode !== 'none' && (
                    <div className="mt-2">
                        <EffectToggle
                            icon={<CircleDot className="h-5 w-5" />}
                            label="Intensity"
                            value={effects.tiltShift.intensity}
                            onValueChange={handleTiltShiftIntensityChange}
                        />
                    </div>
                )}
            </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
