import { useState, useMemo, useEffect } from "react";

import { validateResponse } from "@/utils/promises";
import { buildNextImageURL } from "@/utils/next";

/**
 * Prefetches images that have been optimised with the _next/image api
 * @param {string[]} sources - external image data URL's
 * @returns images: string[] - local blob URL's containing the fetched img data
 */
const usePrefetchedImages = (sources: string[]) => {
  const [images, setImages] = useState<string[]>([]);

  // build object of promises to prefetch images for each content entry
  const imageFetches = useMemo(() => {
    const promises = [];
    for (const source of sources) {
      const nextImageURL = buildNextImageURL({
        src: source,
        width: 1920,
      });

      // get image as local blob URL
      const result = fetch(nextImageURL)
        .then(validateResponse)
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob));

      // add to promises array
      promises.push(result);
    }
    return promises;
  }, [sources]);

  // on render, fetch all these images to ensure they're
  // loaded when the user reaches the parent panel
  useEffect(() => {
    Promise.all(imageFetches).then((results: string[]) => {
      setImages(results);
    });
  }, [imageFetches]);

  return images;
};

export default usePrefetchedImages;
