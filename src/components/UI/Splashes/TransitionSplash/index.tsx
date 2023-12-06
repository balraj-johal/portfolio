"use client";

import { useRef } from "react";

import dynamic from "next/dynamic";

import { useTransitionStore } from "@/stores/transitionStore";

import { useTransitionAnimation } from "./useTransitionAnimation";
import { TransitionSplashWrapper } from "./styles";

const BackgroundNoSSR = dynamic(() => import("../Background"), { ssr: false });

const TransitionSplash = () => {
  const transitionWrapperRef = useRef<HTMLDivElement>(null);

  const { transitioning, startTransition } = useTransitionStore();

  useTransitionAnimation(transitionWrapperRef);

  return (
    <>
      <TransitionSplashWrapper
        transitioning={transitioning}
        ref={transitionWrapperRef}
      />
      <button onClick={() => startTransition()}>start</button>
      <BackgroundNoSSR />
    </>
  );
};

export default TransitionSplash;
