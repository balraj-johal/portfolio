import { CursorType } from "@/types/cursor";
import { ContentEntry } from "@/types/content";

import {
  ProfessionalEntryImage,
  ProfessionalEntryLink,
  ProfessionalEntryOneLiner,
  ProfessionalEntryTitle,
  ProfessionalEntryWrapper,
} from "./styles";

interface Props {
  children?: React.ReactNode;
  content: ContentEntry;
}

const ProfessionalEntry = ({ content }: Props) => {
  const { imageID, title, slug, oneLiner } = content;

  const imageSRC = `/images/${imageID}.png`;
  const imageAlt = `link to ${title}`;
  const linkHref = `/work/${slug}`;

  return (
    <ProfessionalEntryWrapper>
      <ProfessionalEntryTitle>{title}</ProfessionalEntryTitle>
      <ProfessionalEntryOneLiner>{oneLiner}</ProfessionalEntryOneLiner>
      <ProfessionalEntryLink href={linkHref} data-cursor-type={CursorType.Link}>
        <ProfessionalEntryImage src={imageSRC} alt={imageAlt} fill />
      </ProfessionalEntryLink>
    </ProfessionalEntryWrapper>
  );
};

export default ProfessionalEntry;
