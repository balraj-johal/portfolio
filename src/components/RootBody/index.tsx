"use client";

import { ReactLenis } from "lenis/react";

import { RootBodyElement } from "./styles";

// const LENIS_OPTIONS =

interface Props {
  children: React.ReactNode;
}

const RootBody = ({ children }: Props) => {
  return (
    <ReactLenis
      root
      options={{
        easing: (time: number) => 1 - Math.pow(1 - time, 4),
        duration: 0.7,
      }}
    >
      <RootBodyElement>{children}</RootBodyElement>
    </ReactLenis>
  );
};

export default RootBody;
