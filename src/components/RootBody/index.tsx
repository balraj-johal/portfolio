"use client";

import { Lenis as ReactLenis } from "@studio-freight/react-lenis";

import { RootBodyElement } from "./styles";

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
