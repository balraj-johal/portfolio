"use client";

import { useEffect, useMemo } from "react";

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
  const visibleEntry = content[activeIndex]?.fields as ProfessionalContentEntry;

  // build object of promises for all images
  const imageFetches = useMemo(() => {
    const promises = [];
    for (const entry of content) {
      const fields = entry.fields as ProfessionalContentEntry;
      const imageURL = getImageURL(fields.image);
      console.log("adding URL:", imageURL);
      promises.push(fetch(imageURL));
    }
    return promises;
  }, [content]);

  // on render, fetch all these images to ensure they're
  // loaded when the user reaches the parent panel
  useEffect(() => {
    Promise.all(imageFetches).then((results: unknown) => {
      console.log(results);
    });
  }, [imageFetches]);

  // destructure content
  if (!visibleEntry) return null;
  const { image, title, slug, oneLiner } = visibleEntry;
  const imageURL = getImageURL(image);
  const imageAlt = `Image of ${title}`;
  const linkHref = `/work/${slug}`;

  return (
    <ProfessionalEntryCardWrapper>
      <ProfessionalEntryCardTitle>{title}</ProfessionalEntryCardTitle>
      <ProfessionalEntryCardImageContainer>
        <ProfessionalEntryCardImage
          src={imageURL}
          alt={imageAlt}
          width={720}
          height={360}
        />
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
