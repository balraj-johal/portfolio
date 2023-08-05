"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { useLenis } from "@studio-freight/react-lenis";

import { LenisScrollEvent } from "@/types/lenis";
import { ContentfulResponse } from "@/types/content";

import Nav from "../Nav";
import { ProfessionalWorkWrapper, StickyContainerElement } from "./styles";
import ProfessionalEntries from "./ProfessionalEntries";

interface Props {
  content: ContentfulResponse;
}

type ContainerData = {
  height: number;
  start: number;
  end: number;
};

type CustomCSSProperties = {
  "--child-height": string;
  "--number-of-children": string;
};

type ExtendedCSSProperties = CSSProperties & CustomCSSProperties;

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
    setActiveIndex(Math.floor(progress * content.length));
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

  const style: ExtendedCSSProperties = {
    "--number-of-children": content.length.toString(),
    "--child-height": "150", // in vh/dvh
  };

  return (
    <StickyContainerElement ref={containerRef} style={style}>
      <ProfessionalWorkWrapper>
        <h1>PROFESSIONAL WORK</h1>
        <Nav
          content={content}
          activeIndex={activeIndex}
          snapToIndex={snapToIndex}
        />
        <ProfessionalEntries activeIndex={activeIndex} content={content} />
      </ProfessionalWorkWrapper>
    </StickyContainerElement>
  );
};

export default ProfessionalWorkPage;
