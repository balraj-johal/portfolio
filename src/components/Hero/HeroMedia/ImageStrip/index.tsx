"use client";

import { MutableRefObject, useEffect, useRef } from "react";

import { useAnimationFrame } from "framer-motion";

import { ImageInfo } from "@/types/contentful";

import HeroTitle from "../../HeroTitle";
import { useImageStrip } from "./useImageStrip";
import { ImageContainer, ImageStripWrapper, StripImage } from "./styles";
import { ClipPath } from "..";

const easeInCirc = (value: number) => {
  return 1 - Math.sqrt(1 - Math.pow(value, 2));
};

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

interface Props {
  images: ImageInfo[];
  mediaOffsetRef: MutableRefObject<ClipPath>;
  yTranslationRef: MutableRefObject<number>;
}

const getHorizTranslation = (distanceToClosest: number) => {
  const sign = distanceToClosest < 0 ? -1 : 1;
  return sign * easeInCirc(Math.abs(distanceToClosest) * 2) * 50;
};

const getHorizTranslationDamped = (distanceToClosest: number) => {
  const sign = distanceToClosest < 0 ? -1 : 1;
  return sign * easeOutCubic(Math.abs(distanceToClosest) * 2) * 4;
};

const ImageStrip = ({ images, mediaOffsetRef, yTranslationRef }: Props) => {
  const maskedTitleRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const distanceToClosestIndexRef = useRef(0);

  const { activeIndex, containerLeftPositions, imageWidth } = useImageStrip({
    count: images.length,
    scale: 2, // horizontal scale factor
    padding: 20,
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
      let imageContainerTransform = "";
      let maskedTitleXTransform = "";

      if (distanceToClosestIndexRef.current > 0) {
        if (!clampedEnd) {
          const translation = getHorizTranslation(
            distanceToClosestIndexRef.current,
          );
          imageContainerTransform = `translateX(${translation}px)`;
          maskedTitleXTransform = `translateX(-${translation}px)`;
        } else {
          const translation = getHorizTranslationDamped(
            distanceToClosestIndexRef.current,
          );
          imageContainerTransform = `translateX(${translation}px)`;
          maskedTitleXTransform = `translateX(-${translation}px)`;
        }
      } else {
        if (!clampedStart) {
          const translation = getHorizTranslation(
            distanceToClosestIndexRef.current,
          );
          imageContainerTransform = `translateX(${translation}px)`;
          maskedTitleXTransform = `translateX(${Math.abs(translation)}px)`;
        } else {
          const translation = getHorizTranslationDamped(
            distanceToClosestIndexRef.current,
          );
          imageContainerTransform = `translateX(${translation}px)`;
          maskedTitleXTransform = `translateX(${Math.abs(translation)}px)`;
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
