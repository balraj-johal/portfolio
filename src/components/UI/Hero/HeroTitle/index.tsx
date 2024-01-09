"use client";

import { MutableRefObject, useRef } from "react";

import { useAnimationFrame } from "framer-motion";

import { EASE_IN_OUT_EXPO } from "@/theme/eases";

import { ClipPath } from "../HeroMedia";
import { HeroTitleElement, HeroTitleWrapper } from "./styles";

interface Props {
  masked?: boolean;
  mediaOffsetRef?: MutableRefObject<ClipPath>;
  counterXTranslation?: string;
  children?: React.ReactNode;
}

const DELAY = 0.4;

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
    <HeroTitleWrapper
      initial={{ y: "0.2em", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: DELAY, duration: 0.25, ease: EASE_IN_OUT_EXPO }}
      masked={masked}
      aria-hidden={masked}
    >
      <HeroTitleElement ref={elemRef}>{children}</HeroTitleElement>
    </HeroTitleWrapper>
  );
};

export default HeroTitle;
