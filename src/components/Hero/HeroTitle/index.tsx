"use client";

import { MutableRefObject, useRef } from "react";

import { useAnimationFrame } from "motion/react";

import { ClipPath } from "../HeroMedia";
import { HeroTitleElement, HeroTitleWrapper } from "./styles";

interface Props {
  masked?: boolean;
  mediaOffsetRef?: MutableRefObject<ClipPath>;
  counterXTranslation?: string;
  children?: React.ReactNode;
}

const CLIP_PATH_UPDATE_LIMIT = 100;

const HeroTitle = ({
  masked,
  mediaOffsetRef,
  counterXTranslation,
  children,
}: Props) => {
  const elemRef = useRef<HTMLHeadingElement>(null);
  const isMasked = !!mediaOffsetRef;

  useAnimationFrame(() => {
    if (!isMasked || !elemRef.current) return;
    const { bottom } = mediaOffsetRef.current;

    // stop updating dom if it's already out of bounds
    if (bottom > CLIP_PATH_UPDATE_LIMIT) return;

    elemRef.current.style.transform = `translate(-${counterXTranslation}, -50%)`;
  });

  return (
    <HeroTitleWrapper masked={masked} aria-hidden={masked}>
      <HeroTitleElement ref={elemRef}>{children}</HeroTitleElement>
    </HeroTitleWrapper>
  );
};

export default HeroTitle;
