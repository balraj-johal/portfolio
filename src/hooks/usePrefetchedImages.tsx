import { useState, useEffect, useCallback } from "react";

import { validateResponse } from "@/utils/promises";
import { buildNextImageURL } from "@/utils/next";

type PossibleImage = string | undefined;

/**
 * Prefetches images that have been optimised with the _next/image api
 * @param {string[]} sources - external image data URL's
 * @param {boolean} [load] - if present, waits till load is true to fetch
 * @returns images: string[] - local blob URL's containing the fetched img data
 */
const usePrefetchedImages = (sources: string[], load?: boolean) => {
  const [images, setImages] = useState<PossibleImage[]>([]);

  // build object of promises to prefetch images for each content entry
  const getImageFetches = useCallback(() => {
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
        .then((blob) => {
          console.log("blobbed");
          return URL.createObjectURL(blob);
        })
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
    if (load === undefined || load === true) {
      Promise.all(getImageFetches())
        .then((results: PossibleImage[]) => {
          setImages(results);
          console.log("loaded");
        })
        .catch((error) => console.error(error));
    }
  }, [getImageFetches, load]);

  return images;
};

export default usePrefetchedImages;
