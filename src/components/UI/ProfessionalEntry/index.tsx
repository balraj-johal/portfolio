import { ContentEntry } from "@/types/content";
import {
  ProfessionalEntryImageLink,
  ProfessionalEntryOneLiner,
  ProfessionalEntryTitle,
  ProfessionalEntryWrapper,
} from "./styles";

interface Props {
  children?: React.ReactNode;
  content: ContentEntry;
}

const ProfessionalEntry = ({ content }: Props) => {
  return (
    <ProfessionalEntryWrapper>
      <ProfessionalEntryTitle>{content.title}</ProfessionalEntryTitle>
      <ProfessionalEntryOneLiner>{content.oneLiner}</ProfessionalEntryOneLiner>
      <ProfessionalEntryImageLink
        aria-label={`link to ${content.title}`}
        href={content.href}
        style={{
          background: `url("/images/${content.imageID}.png")`,
          backgroundSize: "cover",
        }}
      ></ProfessionalEntryImageLink>
    </ProfessionalEntryWrapper>
  );
};

export default ProfessionalEntry;
