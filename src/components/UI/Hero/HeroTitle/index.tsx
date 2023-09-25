"use client";

import { EASE_IN_OUT_EXPO } from "@/theme/eases";

import { STARTUP_ANIM_DURATION } from "../../Startup";
import { HeroTitleElement, HeroTitleWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const DELAY = STARTUP_ANIM_DURATION + 0.4;

const HeroTitle = ({ children }: Props) => {
  return (
    <HeroTitleWrapper
      initial={{ y: "0.2em", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: DELAY, duration: 0.25, ease: EASE_IN_OUT_EXPO }}
    >
      <HeroTitleElement>{children}</HeroTitleElement>
    </HeroTitleWrapper>
  );
};

export default HeroTitle;
