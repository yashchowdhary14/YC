import { create } from "zustand";
import { SimulatedUploadResult } from "@/components/create/types";

export type LocalFeedItem = SimulatedUploadResult & {
  createdAt: number;
};

type LocalFeedState = {
  items: LocalFeedItem[];
  addItem: (item: LocalFeedItem) => void;
  clear: () => void;
};

export const useLocalFeedStore = create<LocalFeedState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  clear: () => set({ items: [] }),
}));
