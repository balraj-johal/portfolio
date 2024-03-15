"use client";

import { MutableRefObject, useEffect, useMemo, useState } from "react";

import { flushSync } from "react-dom";
import useWindowSize from "@buildinams/use-window-size";

interface Props {
  count: number;
  padding?: number; // px
  scale?: number;
  distanceToClosestIndexRef?: MutableRefObject<number>;
}

export const useMediaStrip = ({
  count,
  padding = 0,
  scale = 1,
  distanceToClosestIndexRef,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const { width } = useWindowSize();

  useEffect(() => {
    const base = width / count;
    setImageWidth(base * scale);
  }, [count, scale, width]);

  useEffect(() => {
    const fr = width / count;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;

      const progress = clientX / fr;
      const activeIndex = Math.floor(progress);
      flushSync(() => setActiveIndex(activeIndex));

      if (!!distanceToClosestIndexRef) {
        const closenessToActiveIndex = (progress % 1) - 0.5;
        distanceToClosestIndexRef.current = closenessToActiveIndex;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [count, distanceToClosestIndexRef, width]);

  const containerLeftPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const safeArea = width - imageWidth - padding * 2;
      const offset = safeArea / (count - 1);
      positions.push(padding + offset * i);
    }
    return positions;
  }, [count, imageWidth, padding, width]);

  return {
    containerLeftPositions,
    activeIndex,
    imageWidth,
  };
};
