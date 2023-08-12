"use client";

import { useMemo } from "react";

import { getImageURLs } from "@/utils/contentful";
import { CursorType } from "@/types/cursor";
import { ContentfulResponse, ProfessionalContentEntry } from "@/types/content";
import usePrefetchedImages from "@/hooks/usePrefetchedImages";

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
  const imageURLs = useMemo(() => getImageURLs(content), [content]);
  const images = usePrefetchedImages(imageURLs);

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
