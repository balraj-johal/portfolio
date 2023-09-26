"use client";

import { useRef } from "react";

import { useMediaQuery } from "usehooks-ts";
import { useLenis } from "@studio-freight/react-lenis";

import { ImageInfo } from "@/types/content";
import { revealDown } from "@/theme/framer-configs";
import { EASE_IN_AND_TINY_OUT } from "@/theme/eases";
import { IS_MOBILE } from "@/config/mediaQueries";
import { STARTUP_ANIM_DURATION } from "@/components/UI/Startup";

import HeroTitle from "../HeroTitle";
import { HeroMediaWrapper } from "./styles";
import ImageStrip from "./ImageStrip";
import ImageCarousel from "./ImageCarousel";

interface Props {
  images: ImageInfo[];
}

const DESKTOP_DELAY = STARTUP_ANIM_DURATION + 0.1;
const MOBILE_DELAY = STARTUP_ANIM_DURATION + 0.2;

const HeroMedia = ({ images }: Props) => {
  const maskOffsetRef = useRef(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(IS_MOBILE);

  useLenis(({ scroll }) => {
    if (!mediaRef.current) return;
    const offsetY = scroll * 0.1;
    maskOffsetRef.current = offsetY;
    mediaRef.current.style.transform = `translateY(-${offsetY}px)`;
  });

  return (
    <>
      <HeroTitle masked maskOffsetRef={maskOffsetRef}>
        Balraj Johal
      </HeroTitle>
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
          <ImageStrip images={images} />
        )}
      </HeroMediaWrapper>
    </>
  );
};

export default HeroMedia;
