"use client";

import { useEffect, useMemo, useState } from "react";

import useWindowSize from "@buildinams/use-window-size";

interface Props {
  count: number;
  scale?: number;
}

export const useImageCarousel = ({ count, scale = 1 }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const { width } = useWindowSize();

  useEffect(() => {
    const base = width / count;
    setImageWidth(base * scale);
  }, [count, scale, width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;
      const fr = width / count;
      setActiveIndex(Math.floor(clientX / fr));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [count, width]);

  const containerLeftPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const safeArea = width - imageWidth;
      const offset = safeArea / (count - 1);
      console.log(offset * i);
      positions.push(`${offset * i}px`);
    }
    return positions;
  }, [count, imageWidth, width]);

  return {
    containerLeftPositions,
    activeIndex,
    imageWidth,
  };
};
