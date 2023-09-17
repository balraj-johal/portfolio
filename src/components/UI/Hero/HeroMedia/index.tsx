"use client";

import { useMediaQuery } from "usehooks-ts";

import { ImageInfo } from "@/types/content";
import { EASE_IN_AND_TINY_OUT } from "@/theme/eases";
import { IS_MOBILE } from "@/config/mediaQueries";
import { STARTUP_ANIM_DURATION } from "@/components/UI/Startup";

import { HeroMediaWrapper } from "./styles";
import ImageStrip from "./ImageStrip";
import ImageCarousel from "./ImageCarousel";

interface Props {
  images: ImageInfo[];
}

const DELAY = STARTUP_ANIM_DURATION + 0.1;

const HeroMedia = ({ images }: Props) => {
  const isMobile = useMediaQuery(IS_MOBILE);

  return (
    <HeroMediaWrapper
      aria-hidden
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{
        delay: DELAY,
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
  );
};

export default HeroMedia;
