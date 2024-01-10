"use client";

import { useEffect, useState } from "react";

import { ImageInfo } from "@/types/content";

import { PreloaderImage, PreloaderWrapper } from "./styles";

type Props = {
  images: ImageInfo[];
};

const Preloader = ({ images }: Props) => {
  const [index, setIndex] = useState(0);
  const { url, description } = images[index];
  const progress = (index / images.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <PreloaderWrapper>
      <span>{progress}%</span>
      <PreloaderImage src={url} alt={description} />
    </PreloaderWrapper>
  );
};

export default Preloader;
