"use client";
import { useEffect, useMemo, useState } from "react";

import { validateResponse } from "@/utils/promises";
import { buildNextImageURL } from "@/utils/next";
import { getImageURL } from "@/utils/contentful";
import { CursorType } from "@/types/cursor";
import { ContentfulResponse, ProfessionalContentEntry } from "@/types/content";

import {
  ProfessionalEntryCardImage,
  ProfessionalEntryCardImageContainer,
  ProfessionalEntryCardLink,
  ProfessionalEntryCardOneLiner,
  ProfessionalEntryCardTitle,
  ProfessionalEntryCardWrapper,
} from "./styles";

interface Props {
  activeIndex: number;
  content: ContentfulResponse;
}

const ProfessionalEntryCard = ({ activeIndex, content }: Props) => {
  const [images, setImages] = useState<string[]>([]);

  // build object of promises to prefetch images for each content entry
  const imageFetches = useMemo(() => {
    console.log("building promises");
    const promises = [];
    for (const entry of content) {
      const fields = entry.fields as ProfessionalContentEntry;
      // // optimise image with next/image
      const imageURL = getImageURL(fields.image);
      const nextImageURL = buildNextImageURL({
        src: imageURL,
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
  }, [content]);

  // on render, fetch all these images to ensure they're
  // loaded when the user reaches the parent panel
  useEffect(() => {
    Promise.all(imageFetches).then((results: string[]) => {
      setImages(results);
    });
  }, [imageFetches]);

  // destructure content
  const visibleEntry = content[activeIndex]?.fields as ProfessionalContentEntry;
  if (!visibleEntry) return null;
  const { title, slug, oneLiner } = visibleEntry;
  const imageAlt = `Image of ${title}`;
  const linkHref = `/work/${slug}`;

  return (
    <ProfessionalEntryCardWrapper>
      <ProfessionalEntryCardTitle>{title}</ProfessionalEntryCardTitle>
      <ProfessionalEntryCardImageContainer>
        <ProfessionalEntryCardImage src={images[activeIndex]} alt={imageAlt} />
      </ProfessionalEntryCardImageContainer>
      <ProfessionalEntryCardOneLiner>{oneLiner}</ProfessionalEntryCardOneLiner>
      <ProfessionalEntryCardLink
        href={linkHref}
        data-cursor-type={CursorType.Link}
      >
        SEE MORE &gt;
      </ProfessionalEntryCardLink>
    </ProfessionalEntryCardWrapper>
  );
};

export default ProfessionalEntryCard;
