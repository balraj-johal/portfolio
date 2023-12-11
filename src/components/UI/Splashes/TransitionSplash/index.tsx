"use client";

import { useRef } from "react";

import { useTransitionStore } from "@/stores/transitionStore";

import { useTransitionAnimation } from "./useTransitionAnimation";
import { TransitionSplashWrapper } from "./styles";

const TransitionSplash = () => {
  const transitionWrapperRef = useRef<HTMLDivElement>(null);

  const { transitionOverlayVisible, startTransition, changeBgColor } =
    useTransitionStore();

  useTransitionAnimation(transitionWrapperRef);

  return (
    <>
      <TransitionSplashWrapper
        visible={transitionOverlayVisible}
        ref={transitionWrapperRef}
      />
      <button onClick={() => startTransition()}>start</button>
    </>
  );
};

export default TransitionSplash;
