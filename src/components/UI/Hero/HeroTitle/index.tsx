"use client";

import { MutableRefObject, useRef } from "react";

import { useAnimationFrame } from "framer-motion";

import { EASE_IN_OUT_EXPO } from "@/theme/eases";

import { STARTUP_ANIM_DURATION } from "../../Startup";
import { HeroTitleElement, HeroTitleWrapper } from "./styles";

interface Props {
  masked?: boolean;
  maskOffsetRef?: MutableRefObject<number>;
  children?: React.ReactNode;
}

const DELAY = STARTUP_ANIM_DURATION + 0.4;

const HeroTitle = ({ masked, maskOffsetRef, children }: Props) => {
  const elemRef = useRef<HTMLHeadingElement>(null);
  const isMasked = !!maskOffsetRef;

  useAnimationFrame(() => {
    if (!isMasked || !elemRef.current) return;
    elemRef.current.style.clipPath = `inset(0% 0% calc(50% + ${maskOffsetRef.current}px) 0%)`;
  });

  return (
    <HeroTitleWrapper
      initial={{ y: "0.2em", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: DELAY, duration: 0.25, ease: EASE_IN_OUT_EXPO }}
      masked={masked}
    >
      <HeroTitleElement ref={elemRef}>{children}</HeroTitleElement>
    </HeroTitleWrapper>
  );
};

export default HeroTitle;
