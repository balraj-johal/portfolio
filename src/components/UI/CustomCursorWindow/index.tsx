"use client";

import { useCallback, useEffect, useRef } from "react";

import { MousePos } from "@/types/events";
import { useApplicationState } from "@/contexts/applicationState";

import {
  CustomCursor,
  CustomCursorWrapper,
  CustomCursorWindowWrapper,
} from "./styles";

const CustomCursorWindow = () => {
  const { mousePos, updateMousePos } = useApplicationState();

  const requestRef = useRef<number>(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  const buildTransform = (pos: MousePos) => {
    const xPosInPX = window.innerWidth * pos.x;
    const yPosInPX = window.innerHeight * (1 - pos.y);
    return `translate(${xPosInPX}px, ${yPosInPX}px)`;
  };

  const animateCursor = useCallback(() => {
    requestRef.current = requestAnimationFrame(animateCursor);
    if (!cursorRef.current) return;
    cursorRef.current.style.transform = buildTransform(mousePos.current);
  }, [mousePos]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateCursor);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animateCursor]);

  return (
    <CustomCursorWindowWrapper onMouseMove={updateMousePos}>
      <CustomCursorWrapper ref={cursorRef}>
        <CustomCursor />
      </CustomCursorWrapper>
    </CustomCursorWindowWrapper>
  );
};

export default CustomCursorWindow;
