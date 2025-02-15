"use client";

import type { Asset, ChainModifiers } from "contentful";

interface Props {
  src: string;
  poster?: Asset<ChainModifiers, string>;
}

const MediaVideo = ({ src, poster }: Props) => {
  const posterUrl = poster?.fields.file
    ? `https:${poster?.fields.file.url}`
    : undefined;

  return (
    <video
      muted
      playsInline
      autoPlay
      loop
      poster={posterUrl}
      onLoadedData={(e) => {
        if (e.target instanceof HTMLElement) {
          e.target.dataset.loaded = "true";
        }
      }}
    >
      <source src={src}></source>
    </video>
  );
};

export default MediaVideo;
