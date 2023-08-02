import { CursorType } from "@/types/cursor";
import { ProfessionalContentEntry } from "@/types/content";
import { getImageURL } from "@/content/contentful";

import {
  ProfessionalEntryImage,
  ProfessionalEntryLink,
  ProfessionalEntryOneLiner,
  ProfessionalEntryTitle,
  ProfessionalEntryWrapper,
} from "./styles";

interface Props {
  children?: React.ReactNode;
  content: ProfessionalContentEntry;
}

const ProfessionalEntry = ({ content }: Props) => {
  const { image, title, slug, oneLiner } = content;

  const imageURL = getImageURL(image);
  const imageAlt = `link to ${title}`;
  const linkHref = `/work/${slug}`;

  return (
    <ProfessionalEntryWrapper>
      <ProfessionalEntryTitle>{title}</ProfessionalEntryTitle>
      <ProfessionalEntryOneLiner>{oneLiner}</ProfessionalEntryOneLiner>
      <ProfessionalEntryLink href={linkHref} data-cursor-type={CursorType.Link}>
        <ProfessionalEntryImage src={imageURL} alt={imageAlt} fill />
      </ProfessionalEntryLink>
    </ProfessionalEntryWrapper>
  );
};

export default ProfessionalEntry;
