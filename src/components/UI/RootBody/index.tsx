"use client";

import { Lenis as ReactLenis } from "@studio-freight/react-lenis";

import { RootBodyElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const RootBody = ({ children }: Props) => {
  return (
    <ReactLenis root>
      <RootBodyElement>{children}</RootBodyElement>
    </ReactLenis>
  );
};

export default RootBody;
