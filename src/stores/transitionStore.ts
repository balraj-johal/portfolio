import { create } from "zustand";

import { ColorSet } from "@/types/transition";

interface TransitionStore {
  transitioning: boolean;
  colorSet: ColorSet;
  startTransition: () => void;
  endTransition: () => void;
  changeColorSet: (targetColorSet: ColorSet) => void;
}

export const useTransitionStore = create<TransitionStore>((set) => ({
  transitioning: false,
  colorSet: "primary",
  startTransition: () => set(() => ({ transitioning: true })),
  endTransition: () => set(() => ({ transitioning: false })),
  changeColorSet: (targetColorSet: ColorSet) =>
    set((test) => ({
      ...test,
      colorSet: targetColorSet,
    })),
}));
