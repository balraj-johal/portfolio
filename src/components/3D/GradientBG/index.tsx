"use client";

import { useRef } from "react";
import { CanvasElement } from "../Canvas/styles";
import css from "../Canvas/style.module.css";
import GradientBGPlane from "./GradientBGPlane";

export type MousePos = {
  x: number;
  y: number;
};

const GradientBG = () => {
  const mousePos = useRef<MousePos>({ x: 0.5, y: 0.5 });

  const getRelativeMousePos = (e: React.MouseEvent): MousePos => {
    return {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight,
    };
  };

  const updateMousePos = (e: React.MouseEvent) =>
    (mousePos.current = getRelativeMousePos(e));

  return (
    <div className={css.CanvasWrapper} onMouseMove={updateMousePos}>
      <CanvasElement>
        <GradientBGPlane mousePos={mousePos} />
      </CanvasElement>
    </div>
  );
};

export default GradientBG;
