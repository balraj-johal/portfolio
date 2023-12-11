import { create } from "zustand";

import { ColorThemeKey } from "@/types/transition";

interface TransitionStore {
  transitioning: boolean;
  transitionOverlayVisible: boolean;
  bgColor: ColorThemeKey;
  transitionColor: ColorThemeKey;
  startTransition: () => void;
  endTransition: () => void;
  showTransitionOverlay: () => void;
  hideTransitionOverlay: () => void;
  toggleBgColor: () => void;
  changeBgColor: (targetbgColor: ColorThemeKey) => void;
  toggleTransitionColor: () => void;
  changeTransitionColor: (targetTransitionColor: ColorThemeKey) => void;
}

export const useTransitionStore = create<TransitionStore>((set, get) => ({
  transitioning: false,
  transitionOverlayVisible: false,
  bgColor: "primary",
  transitionColor: "primary",
  startTransition: () =>
    set(() => ({ transitioning: true, transitionOverlayVisible: true })),
  endTransition: () => set(() => ({ transitioning: false })),
  showTransitionOverlay: () => set(() => ({ transitionOverlayVisible: true })),
  hideTransitionOverlay: () => set(() => ({ transitionOverlayVisible: false })),

  // BG Colors
  changeBgColor: (targetbgColor: ColorThemeKey) =>
    set(() => ({
      bgColor: targetbgColor,
    })),
  toggleBgColor: () =>
    set(() => {
      const targetbgColor =
        get().bgColor === "primary" ? "secondary" : "primary";
      return { bgColor: targetbgColor };
    }),

  // Transition Colors
  changeTransitionColor: (targetTransitionColor: ColorThemeKey) =>
    set(() => ({
      transitionColor: targetTransitionColor,
    })),
  toggleTransitionColor: () =>
    set(() => {
      const targetTransitionColor =
        get().transitionColor === "primary" ? "secondary" : "primary";
      return { transitionColor: targetTransitionColor };
    }),
}));
