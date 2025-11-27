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
  brush: 'pen' | 'highlighter' | 'eraser';
  color: string; // Hex color or 'erase'
  points: { x: number; y: number }[];
  strokeWidth: number;
}

export interface StickerElement {
  id: string;
  type: 'image' | 'gif' | 'location' | 'mention' | 'hashtag' | 'poll' | 'question';
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  // Sticker-specific data
  data: any;
}

export interface StoryEffects {
  grain: number;      // 0–1
  vignette: number;   // 0–1
  glow: number;       // 0–1
  blur: number;       // 0-1
  tiltShift: {
    mode: "none" | "linear" | "radial";
    intensity: number; // 0–1
  };
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
  filterName: string;
  filterIntensity: number;
  effects: StoryEffects;
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
  updateSlide: (slideId: string, updates: Partial<StorySlide> | { effects: Partial<StoryEffects> }) => void;
  setMode: (mode: StoryCreationState['mode']) => void;
  setSharePrivacy: (privacy: StoryCreationState['shareSettings']['privacy']) => void;
  reset: () => void;
};

export const defaultEffects: StoryEffects = {
    grain: 0,
    vignette: 0,
    glow: 0,
    blur: 0,
    tiltShift: { mode: 'none', intensity: 0 },
}

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
      filterName: 'Original',
      filterIntensity: 1,
      effects: defaultEffects,
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
      media: state.media.map((s) => {
        if (s.id === slideId) {
          // Check if the update is for effects specifically
          if ('effects' in updates && typeof updates.effects === 'object' && !Array.isArray(updates.effects)) {
            return {
              ...s,
              effects: { ...s.effects, ...updates.effects },
            };
          }
          return { ...s, ...updates as Partial<StorySlide> };
        }
        return s;
      }),
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
