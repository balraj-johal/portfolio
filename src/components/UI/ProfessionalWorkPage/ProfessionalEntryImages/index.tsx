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
  const loadedImages = usePrefetchedImages(imageURLs);
  const showLoader = loadedImages.length <= 0;

  return (
    <ProfessionalEntryCardImageContainer>
      {showLoader ? (
        <ProfessionalEntryCardImagePlaceholder>
          Loading
        </ProfessionalEntryCardImagePlaceholder>
      ) : (
        <ProfessionalEntryCardImage
          src={loadedImages[activeIndex]}
          alt={activeAlt}
        />
      )}
    </ProfessionalEntryCardImageContainer>
  );
};

export default ProfessionalEntryImages;
