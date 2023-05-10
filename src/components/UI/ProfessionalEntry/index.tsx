import {
  ProfessionalEntryImageLink,
  ProfessionalEntryOneLiner,
  ProfessionalEntryTitle,
  ProfessionalEntryWrapper,
} from "./styles";

export type Entry = {
  title: string;
  oneLiner: string;
  imageID: string;
  href: string;
};

interface Props {
  children?: React.ReactNode;
  content: Entry;
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
