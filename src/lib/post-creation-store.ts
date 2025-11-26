
'use client';

import { create } from 'zustand';

export type MediaObject = {
  id: string;
  file: File;
  previewUrl: string;
  type: 'photo' | 'video';
  // Editing properties
  filter: string; // e.g., 'grayscale'
  crop?: { x: number; y: number; width: number; height: number; };
  brightness: number;
  contrast: number;
};

type PostCreationState = {
  media: MediaObject[];
  activeMediaId: string | null;
  caption: string;
  location: string;
  taggedUsers: string[];
  hideLikes: boolean;
  disableComments: boolean;
  isSubmitting: boolean;
  isGeneratingCaption: boolean;
};

type PostCreationActions = {
  addMedia: (media: Omit<MediaObject, 'filter' | 'brightness' | 'contrast'>) => void;
  removeMedia: (id: string) => void;
  reorderMedia: (fromIndex: number, toIndex: number) => void;
  setActiveMediaId: (id: string | null) => void;
  updateMedia: (id: string, updates: Partial<MediaObject>) => void;
  setCaption: (caption: string) => void;
  setLocation: (location: string) => void;
  addTaggedUser: (username: string) => void;
  removeTaggedUser: (username: string) => void;
  setHideLikes: (value: boolean) => void;
  setDisableComments: (value: boolean) => void;
  startSubmitting: () => void;
  finishSubmitting: () => void;
  startCaptionGeneration: () => void;
  finishCaptionGeneration: () => void;
  reset: () => void;
};

const initialState: PostCreationState = {
  media: [],
  activeMediaId: null,
  caption: '',
  location: '',
  taggedUsers: [],
  hideLikes: false,
  disableComments: false,
  isSubmitting: false,
  isGeneratingCaption: false,
};

export const usePostCreationStore = create<PostCreationState & PostCreationActions>((set, get) => ({
  ...initialState,
  
  addMedia: (newMedia) => set(state => {
    const fullMediaObject: MediaObject = {
      ...newMedia,
      filter: 'none',
      brightness: 100,
      contrast: 100,
    };
    const newMediaArray = [...state.media, fullMediaObject];
    return {
      media: newMediaArray,
      // If it's the first media item, make it active
      activeMediaId: state.activeMediaId ?? newMediaArray[0]?.id ?? null
    };
  }),
  
  removeMedia: (id) => set(state => ({
    media: state.media.filter(m => m.id !== id),
    activeMediaId: state.activeMediaId === id ? state.media[0]?.id ?? null : state.activeMediaId,
  })),

  reorderMedia: (fromIndex, toIndex) => set(state => {
    const newMedia = [...state.media];
    const [movedItem] = newMedia.splice(fromIndex, 1);
    newMedia.splice(toIndex, 0, movedItem);
    return { media: newMedia };
  }),

  setActiveMediaId: (id) => set({ activeMediaId: id }),

  updateMedia: (id, updates) => set(state => ({
    media: state.media.map(m => m.id === id ? { ...m, ...updates } : m),
  })),

  setCaption: (caption) => set({ caption }),
  setLocation: (location) => set({ location }),
  addTaggedUser: (username) => set(state => ({ taggedUsers: [...state.taggedUsers, username] })),
  removeTaggedUser: (username) => set(state => ({ taggedUsers: state.taggedUsers.filter(u => u !== username) })),
  setHideLikes: (value) => set({ hideLikes: value }),
  setDisableComments: (value) => set({ disableComments: value }),
  startSubmitting: () => set({ isSubmitting: true }),
  finishSubmitting: () => set({ isSubmitting: false }),
  startCaptionGeneration: () => set({ isGeneratingCaption: true }),
  finishCaptionGeneration: () => set({ isGeneratingCaption: false }),
  reset: () => set(initialState),
}));

export const useActiveMedia = () => {
  const media = usePostCreationStore(s => s.media);
  const activeId = usePostCreationStore(s => s.activeMediaId);
  return media.find(m => m.id === activeId);
}
