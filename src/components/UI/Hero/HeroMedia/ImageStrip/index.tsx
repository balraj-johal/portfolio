"use client";

import Image from "next/image";

import { ImageInfo } from "@/types/content";

import { useImageStrip } from "./useImageStrip";
import { ImageContainer, ImageStripWrapper } from "./styles";

interface Props {
  images: ImageInfo[];
}

const ImageStrip = ({ images }: Props) => {
  const { activeIndex, containerLeftPositions, imageWidth } = useImageStrip({
    count: images.length,
    scale: 2,
  });

  return (
    <ImageStripWrapper aria-hidden>
      {images.map((image, i) => (
        <ImageContainer
          key={image.id}
          visible={activeIndex === i}
          style={{
            left: containerLeftPositions[i] ?? "0px",
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
