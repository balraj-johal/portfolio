"use client";

import { ImageInfo } from "@/types/content";

import { PreloaderImage, PreloaderWrapper } from "./styles";

type Props = {
  images: ImageInfo[];
};

const Preloader = ({ images }: Props) => {
  const firstImage = images[0];

  return (
    <PreloaderWrapper>
      <span>0%</span>
      <PreloaderImage src={firstImage.url} alt={firstImage.description} />
    </PreloaderWrapper>
  );
};

export default Preloader;
