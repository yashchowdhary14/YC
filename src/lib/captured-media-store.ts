
'use client';

import { create } from 'zustand';

type CapturedMediaStore = {
  capturedMedia: File | null;
  setCapturedMedia: (media: File | null) => void;
};

export const useCapturedMedia = create<CapturedMediaStore>((set) => ({
  capturedMedia: null,
  setCapturedMedia: (media) => set({ capturedMedia: media }),
}));

    