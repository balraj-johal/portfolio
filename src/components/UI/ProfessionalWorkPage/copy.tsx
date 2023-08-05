"use client";

import { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { useLenis } from "@studio-freight/react-lenis";

import { ContentfulResponse } from "@/types/content";

import Nav from "../Nav";
import { StickyContainerElement } from "./styles";
import ProfessionalEntries from "./ProfessionalEntries";

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
  const [containerData, setContainerData] = useState<
    ContainerData | undefined
  >();
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollFraction = 1 / content.length;

  useEffect(() => {
    const updateContainerData = () => {
      console.log("no works");
      if (!containerRef.current) return;
      const containerData = {
        height: containerRef.current.clientHeight,
        start: containerRef.current.offsetTop,
        end: containerRef.current.clientHeight,
      };
      console.log("setting data", containerData);
      setContainerData(containerData);
    };
    updateContainerData();

    window.addEventListener("resize", updateContainerData);

    return () => window.removeEventListener("resize", updateContainerData);
  }, [containerRef]);

  const lenis = useLenis(({ scroll }: { scroll: number }) => {
    if (!containerData) return;
    const { start, end } = containerData;
    let progress = gsap.utils.mapRange(start, end, 0, 1, scroll);
    progress = gsap.utils.clamp(0, 1, progress);
    setActiveIndex(Math.floor(progress / scrollFraction));
  });

  /** Setting panel height via css variables to allow for two height property values,
   * one using dvh units, and a fallback using vh units, as React inline styles only
   * allow a single property assignment. */
  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper) return;
    wrapper.style.setProperty(
      "--number-of-children",
      content.length.toString(),
    );
    wrapper.style.setProperty("--child-height", "150");
  }, [content, containerRef]);

  const snapToIndex = (index: number) => {
    if (!containerRef.current || !containerData || !lenis) return;
    const scrollTarget =
      containerData.start + containerData.height * index * scrollFraction;
    lenis.scrollTo(scrollTarget, {
      lock: true,
      immediate: true,
    });
  };

  return (
    <StickyContainerElement ref={containerRef}>
      <Nav
        content={content}
        activeIndex={activeIndex}
        snapToIndex={snapToIndex}
      />
      <ProfessionalEntries activeIndex={activeIndex} content={content} />
    </StickyContainerElement>
  );
};

export default ProfessionalWorkPage;
