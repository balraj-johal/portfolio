"use client";

import { useRef } from "react";

import { useBackground } from "./useBackground";
import { BackgroundWrapper } from "./styles";

const Background = () => {
  const transitionWrapperRef = useRef<HTMLDivElement>(null);

  useBackground(transitionWrapperRef);

  return <BackgroundWrapper transitioning ref={transitionWrapperRef} />;
};

export default Background;
