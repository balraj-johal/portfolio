"use client";

import { useEffect, useRef, useState } from "react";

import { AnimationSequence, animate } from "framer-motion";
import useWindowSize from "@buildinams/use-window-size";

import { EASE_IN_AND_TINY_OUT } from "@/theme/eases";
import useScrollLock from "@/hooks/useScrollLock";

import { StartupFill, StartupWrapper } from "./styles";

/** Duration of Startup animation sequence */
export const STARTUP_ANIM_DURATION = 1.0;

const Startup = () => {
  const [animating, setAnimating] = useState(true);
  const fillRef = useRef<HTMLDivElement>(null);
  const { height } = useWindowSize();
  const initalFillHeight = 2; // px
  const initalFillScale = initalFillHeight / height;

  useScrollLock(animating);

  useEffect(() => {
    if (!fillRef.current || !animating) return;

    const animationSequence: AnimationSequence = [
      [
        fillRef.current,
        { scaleX: 0, scaleY: initalFillScale },
        { duration: 0 },
      ],
      [fillRef.current, { scaleX: 1 }],
      [fillRef.current, { scaleX: 1, scaleY: 1 }, { delay: 0.2 }],
    ];

    animate(animationSequence, {
      defaultTransition: {
        delay: 0,
        duration: 0.4,
        ease: EASE_IN_AND_TINY_OUT,
      },
    }).then(() => setAnimating(false));
  }, [height, animating, initalFillScale]);

  return (
    <StartupWrapper aria-hidden>
      <StartupFill ref={fillRef} initial={{ scaleX: 0, scaleY: 0 }} />
    </StartupWrapper>
  );
};

export default Startup;
