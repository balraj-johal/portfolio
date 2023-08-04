"use client";

import { useEffect, useRef } from "react";

import { StickyContainerElement } from "./styles";

interface Props {
  length: number;
  children: React.ReactNode;
}

const StickyContainer = ({ length, children }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /** Setting panel height via css variables to allow for two height property values,
   * one using dvh units, and a fallback using vh units, as React inline styles only
   * allow a single property assignment. */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    wrapper.style.setProperty("--number-of-panels", length.toString());
  }, [length]);

  return (
    <StickyContainerElement ref={wrapperRef}>{children}</StickyContainerElement>
  );
};

export default StickyContainer;
