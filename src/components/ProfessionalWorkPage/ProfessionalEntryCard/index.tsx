import { useMemo } from "react";

import { getImageURLs } from "@/utils/contentful";
import { IProfessionalWorkFields } from "@/types/generated/contentful";
import { ContentfulResponse } from "@/types/contentful";

import ProfessionalEntryImages from "../ProfessionalEntryImages";
import {
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

  // destructure content
  const visibleEntry = content[activeIndex]
    ?.fields as unknown as IProfessionalWorkFields;
  if (!visibleEntry) return null;
  const { title, slug, oneLiner } = visibleEntry;
  const imageAlt = `Image of ${title}`;
  const linkHref = `/work/${slug}`;

  return (
    <ProfessionalEntryCardWrapper>
      <ProfessionalEntryCardTitle>{title}</ProfessionalEntryCardTitle>
      <ProfessionalEntryImages
        activeIndex={activeIndex}
        activeAlt={imageAlt}
        imageURLs={imageURLs}
      />
      <ProfessionalEntryCardOneLiner>{oneLiner}</ProfessionalEntryCardOneLiner>
      <ProfessionalEntryCardLink href={linkHref}>
        SEE MORE &gt;
      </ProfessionalEntryCardLink>
    </ProfessionalEntryCardWrapper>
  );
};

export default ProfessionalEntryCard;
