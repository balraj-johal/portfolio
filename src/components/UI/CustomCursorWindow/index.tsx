"use client";

import { useRef } from "react";

import useAnimationFrame from "@phntms/use-animation-frame";

import useCustomCursor from "@/hooks/useCustomCursor";

import {
  CustomCursorElement,
  CustomCursorWrapper,
  CustomCursorWindowWrapper,
} from "./styles";

const CustomCursorWindow = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { cursorCornerTargetsRef } = useCustomCursor(cursorRef);

  useAnimationFrame(() => {
    const targets = cursorCornerTargetsRef.current;
    if (!targets) return;
    const corner = Object.keys(targets) as (keyof typeof targets)[];
    for (const target of corner) {
      const group = document.getElementById(target);
      if (!group) return;
      const { x, y } = targets[target];
      group.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  return (
    <CustomCursorWindowWrapper>
      <CustomCursorWrapper ref={cursorRef}>
        <Corner id="topLeft" />
        <Corner id="topRight" transform="scaleX(-1) translateX(-100%)" />
        <Corner
          id="bottomRight"
          transform="scale(-1, -1) translate(-100%, -100%)"
        />
        <Corner id="bottomLeft" transform="scaleY(-1) translateY(-100%)" />
      </CustomCursorWrapper>
    </CustomCursorWindowWrapper>
  );
};

export default CustomCursorWindow;

type CornerProps = {
  id: string;
  transform?: string;
};

const Corner = ({ id, transform }: CornerProps) => {
  return (
    <svg viewBox="0 0 4 4" width="8" height="8" id={id}>
      <g
        style={{
          transformOrigin: "top left",
          transform: transform,
        }}
      >
        <line y1="0.299805" x2="4" y2="0.299805" stroke="black" />
        <line x1="0.5" y1="2.18557e-08" x2="0.5" y2="4" stroke="black" />
      </g>
    </svg>
  );
};
