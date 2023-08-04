"use client";

import { useState } from "react";

import { useLenis } from "@studio-freight/react-lenis";

import { CursorType } from "@/types/cursor";
import { ContentfulResponse, ProfessionalContentEntry } from "@/types/content";
import { getImageURL } from "@/content/contentful";

import {
  ProfessionalEntriesImage,
  ProfessionalEntriesLink,
  ProfessionalEntriesOneLiner,
  ProfessionalEntriesTitle,
  ProfessionalEntriesWrapper,
} from "./styles";

interface Props {
  children?: React.ReactNode;
  content: ContentfulResponse;
}

const ProfessionalEntries = ({ content }: Props) => {
  const [index, setIndex] = useState(0);
  const visibleEntry = content[index].fields as ProfessionalContentEntry;
  const { image, title, slug, oneLiner } = visibleEntry;

  const imageURL = getImageURL(image);
  const imageAlt = `link to ${title}`;
  const linkHref = `/work/${slug}`;

  useLenis();

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
