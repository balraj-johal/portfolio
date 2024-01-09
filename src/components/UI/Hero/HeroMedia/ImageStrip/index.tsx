"use client";

import { MutableRefObject, useEffect, useRef } from "react";

import { useAnimationFrame } from "framer-motion";

import { ImageInfo } from "@/types/content";

import HeroTitle from "../../HeroTitle";
import { ClipPath } from "..";
import { useImageStrip } from "./useImageStrip";
import { ImageContainer, ImageStripWrapper, StripImage } from "./styles";

const easeInCirc = (value: number) => {
  return 1 - Math.sqrt(1 - Math.pow(value, 2));
};

function easeOutExpo(value: number): number {
  return value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
}

interface Props {
  images: ImageInfo[];
  mediaOffsetRef: MutableRefObject<ClipPath>;
  yTranslationRef: MutableRefObject<number>;
}

const ImageStrip = ({ images, mediaOffsetRef, yTranslationRef }: Props) => {
  const maskedTitleRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const distanceToClosestIndexRef = useRef(0);

  const { activeIndex, containerLeftPositions, imageWidth } = useImageStrip({
    count: images.length,
    scale: 2, // horizontal scale factor
    padding: 16,
    distanceToClosestIndexRef,
  });

  const clampedStart = activeIndex === 0;
  const clampedEnd = activeIndex === images.length - 1;

  useEffect(() => {
    if (!mediaOffsetRef.current) return;
    const left = containerLeftPositions[activeIndex];
    const right = left + imageWidth;

    mediaOffsetRef.current.left = left;
    mediaOffsetRef.current.right = right;
  }, [
    activeIndex,
    containerLeftPositions,
    imageWidth,
    mediaOffsetRef,
    yTranslationRef,
  ]);

  useAnimationFrame(() => {
    if (maskedTitleRef.current) {
      maskedTitleRef.current.style.transform = `translateY(${yTranslationRef.current}px)`;
    }

    if (
      !!distanceToClosestIndexRef &&
      imageContainerRef.current &&
      maskedTitleRef.current
    ) {
      const sign = distanceToClosestIndexRef.current < 0 ? -1 : 1;
      const horizontalTranslaton =
        sign * easeInCirc(Math.abs(distanceToClosestIndexRef.current) * 2) * 50;

      let imageContainerTransform = "";
      let maskedTitleXTransform = "";

      if (distanceToClosestIndexRef.current > 0) {
        if (!clampedEnd) {
          imageContainerTransform = `translateX(${horizontalTranslaton}px)`;
          maskedTitleXTransform = `translateX(-${horizontalTranslaton}px)`;
        } else {
          imageContainerTransform = `translateX(0px)`;
          maskedTitleXTransform = `translateX(0px)`;
        }
      } else {
        if (!clampedStart) {
          imageContainerTransform = `translateX(${horizontalTranslaton}px)`;
          maskedTitleXTransform = `translateX(${Math.abs(
            horizontalTranslaton
          )}px)`;
        } else {
          imageContainerTransform = `translateX(0px)`;
          maskedTitleXTransform = `translateX(0px)`;
        }
      }

      imageContainerRef.current.style.transform = imageContainerTransform;
      maskedTitleRef.current.style.transform = `${maskedTitleXTransform} translateY(${mediaOffsetRef.current.bottom}px)`;
    }
  });

  return (
    <ImageStripWrapper aria-hidden>
      <ImageContainer
        ref={imageContainerRef}
        style={{
          left: `${containerLeftPositions[activeIndex]}px`,
          width: imageWidth ? `${imageWidth}px` : "0px",
        }}
      >
        <div ref={maskedTitleRef} style={{ position: "relative", zIndex: 1 }}>
          <HeroTitle
            masked
            mediaOffsetRef={mediaOffsetRef}
            counterXTranslation={`${containerLeftPositions[activeIndex]}px`}
          >
            Balraj Johal
          </HeroTitle>
        </div>
        {images.map((image, i) => (
          <StripImage
            src={image.url}
            alt={image.description ?? ""}
            priority
            fill
            key={image.url}
            visible={activeIndex === i}
          />
        ))}
      </ImageContainer>
    </ImageStripWrapper>
  );
};

export default ImageStrip;
