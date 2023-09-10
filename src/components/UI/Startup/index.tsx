"use client";

import { useRef, useState, AnimationEvent } from "react";

import useScrollLock from "@/hooks/useScrollLock";

import { StartupFill, StartupWrapper } from "./styles";

/** Duration of Startup animation sequence */
export const STARTUP_ANIM_DURATION = 0.8;

const Startup = () => {
  const [animating, setAnimating] = useState(true);
  const fillRef = useRef<HTMLDivElement>(null);

  useScrollLock(animating);
  console.log("mount");

  return (
    <StartupWrapper aria-hidden>
      <StartupFill
        ref={fillRef}
        onAnimationEnd={(e: AnimationEvent) => {
          setAnimating(false);
          console.log(e);
        }}
      />
    </StartupWrapper>
  );
};

export default Startup;
