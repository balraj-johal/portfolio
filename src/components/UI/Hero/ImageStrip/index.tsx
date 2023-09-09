"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import useWindowSize from "@buildinams/use-window-size";

import { ImageInfo } from "@/types/content";

import { ImageContainer, ImageStripWrapper } from "./styles";

interface Props {
  images: ImageInfo[];
}

const ImageStrip = ({ images }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const { width } = useWindowSize();

  const count = images.length;

  useEffect(() => {
    const base = width / count;
    setImageWidth(base * 1.5);
  }, [count, width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;
      const fr = width / count;
      setActiveIndex(Math.floor(clientX / fr));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [count, width]);

  const containerLeftPositions = images.map((_, i) => {
    const safeArea = width - imageWidth;
    const offset = safeArea / (count - 1);
    return `${offset * i}px`;
  });

  return (
    <ImageStripWrapper aria-hidden>
      {images.map((image, i) => (
        <ImageContainer
          key={image.id}
          visible={activeIndex === i}
          style={{
            left: containerLeftPositions[i],
            width: `${imageWidth}px`,
          }}
        >
          <Image src={image.url} alt={image.description} priority fill />
        </ImageContainer>
      ))}
    </ImageStripWrapper>
  );
};

export default ImageStrip;
