"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AnimationSequence, animate } from "framer-motion";
import useWindowSize from "@buildinams/use-window-size";

import { EASE_IN_AND_TINY_OUT } from "@/theme/eases";
import useScrollLock from "@/hooks/useScrollLock";

import { MainBackgroundFill, MainBackgroundWrapper } from "./styles";

/** Duration of MainBackground animation sequence */
export const MAIN_BG_ANIM_DURATION = 1.0;

const MainBackground = () => {
  const [animating, setAnimating] = useState(true);
  const fillRef = useRef<HTMLDivElement>(null);
  const { height } = useWindowSize();
  const initalFillHeight = 2; // px
  const initalFillScale = initalFillHeight / height;

  useScrollLock(animating);

  const handleAnimationComplete = useCallback(() => {
    setAnimating(false);
  }, []);

  useEffect(() => {
    if (!fillRef.current || !animating) return;

    const animationSequence: AnimationSequence = [
      [
        fillRef.current,
        { scaleX: 0, scaleY: initalFillScale },
        { duration: 0 },
      ],
      [fillRef.current, { scaleX: 1 }],
      [fillRef.current, { scaleX: 1, scaleY: 1 }],
    ];

    animate(animationSequence, {
      defaultTransition: {
        delay: 0.2,
        duration: 0.5,
        ease: EASE_IN_AND_TINY_OUT,
      },
    }).then(handleAnimationComplete);
  }, [handleAnimationComplete, height, animating, initalFillScale]);

  return (
    <MainBackgroundWrapper aria-hidden>
      <MainBackgroundFill
        ref={fillRef}
        initial={{ scaleX: 0, scaleY: 0 }}
        onAnimationComplete={handleAnimationComplete}
      />
    </MainBackgroundWrapper>
  );
};

export default MainBackground;
