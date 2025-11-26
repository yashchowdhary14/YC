'use client';

import { create } from 'zustand';

// Define the types for various story elements
export interface TextElement {
  id: string;
  text: string;
  font: string;
  color: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

export interface DrawingElement {
  id:string;
  brush: 'pen' | 'highlighter' | 'neon';
  color: string;
  points: { x: number; y: number }[];
  strokeWidth: number;
}

export interface StickerElement {
  id: string;
  type: 'location' | 'mention' | 'hashtag' | 'gif' | 'poll' | 'question';
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  // Sticker-specific data
  data: any;
}

// A single slide in a story
export type StorySlide = {
  id: string;
  media: {
    url: string;
    type: 'photo' | 'video';
    file?: File;
  };
  texts: TextElement[];
  drawings: DrawingElement[];
  stickers: StickerElement[];
  filter: string | null;
};

// The main state for the story creation process
type StoryCreationState = {
  media: StorySlide[];
  activeSlideId: string | null;
  mode: 'normal' | 'boomerang' | 'hands-free' | 'layout';
  shareSettings: {
    privacy: 'everyone' | 'close-friends';
  };
};

type StoryCreationActions = {
  addSlide: (media: StorySlide['media']) => void;
  removeSlide: (slideId: string) => void;
  setActiveSlideId: (slideId: string | null) => void;
  updateSlide: (slideId: string, updates: Partial<StorySlide>) => void;
  setMode: (mode: StoryCreationState['mode']) => void;
  setSharePrivacy: (privacy: StoryCreationState['shareSettings']['privacy']) => void;
  reset: () => void;
};

const initialState: StoryCreationState = {
  media: [],
  activeSlideId: null,
  mode: 'normal',
  shareSettings: {
    privacy: 'everyone',
  },
};

export const useStoryCreationStore = create<StoryCreationState & StoryCreationActions>((set, get) => ({
  ...initialState,

  addSlide: (media) => {
    const newSlide: StorySlide = {
      id: `slide_${Date.now()}`,
      media,
      texts: [],
      drawings: [],
      stickers: [],
      filter: null,
    };
    set((state) => {
      const newMediaArray = [...state.media, newSlide];
      return {
        media: newMediaArray,
        activeSlideId: state.activeSlideId ?? newMediaArray[0]?.id,
      };
    });
  },

  removeSlide: (slideId) =>
    set((state) => ({
      media: state.media.filter((s) => s.id !== slideId),
      activeSlideId:
        state.activeSlideId === slideId
          ? state.media[0]?.id ?? null
          : state.activeSlideId,
    })),
    
  setActiveSlideId: (slideId) => set({ activeSlideId: slideId }),

  updateSlide: (slideId, updates) =>
    set((state) => ({
      media: state.media.map((s) =>
        s.id === slideId ? { ...s, ...updates } : s
      ),
    })),
  
  setMode: (mode) => set({ mode }),

  setSharePrivacy: (privacy) =>
    set((state) => ({
      shareSettings: { ...state.shareSettings, privacy },
    })),

  reset: () => set(initialState),
}));

export const useActiveStorySlide = () => {
  const slides = useStoryCreationStore((s) => s.media);
  const activeId = useStoryCreationStore((s) => s.activeSlideId);
  return slides.find((s) => s.id === activeId);
};
