"use client";

import { MutableRefObject, useRef } from "react";

import { useMediaQuery } from "usehooks-ts";
import { useAnimationFrame } from "framer-motion";

import { EASE_IN_OUT_EXPO } from "@/theme/eases";
import { IS_MOBILE } from "@/config/mediaQueries";

import { ClipPath } from "../HeroMedia";
import { STARTUP_ANIM_DURATION } from "../../Startup";
import { HeroTitleElement, HeroTitleWrapper } from "./styles";

interface Props {
  masked?: boolean;
  maskOffsetRef?: MutableRefObject<ClipPath>;
  children?: React.ReactNode;
}

const DELAY = STARTUP_ANIM_DURATION + 0.4;

const HeroTitle = ({ masked, maskOffsetRef, children }: Props) => {
  const elemRef = useRef<HTMLHeadingElement>(null);
  const isMobile = useMediaQuery(IS_MOBILE);
  const isMasked = !!maskOffsetRef;

  useAnimationFrame(() => {
    if (!isMasked || !elemRef.current) return;
    const { right, bottom, left } = maskOffsetRef.current;
    // stop updating dom if it's already out of bounds
    if (bottom > 50) return;
    if (isMobile) {
      elemRef.current.style.clipPath = `inset(0% 0% calc(50% + ${bottom}px) 0%)`;
    } else {
      elemRef.current.style.clipPath = `inset(0% calc(100% - ${right}px) calc(50% + ${bottom}px) ${left}px)`;
    }
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
