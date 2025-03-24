"use client";

import { useRef } from "react";

import { useMediaQuery } from "usehooks-ts";
import { useLenis } from "lenis/react";

import { ImageInfo } from "@/types/contentful";
import { revealDown } from "@/theme/framer-configs";
import { EASE_IN_AND_TINY_OUT } from "@/theme/eases";
import { IS_MOBILE } from "@/config/mediaQueries";

import { HeroMediaWrapper } from "./styles";
import ImageStrip from "./ImageStrip";
import ImageCarousel from "./ImageCarousel";

interface Props {
  images: ImageInfo[];
}

export const MEDIA_PARALLAX_AMOUNT = 0.2;

const DESKTOP_DELAY = 0.1;
const MOBILE_DELAY = 0.2;

export interface ClipPath {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

const HeroMedia = ({ images }: Props) => {
  const mediaOffsetRef = useRef({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });
  const yTranslationRef = useRef(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(IS_MOBILE);

  useLenis(({ scroll }) => {
    window.requestAnimationFrame(() => {
      if (!mediaRef.current) return;

      const offsetY = scroll * MEDIA_PARALLAX_AMOUNT;
      mediaOffsetRef.current.bottom = offsetY;
      yTranslationRef.current = offsetY;
      mediaRef.current.style.transform = `translateY(-${offsetY}px)`;
    });
  });

  return (
    <>
      <HeroMediaWrapper
        ref={mediaRef}
        aria-hidden
        {...revealDown}
        transition={{
          delay: isMobile ? MOBILE_DELAY : DESKTOP_DELAY,
          ease: EASE_IN_AND_TINY_OUT,
          duration: 0.4,
        }}
      >
        {isMobile ? (
          <ImageCarousel images={images} />
        ) : (
          <ImageStrip
            images={images}
            mediaOffsetRef={mediaOffsetRef}
            yTranslationRef={yTranslationRef}
          />
        )}
      </HeroMediaWrapper>
    </>
  );
};

export default HeroMedia;
