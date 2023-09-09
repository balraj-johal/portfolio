"use client";

import { useMediaQuery } from "usehooks-ts";

import { ImageInfo } from "@/types/content";
import { IS_DESKTOP } from "@/config/mediaQueries";

import ImageStrip from "../ImageStrip";
import ImageCarousel from "../ImageCarousel";
import { HeroMediaWrapper } from "./styles";

interface Props {
  images: ImageInfo[];
}

const HeroMedia = ({ images }: Props) => {
  const isDesktop = useMediaQuery(IS_DESKTOP);

  return (
    <HeroMediaWrapper aria-hidden>
      {isDesktop ? (
        <ImageStrip images={images} />
      ) : (
        <ImageCarousel images={images} />
      )}
    </HeroMediaWrapper>
  );
};

export default HeroMedia;
