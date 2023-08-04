"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";

import { ContentfulResponse } from "@/types/content";

import { StickyContainerElement } from "../StickyContainer/styles";
import Nav from "../Nav";
import ProfessionalEntries from "./ProfessionalEntries";

interface Props {
  content: ContentfulResponse;
}

const ProfessionalWorkPage = ({ content }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  useLenis(({ scroll }) => console.log(scroll));

  /** Setting panel height via css variables to allow for two height property values,
   * one using dvh units, and a fallback using vh units, as React inline styles only
   * allow a single property assignment. */
  useEffect(() => {
    const wrapper = containerRef.current;
    console.log(wrapper);
    if (!wrapper) return;
    wrapper.style.setProperty(
      "--number-of-children",
      content.length.toString(),
    );
    wrapper.style.setProperty("--child-height", "150");
  }, [content, containerRef]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log(latest);
    const fractional = 1 / (content.length + 1);
    const continuousIndex = latest / fractional;
    const newIndex = Math.floor(continuousIndex);
    if (newIndex < content.length) setActiveIndex(newIndex);
  });

  return (
    <StickyContainerElement ref={containerRef}>
      <Nav
        content={content}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <ProfessionalEntries activeIndex={activeIndex} content={content} />
    </StickyContainerElement>
  );
};

export default ProfessionalWorkPage;
