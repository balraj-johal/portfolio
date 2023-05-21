"use client";

import { useRef } from "react";
import GradientBGPlane from "../GradientBGPlane";
import { MousePos } from "@/types/events";
import { CanvasElement, CanvasWrapper } from "./styles";

const INITIAL_MOUSE_POS = { x: 0.5, y: 0.5 };

const GradientBG = () => {
  const mousePos = useRef<MousePos>(INITIAL_MOUSE_POS);

  const getRelativeMousePos = (e: React.MouseEvent): MousePos => {
    return {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight,
    };
  };

  const updateMousePos = (e: React.MouseEvent) =>
    (mousePos.current = getRelativeMousePos(e));

  return (
    <CanvasWrapper onMouseMove={updateMousePos}>
      <CanvasElement>
        <GradientBGPlane mousePos={mousePos} />
      </CanvasElement>
    </CanvasWrapper>
  );
};

export default GradientBG;
