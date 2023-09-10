"use client";

import { useRef, useState, AnimationEvent } from "react";

import useScrollLock from "@/hooks/useScrollLock";

import { StartupFill, StartupWrapper } from "./styles";

/** Duration of Startup animation sequence */
export const STARTUP_ANIM_DURATION = 0.8;

const Startup = () => {
  const [animating, setAnimating] = useState(true);
  const [stageOneDone, setStageOneDone] = useState(false);
  const fillRef = useRef<HTMLDivElement>(null);

  useScrollLock(animating);

  console.log("here");

  return (
    <StartupWrapper aria-hidden>
      <StartupFill
        ref={fillRef}
        stageOneDone={stageOneDone}
        onAnimationEnd={(e: AnimationEvent) => {
          // css anim complete
          if (e.animationName.includes("growOut")) return setStageOneDone(true);
          setAnimating(false);
        }}
      />
    </StartupWrapper>
  );
};

export default Startup;
