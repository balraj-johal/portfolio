"use client";

// TODO: come up with better name for this component

import { CanvasElement, CanvasWrapper } from "./styles";
import { create } from "zustand";
import React from "react";

interface Props {
  children: React.ReactNode;
}

type MousePos = {
  x: number;
  y: number;
};

interface Store {
  mousePos: MousePos;
  updateMousePos: (newMousePos: MousePos) => void;
}
export const useStore = create<Store>((set) => ({
  mousePos: { x: 0.5, y: 0.5 },
  updateMousePos: (newMousePos: MousePos) =>
    set((state) => ({
      ...state,
      mousePos: { x: newMousePos.x, y: newMousePos.y },
    })),
}));

const getRelativeMousePos = (e: React.MouseEvent): MousePos => {
  return {
    x: e.clientX / window.innerWidth,
    y: 1 - e.clientY / window.innerHeight,
  };
};

const Canvas = ({ children }: Props) => {
  const updateMousePos = useStore((state) => state.updateMousePos);

  return (
    <CanvasWrapper
      onMouseMove={(e: React.MouseEvent) =>
        updateMousePos(getRelativeMousePos(e))
      }
    >
      <CanvasElement>{children}</CanvasElement>
    </CanvasWrapper>
  );
};

export default Canvas;
