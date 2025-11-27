
'use client';

import { useState } from 'react';
import { useStoryCreationStore } from '@/lib/story-creation-store';
import CameraView from '@/components/story-creation/CameraView';
import StoryEditor from '@/components/story-creation/StoryEditor';
import { AnimatePresence } from 'framer-motion';

interface CreateStoryPageProps {
  onStoryReady?: (file: File) => void;
  onExit?: () => void;
}

export default function CreateStoryPage({ onStoryReady, onExit }: CreateStoryPageProps) {
  const media = useStoryCreationStore((s) => s.media);

  const showEditor = media.length > 0;

  return (
    <div className="w-full h-full bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {showEditor ? (
          <StoryEditor key="editor" onStoryReady={onStoryReady} onExit={onExit} />
        ) : (
          <CameraView key="camera" onExit={onExit}/>
        )}
      </AnimatePresence>
    </div>
  );
}
