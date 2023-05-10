"use client";

import { useGradientConfig } from "@/contexts/gradient";
import Lenis from "@studio-freight/lenis";
import React, { useEffect } from "react";
import { RootBodyElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

type LenisScrollEvent = {
  velocity: number;
};

const RootBody = ({ children }: Props) => {
  const { setScrollDiff } = useGradientConfig();

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", (e: LenisScrollEvent) => setScrollDiff(e.velocity));

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const ANIM_FRAME_ID = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(ANIM_FRAME_ID);
    };
  }, [setScrollDiff]);

  return <RootBodyElement>{children}</RootBodyElement>;
};

export default RootBody;
