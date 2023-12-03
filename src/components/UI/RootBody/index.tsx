"use client";

import React, { useEffect } from "react";

import { useLenis, Lenis as ReactLenis } from "@studio-freight/react-lenis";

import { useApplicationState } from "@/contexts/applicationState";

import { RootBodyElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const RootBody = ({ children }: Props) => {
  const { transitioning } = useApplicationState();

  const lenis = useLenis();

  // reset scroll progress on any route change
  useEffect(() => {
    if (!lenis || !transitioning) return;

    const scrollToTopTimeout = setTimeout(() => {
      lenis.scrollTo(0, { immediate: true });
    }, 200);

    return () => {
      clearTimeout(scrollToTopTimeout);
    };
  }, [lenis, transitioning]);

  return (
    <ReactLenis root>
      <RootBodyElement>{children}</RootBodyElement>
    </ReactLenis>
  );
};

export default RootBody;
