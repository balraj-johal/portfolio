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
  const imageSRC = `/images/${content.imageID}.png`;
  const entryLinkHref = `/work/${content.slug}`;
  const entryLinkLabel = `link to ${content.title}`;

  return (
    <ProfessionalEntryWrapper>
      <ProfessionalEntryTitle>{content.title}</ProfessionalEntryTitle>
      <ProfessionalEntryOneLiner>{content.oneLiner}</ProfessionalEntryOneLiner>
      <ProfessionalEntryLink aria-label={entryLinkLabel} href={entryLinkHref}>
        <ProfessionalEntryImage src={imageSRC} />
      </ProfessionalEntryLink>
    </ProfessionalEntryWrapper>
  );
};

export default ProfessionalEntry;
