import { useState, useMemo, useEffect } from "react";

import { validateResponse } from "@/utils/promises";
import { buildNextImageURL } from "@/utils/next";

type PossibleImage = string | undefined;

/**
 * Prefetches images that have been optimised with the _next/image api
 * @param {string[]} sources - external image data URL's
 * @returns images: string[] - local blob URL's containing the fetched img data
 */
const usePrefetchedImages = (sources: string[]) => {
  const [images, setImages] = useState<PossibleImage[]>([]);

  // build object of promises to prefetch images for each content entry
  const imageFetches = useMemo(() => {
    const promises = [];
    for (const source of sources) {
      const nextImageURL = buildNextImageURL({
        src: source,
        width: 1920,
      });

      // get image as local blob URL
      const result = fetch("http://localhost:3000" + nextImageURL)
        .then(validateResponse)
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      // add to promises array
      promises.push(result);
    }
    return promises;
  }, [sources]);

  // on render, fetch all these images to ensure they're
  // loaded when the user reaches the parent panel
  useEffect(() => {
    Promise.all(imageFetches)
      .then((results: PossibleImage[]) => {
        setImages(results);
      })
      .catch((error) => console.error(error));
  }, [imageFetches]);

  return images;
};

export default usePrefetchedImages;
