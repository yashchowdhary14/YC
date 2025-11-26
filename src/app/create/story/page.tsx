
'use client';

import { useState } from 'react';
import { useStoryCreationStore } from '@/lib/story-creation-store';
import CameraView from '@/components/story-creation/CameraView';
import StoryEditor from '@/components/story-creation/StoryEditor';

export default function CreateStoryPage() {
  const media = useStoryCreationStore((s) => s.media);

  return (
    <div className="w-full h-screen bg-black text-white">
      {media.length === 0 ? <CameraView /> : <StoryEditor />}
    </div>
  );
}
