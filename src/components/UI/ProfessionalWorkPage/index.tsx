"use client";

import { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { useLenis } from "@studio-freight/react-lenis";

import { extendedStyle } from "@/utils/css";
import { LenisScrollEvent } from "@/types/lenis";
import { ContentfulResponse } from "@/types/content";

import ListNav from "../ListNav";
import { ProfessionalWorkWrapper, StickyContainerElement } from "./styles";
import ProfessionalEntryCard from "./ProfessionalEntryCard";

interface Props {
  content: ContentfulResponse;
}

type ContainerData = {
  height: number;
  start: number;
  end: number;
};

const ProfessionalWorkPage = ({ content }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerDataRef = useRef<ContainerData | undefined>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateContainerData = () => {
      if (!containerRef.current) return;
      const { clientHeight, offsetTop } = containerRef.current;
      containerDataRef.current = {
        height: clientHeight,
        start: offsetTop,
        end: clientHeight,
      };
    };
    updateContainerData();

    window.addEventListener("resize", updateContainerData);

    return () => window.removeEventListener("resize", updateContainerData);
  }, [containerRef, content]);

  const lenis = useLenis(({ scroll }: LenisScrollEvent) => {
    if (!containerDataRef.current) return;
    const { start, end } = containerDataRef.current;
    let progress = gsap.utils.mapRange(start, end, 0, 1, scroll);
    progress = gsap.utils.clamp(0, 1, progress);
    const newIndex = Math.floor(progress * content.length);
    if (newIndex < content.length) setActiveIndex(newIndex);
  });

  const snapToIndex = (index: number) => {
    if (!containerRef.current || !containerDataRef.current || !lenis) return;
    const { start, height } = containerDataRef.current;
    const scrollTarget = start + (height * index) / content.length;
    lenis.scrollTo(scrollTarget, {
      lock: true,
      immediate: true,
    });
  };

  const style = extendedStyle({
    "--number-of-children": content.length.toString(),
    "--child-height": "125", // in vh/dvh
  });

  return (
    <StickyContainerElement ref={containerRef} style={style}>
      <ProfessionalWorkWrapper>
        <ListNav
          title="PROFESSIONAL WORK"
          content={content}
          activeIndex={activeIndex}
          snapToIndex={snapToIndex}
        />
        <ProfessionalEntryCard activeIndex={activeIndex} content={content} />
      </ProfessionalWorkWrapper>
    </StickyContainerElement>
  );
};

export default ProfessionalWorkPage;
