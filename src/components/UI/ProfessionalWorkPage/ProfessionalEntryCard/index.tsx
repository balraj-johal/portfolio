"use client";

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
