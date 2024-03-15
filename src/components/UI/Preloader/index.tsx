/* eslint-disable prettier/prettier */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PreloaderWrapper } from "./styles";

type Props = {
  sources?: HeroMedia[];
};

type HeroMedia = {
  url: string;
  type: "image" | "video";
};

const SOURCES: HeroMedia[] = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    type: "video",
  },
];

// // Let's create a video pre-cache and store all first segments of videos inside.
// window.caches.open("video-pre-cache").then((cache) => {
//   return Promise.all(VIDEO_URLS.map((url) => fetchAndCache(url, cache)));
// });

// const fetchAndCache = async (videoUrl: string, cache: Cache) => {
//   // Check first if video is in the cache.
//   return cache.match(videoUrl).then((cacheResponse) => {
//     // Let's return cached response if video is already in the cache.
//     if (cacheResponse) return cacheResponse;

//     // Otherwise, fetch the video from the network.
//     return fetch(videoUrl).then((networkResponse) => {
//       // Add the response to the cache and return network response in parallel.
//       cache.put(videoUrl, networkResponse.clone());
//       return networkResponse;
//     });
//   });
// };

const buildImageLoadPromise = (url: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = resolve;
    image.onerror = reject;
  });
};

const buildVideoLoadPromise = (url: string) => {
  return fetch(url);
};

const Preloader = ({ sources }: Props) => {
  console.log(sources);

  const [noOfLoadedPromises, setNoOfLoadedPromises] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const loadPromises = useMemo(() => {
    return SOURCES.map((source) => {
      if (source.type == "video") return buildVideoLoadPromise(source.url);
      return buildImageLoadPromise(source.url);
    });
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      return await Promise.allSettled(loadPromises).then(() =>
        setNoOfLoadedPromises((noOfLoadedPromises) => noOfLoadedPromises + 1)
      );
    };

    fetchMedia();
  }, [loadPromises]);

  const progress = (noOfLoadedPromises * 100) / loadPromises.length;

  return (
    <PreloaderWrapper ref={wrapperRef}>
      <span>{progress}%</span>
    </PreloaderWrapper>
  );
};

export default Preloader;
