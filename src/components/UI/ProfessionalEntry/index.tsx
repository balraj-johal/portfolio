import {
  ProfessionalEntryImage,
  ProfessionalEntryImageWrapper,
  ProfessionalEntryOneLiner,
  ProfessionalEntryTitle,
  ProfessionalEntryWrapper,
  StickyWrapper,
} from "./styles";

export type Entry = {
  title: string;
  oneLiner: string;
  imageID: string;
};

interface Props {
  children?: React.ReactNode;
  content: Entry;
}

const ProfessionalEntry = ({ content }: Props) => {
  return (
    <StickyWrapper>
      <ProfessionalEntryWrapper>
        <ProfessionalEntryTitle>{content.title}</ProfessionalEntryTitle>
        <ProfessionalEntryOneLiner>
          {content.oneLiner}
        </ProfessionalEntryOneLiner>
        <ProfessionalEntryImageWrapper
          style={{
            background: `url("/images/${content.imageID}.png")`,
            backgroundSize: "cover",
          }}
        />
      </ProfessionalEntryWrapper>
    </StickyWrapper>
  );
};

export default ProfessionalEntry;
