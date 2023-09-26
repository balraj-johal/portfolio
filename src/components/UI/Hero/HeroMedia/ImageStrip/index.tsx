"use client";

import { MutableRefObject, useEffect } from "react";

import Image from "next/image";

import { ImageInfo } from "@/types/content";

import { ClipPath } from "..";
import { useImageStrip } from "./useImageStrip";
import { ImageContainer, ImageStripWrapper } from "./styles";

interface Props {
  images: ImageInfo[];
  maskOffsetRef: MutableRefObject<ClipPath>;
}

const ImageStrip = ({ images, maskOffsetRef }: Props) => {
  const { activeIndex, containerLeftPositions, imageWidth } = useImageStrip({
    count: images.length,
    scale: 2, // horizontal scale factor
  });

  useEffect(() => {
    if (!maskOffsetRef.current) return;
    const left = containerLeftPositions[activeIndex];
    const right = left + imageWidth;
    maskOffsetRef.current.left = left;
    maskOffsetRef.current.right = right;
    console.log(maskOffsetRef.current);
  }, [activeIndex, containerLeftPositions, imageWidth, maskOffsetRef]);

  return (
    <ImageStripWrapper aria-hidden>
      {images.map((image, i) => (
        <ImageContainer
          key={image.id}
          visible={activeIndex === i}
          style={{
            left: `${containerLeftPositions[i]}px` ?? "0px",
            width: imageWidth ? `${imageWidth}px` : "0px",
          }}
        >
          <Image src={image.url} alt={image.description ?? ""} priority fill />
        </ImageContainer>
      ))}
    </ImageStripWrapper>
  );
};

export default ImageStrip;
