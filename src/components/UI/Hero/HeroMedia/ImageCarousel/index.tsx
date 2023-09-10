"use client";

import { useState, useEffect, useCallback } from "react";

import Image from "next/image";

import { ImageInfo } from "@/types/content";

import { ImageContainer, ImageCarouselWrapper } from "./styles";

interface Props {
  images: ImageInfo[];
  interval?: number;
}

const ImageCarousel = ({ images, interval = 3000 }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const firstImage = images[0];

  const transitionDuration = 0.6;

  // sets interval to increment active index
  useEffect(() => {
    const nextImageInterval = setInterval(() => {
      const nextIndex = activeIndex + 1;
      if (nextIndex <= images.length) {
        setActiveIndex(nextIndex);
      } else {
        setActiveIndex(0);
      }
    }, interval);

    return () => clearInterval(nextImageInterval);
  }, [activeIndex, images.length, interval]);

  // snaps carousel back to first image, faking infinite loop
  const handleAnimationComplete = useCallback(() => {
    if (activeIndex === images.length) setActiveIndex(0);
  }, [activeIndex, images.length]);

  return (
    <ImageCarouselWrapper
      aria-hidden
      initial={{ x: 0 }}
      animate={{ x: `-${activeIndex * 100}%` }}
      // transitions normally for all indexes but the last, to fake infinite loop
      transition={{ duration: activeIndex === 0 ? 0 : transitionDuration }}
      onAnimationComplete={handleAnimationComplete}
    >
      {images.map((image) => (
        <ImageContainer key={image.id}>
          <Image src={image.url} alt={image.description ?? ""} priority fill />
        </ImageContainer>
      ))}
      {/* duplicate first image, again to fake loop */}
      <ImageContainer>
        <Image
          src={firstImage.url}
          alt={firstImage.description}
          priority
          fill
        />
      </ImageContainer>
    </ImageCarouselWrapper>
  );
};

export default ImageCarousel;
