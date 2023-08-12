import usePrefetchedImages from "@/hooks/usePrefetchedImages";

import {
  ProfessionalEntryCardImage,
  ProfessionalEntryCardImageContainer,
  ProfessionalEntryCardImagePlaceholder,
} from "./styles";

interface Props {
  activeIndex: number;
  activeAlt: string;
  imageURLs: string[];
}

const ProfessionalEntryImages = ({
  activeIndex,
  activeAlt,
  imageURLs,
}: Props) => {
  const images = usePrefetchedImages(imageURLs);

  return (
    <ProfessionalEntryCardImageContainer>
      {images.length > 0 ? (
        <ProfessionalEntryCardImage src={images[activeIndex]} alt={activeAlt} />
      ) : (
        <ProfessionalEntryCardImagePlaceholder>
          Loading
        </ProfessionalEntryCardImagePlaceholder>
      )}
    </ProfessionalEntryCardImageContainer>
  );
};

export default ProfessionalEntryImages;
