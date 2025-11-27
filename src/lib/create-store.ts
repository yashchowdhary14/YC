'use client';

import { create } from 'zustand';
import { CreateMode, FinalizedCreateData } from '@/components/create/types';
import { fileToDataUri } from './utils';

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

export interface AudioLayer {
  id: string;
  type: "music" | "voiceover" | "effect";
  src: string;
  startTime: number;
  duration: number;
  volume: number;
  trimStart?: number;
  trimEnd?: number;
  fadeIn?: number;
  fadeOut?: number;
};

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

// A single slide in a story or an item in a post
export type MediaObject = {
  id: string;
  url: string;
  type: 'photo' | 'video';
  file: File;
  texts: TextElement[];
  drawings: DrawingElement[];
  stickers: StickerElement[];
  audioLayers: AudioLayer[];
  filterName: string;
  filterIntensity: number;
  effects: StoryEffects;
};

// The main state for the story creation process
type CreateState = {
  step: "select-type" | "media-picker" | "media-preview" | "media-details" | "publish" | "success" | "story-editor";
  mode: CreateMode | null;
  media: MediaObject[];
  activeMediaId: string | null;
  finalizedData: FinalizedCreateData | null;
  
  // Actions
  setStep: (step: CreateState['step']) => void;
  setMode: (mode: CreateMode | null) => void;
  addMedia: (files: File[]) => Promise<void>;
  removeMedia: (mediaId: string) => void;
  setActiveMediaId: (mediaId: string | null) => void;
  updateMedia: (mediaId: string, updates: Partial<Omit<MediaObject, 'effects'>> & { effects?: Partial<StoryEffects> }) => void;
  setFinalizedData: (data: FinalizedCreateData | null) => void;
  reset: () => void;
};

export const defaultEffects: StoryEffects = {
    grain: 0,
    vignette: 0,
    glow: 0,
    blur: 0,
    tiltShift: { mode: 'none', intensity: 0 },
}

const initialState: Omit<CreateState, 'setStep' | 'setMode' | 'addMedia' | 'removeMedia' | 'setActiveMediaId' | 'updateMedia' | 'setFinalizedData' | 'reset'> = {
  step: "select-type",
  mode: null,
  media: [],
  activeMediaId: null,
  finalizedData: null,
};

export const useCreateStore = create<CreateState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode }),

  addMedia: async (files) => {
    const newMediaObjects: MediaObject[] = await Promise.all(
        files.map(async (file) => {
            const url = await fileToDataUri(file);
            return {
                id: `media_${Date.now()}_${Math.random()}`,
                url,
                file,
                type: file.type.startsWith('video') ? 'video' : 'photo',
                texts: [],
                drawings: [],
                stickers: [],
                audioLayers: [],
                filterName: 'Original',
                filterIntensity: 1,
                effects: defaultEffects,
            };
        })
    );
    
    set((state) => {
      const newMediaArray = [...state.media, ...newMediaObjects];
      return {
        media: newMediaArray,
        activeMediaId: state.activeMediaId ?? newMediaArray[0]?.id,
      };
    });
  },

  removeMedia: (mediaId) =>
    set((state) => ({
      media: state.media.filter((s) => s.id !== mediaId),
      activeMediaId:
        state.activeMediaId === mediaId
          ? state.media[0]?.id ?? null
          : state.activeMediaId,
    })),
    
  setActiveMediaId: (mediaId) => set({ activeMediaId: mediaId }),

  updateMedia: (mediaId, updates) =>
    set((state) => ({
      media: state.media.map((s) => {
        if (s.id === mediaId) {
          // Special handling for nested 'effects' object
          const { effects, ...restUpdates } = updates;
          const updatedSlide = { ...s, ...restUpdates };
          if (effects) {
            updatedSlide.effects = { ...s.effects, ...effects };
          }
          return updatedSlide;
        }
        return s;
      }),
    })),
  
  setFinalizedData: (data) => set({ finalizedData: data }),

  reset: () => set(initialState),
}));

export const useActiveMediaObject = () => {
  const media = useCreateStore((s) => s.media);
  const activeId = useCreateStore((s) => s.activeMediaId);
  return media.find((s) => s.id === activeId);
};
