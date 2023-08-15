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
        <CustomCursorElement width="20" height="20" viewBox="0 0 20 20">
          <g>
            <g id="topLeft">
              <line y1="0.299805" x2="4" y2="0.299805" stroke="black" />
              <line x1="0.5" y1="2.18557e-08" x2="0.5" y2="4" stroke="black" />
            </g>
            <g id="topRight">
              <line
                x1="19.7"
                y1="2.18557e-08"
                x2="19.7"
                y2="4"
                stroke="black"
              />
              <line x1="20" y1="0.5" x2="16" y2="0.5" stroke="black" />
            </g>
            <g id="bottomRight">
              <line x1="20" y1="19.7002" x2="16" y2="19.7002" stroke="black" />
              <line x1="19.5" y1="20" x2="19.5" y2="16" stroke="black" />
            </g>
            <g id="bottomLeft">
              <line
                x1="0.300049"
                y1="20"
                x2="0.300049"
                y2="16"
                stroke="black"
              />
              <line
                x1="8.74228e-08"
                y1="19.5"
                x2="4"
                y2="19.5"
                stroke="black"
              />
            </g>
          </g>
        </CustomCursorElement>
      </CustomCursorWrapper>
    </CustomCursorWindowWrapper>
  );
};

export default CustomCursorWindow;
