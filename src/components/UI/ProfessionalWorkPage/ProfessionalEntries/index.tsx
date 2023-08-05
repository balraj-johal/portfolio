"use client";

import { getImageURL } from "@/utils/contentful";
import { CursorType } from "@/types/cursor";
import { ContentfulResponse, ProfessionalContentEntry } from "@/types/content";

import {
  ProfessionalEntriesImage,
  ProfessionalEntriesLink,
  ProfessionalEntriesOneLiner,
  ProfessionalEntriesTitle,
  ProfessionalEntriesWrapper,
} from "./styles";

interface Props {
  activeIndex: number;
  content: ContentfulResponse;
}

const ProfessionalEntries = ({ activeIndex, content }: Props) => {
  const visibleEntry = content[activeIndex]?.fields as ProfessionalContentEntry;
  if (!visibleEntry) return null;
  const { image, title, slug, oneLiner } = visibleEntry;

  const imageURL = getImageURL(image);
  const imageAlt = `link to ${title}`;
  const linkHref = `/work/${slug}`;

  return (
    <ProfessionalEntriesWrapper>
      <ProfessionalEntriesTitle>{title}</ProfessionalEntriesTitle>
      <ProfessionalEntriesOneLiner>{oneLiner}</ProfessionalEntriesOneLiner>
      <ProfessionalEntriesLink
        href={linkHref}
        data-cursor-type={CursorType.Link}
      >
        <ProfessionalEntriesImage src={imageURL} alt={imageAlt} fill />
      </ProfessionalEntriesLink>
    </ProfessionalEntriesWrapper>
  );
};

export default ProfessionalEntries;
