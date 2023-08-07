"use client";

import { useRef } from "react";

import useCustomCursor from "@/hooks/useCustomCursor";

import {
  CustomCursorElement,
  CustomCursorWrapper,
  CustomCursorWindowWrapper,
} from "./styles";
import CustomCursorContent from "./CustomCursorContent";

const CustomCursorWindow = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { cursorType, animationPlaying, setAnimationEnded } =
    useCustomCursor(cursorRef);

  return (
    <CustomCursorWindowWrapper>
      <CustomCursorWrapper ref={cursorRef}>
        <CustomCursorElement
          animating={animationPlaying}
          onAnimationEnd={setAnimationEnded}
          type={cursorType}
        >
          <CustomCursorContent cursorType={cursorType} />
        </CustomCursorElement>
      </CustomCursorWrapper>
    </CustomCursorWindowWrapper>
  );
};

export default CustomCursorWindow;
