import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import { useMediaQuery } from "usehooks-ts";

import { MousePos } from "@/types/events";
import { CursorType } from "@/types/cursor";

const INITIAL_MOUSE_POS = { x: 0.5, y: 0.5 };

/** Handles states for a contextual custom cursor following the
 * mouse pointer on desktop views
 * @returns
 */
const useCustomCursor = (cursorRef: RefObject<HTMLDivElement>) => {
  const isDesktop = useMediaQuery("(pointer: fine) and (min-width: 768px)");
  const mousePos = useRef<MousePos>(INITIAL_MOUSE_POS);
  const animFrameRef = useRef<number>(0);
  const [cursorType, setCursorType] = useState<CursorType>(CursorType.Hidden);

  const getRelativeMousePos = (e: MouseEvent): MousePos => {
    return {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight,
    };
  };

  const checkParentsForCursorType = useCallback(
    (
      target: HTMLElement,
      remainingParentsToCheck = 3
    ): CursorType | undefined => {
      if (remainingParentsToCheck <= 0) return;
      const targetCursorType = target.dataset.cursorType as CursorType;
      if (targetCursorType) {
        return targetCursorType;
      }
      if (!target.offsetParent || !(target.offsetParent instanceof HTMLElement))
        return;
      return checkParentsForCursorType(
        target.offsetParent,
        remainingParentsToCheck - 1
      );
    },
    []
  );

  const updateMousePos = useCallback(
    (e: MouseEvent) => {
      mousePos.current = getRelativeMousePos(e);
      if (!(e.target instanceof HTMLElement)) return;
      const targetCursorType = checkParentsForCursorType(e.target);
      if (!targetCursorType) return setCursorType(CursorType.Hidden);
      if (cursorType !== targetCursorType) setCursorType(targetCursorType);
    },
    [checkParentsForCursorType, cursorType]
  );

  useEffect(() => {
    if (isDesktop) window.addEventListener("mousemove", updateMousePos);

    return () => {
      window.removeEventListener("mousemove", updateMousePos);
    };
  }, [updateMousePos, isDesktop]);

  const buildTransform = (pos: MousePos) => {
    const xPosInPX = window.innerWidth * pos.x;
    const yPosInPX = window.innerHeight * (1 - pos.y);
    return `translate(${xPosInPX}px, ${yPosInPX}px)`;
  };

  const animateCursor = useCallback(() => {
    animFrameRef.current = requestAnimationFrame(animateCursor);
    if (!cursorRef.current) return;
    cursorRef.current.style.transform = buildTransform(mousePos.current);
  }, [mousePos, cursorRef]);

  useEffect(() => {
    if (isDesktop) animFrameRef.current = requestAnimationFrame(animateCursor);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animateCursor, isDesktop]);

  useEffect(() => {
    if (cursorType === CursorType.Hidden) {
      document.body.style.removeProperty("cursor");
    } else {
      document.body.style.cursor = "none";
    }

    return () => {
      document.body.style.removeProperty("cursor");
    };
  }, [cursorType]);

  return {
    cursorType,
  };
};

export default useCustomCursor;
