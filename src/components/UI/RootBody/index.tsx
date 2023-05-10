"use client";

import Lenis from "@studio-freight/lenis";
import React, { useEffect, UIEvent } from "react";
import { RootBodyElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const RootBody = ({ children }: Props) => {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", (e: UIEvent) => console.log(e, typeof e));

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const ANIM_FRAME_ID = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(ANIM_FRAME_ID);
    };
  }, []);

  return <RootBodyElement>{children}</RootBodyElement>;
};

export default RootBody;
