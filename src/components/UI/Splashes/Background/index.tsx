"use client";

import { useRef } from "react";

import { createPortal } from "react-dom";

import { useBackground } from "./useBackground";
import { BackgroundWrapper } from "./styles";

const Background = () => {
  const transitionWrapperRef = useRef<HTMLDivElement>(null);

  useBackground(transitionWrapperRef);

  return (
    <>
      {createPortal(
        <BackgroundWrapper transitioning ref={transitionWrapperRef} />,
        document.body,
      )}
    </>
  );
};

export default Background;
