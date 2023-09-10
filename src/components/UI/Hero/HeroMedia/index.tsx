"use client";

import { useMediaQuery } from "usehooks-ts";

import { ImageInfo } from "@/types/content";
import { EASE_IN_OUT_EXPO } from "@/theme/eases";
import { IS_MOBILE } from "@/config/mediaQueries";
import { STARTUP_ANIM_DURATION } from "@/components/UI/Startup";

import { HeroMediaWrapper } from "./styles";
import ImageStrip from "./ImageStrip";
import ImageCarousel from "./ImageCarousel";

interface Props {
  images: ImageInfo[];
}

const DELAY = STARTUP_ANIM_DURATION - 0.2;

const HeroMedia = ({ images }: Props) => {
  const isMobile = useMediaQuery(IS_MOBILE);

  return (
    <HeroMediaWrapper
      aria-hidden
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{
        delay: DELAY,
        ease: EASE_IN_OUT_EXPO,
        duration: 0.8,
      }}
    >
      {isMobile ? (
        <ImageCarousel images={images} />
      ) : (
        <ImageStrip images={images} />
      )}
    </HeroMediaWrapper>
  );
};

export default HeroMedia;
