"use client";

import { useEffect, useRef, forwardRef } from "react";

import { StickyContainerElement } from "./styles";

interface Props {
  numChildren: number;
  childHeight?: number;
  children: React.ReactNode;
}

const StickyContainer = forwardRef<HTMLDivElement, Props>(
  ({ numChildren, childHeight = 150, children }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>();

    return (
      <StickyContainerElement ref={ref}>{children}</StickyContainerElement>
    );
  },
);

StickyContainer.displayName = "StickyContainer";

export default StickyContainer;
