"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import useWindowSize from "@buildinams/use-window-size";

import { ImageContainer, ImageStripWrapper } from "./styles";

interface Props {
  imageURLs: string[];
}

const ImageStrip = ({ imageURLs }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const { width } = useWindowSize();

  const count = imageURLs.length;

  useEffect(() => {
    const base = width / count;
    setImageWidth(base * 1.5);
  }, [count, width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;
      setActiveIndex(Math.floor(clientX / width / count));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [count, width]);

  const containerLeftPositions = imageURLs.map((_, i) => {
    const safeArea = width - imageWidth; // to account for left and right offset
    const offset = safeArea / (count - 1);
    return `${offset * i}px`;
  });

  return (
    <ImageStripWrapper aria-hidden>
      {imageURLs.map((url, i) => (
        <ImageContainer
          key={url}
          visible={activeIndex === i}
          style={{
            left: containerLeftPositions[i],
            width: `${imageWidth}px`,
          }}
        >
          <Image src={url} alt="" priority fill />
        </ImageContainer>
      ))}
    </ImageStripWrapper>
  );
};

export default ImageStrip;
