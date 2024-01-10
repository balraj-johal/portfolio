"use client";

import { useEffect, useRef, useState } from "react";

import { useAnimationFrame } from "framer-motion";

import { ImageInfo } from "@/types/content";
import useMousePosition from "@/hooks/useMousePosition";

import { PreloaderImage, PreloaderWrapper } from "./styles";

type Props = {
  images: ImageInfo[];
};

const Preloader = ({ images }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const mousePositionRef = useMousePosition(wrapperRef, "center-normalized");

  const [index, setIndex] = useState(0);
  const { url, description, id } = images[index];
  const progress = Math.floor((index * 100) / images.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  useAnimationFrame(() => {
    const { x, y } = mousePositionRef.current;

    imageRef.current?.style.setProperty("--mouse-x", `${x}px`);
    imageRef.current?.style.setProperty("--mouse-y", `${y}px`);
  });

  return (
    <PreloaderWrapper ref={wrapperRef}>
      <span>{progress}%</span>
      {/* <PreloaderImage key={id} src={url} alt={description} ref={imageRef} /> */}
    </PreloaderWrapper>
  );
};

export default Preloader;
