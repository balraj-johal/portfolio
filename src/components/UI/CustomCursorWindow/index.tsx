"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MousePos } from "@/types/events";
import { CursorType } from "@/types/cursor";

import {
  CustomCursorElement,
  CustomCursorWrapper,
  CustomCursorWindowWrapper,
} from "./styles";

const INITIAL_MOUSE_POS = { x: 0.5, y: 0.5 };

const CustomCursorWindow = () => {
  const mousePos = useRef<MousePos>(INITIAL_MOUSE_POS);
  const animFrameRef = useRef<number>(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<CursorType>(CursorType.Hidden);

  const getRelativeMousePos = (e: MouseEvent): MousePos => {
    return {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight,
    };
  };

  const updateMousePos = useCallback(
    (e: MouseEvent) => {
      mousePos.current = getRelativeMousePos(e);
      if (!(e.target instanceof HTMLElement)) return;
      const targetCursorType = e.target.dataset.cursorType;
      let newCursorType = CursorType.Hidden;
      switch (targetCursorType) {
        case CursorType.Text:
          newCursorType = CursorType.Text;
          break;
        default:
          break;
      }
      if (cursorType !== newCursorType) setCursorType(newCursorType);
    },
    [cursorType]
  );

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePos);

    return () => {
      window.removeEventListener("mousemove", updateMousePos);
    };
  }, [updateMousePos]);

  const buildTransform = (pos: MousePos) => {
    const xPosInPX = window.innerWidth * pos.x;
    const yPosInPX = window.innerHeight * (1 - pos.y);
    return `translate(${xPosInPX}px, ${yPosInPX}px)`;
  };

  const animateCursor = useCallback(() => {
    animFrameRef.current = requestAnimationFrame(animateCursor);
    if (!cursorRef.current) return;
    cursorRef.current.style.transform = buildTransform(mousePos.current);
  }, [mousePos]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animateCursor);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animateCursor]);

  return (
    <CustomCursorWindowWrapper>
      <CustomCursorWrapper ref={cursorRef}>
        <CustomCursorElement type={cursorType} />
      </CustomCursorWrapper>
    </CustomCursorWindowWrapper>
  );
};

export default CustomCursorWindow;
