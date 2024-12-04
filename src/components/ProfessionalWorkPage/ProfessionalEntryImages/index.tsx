import { useEffect, useState } from "react";

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
  const [loadImages, setLoadImages] = useState(false);
  const loadedImages = usePrefetchedImages(imageURLs, loadImages);
  const showLoader = loadedImages.length <= 0;

  // preload images when user scrolls at all
  useEffect(() => {
    const handleScroll = () => setLoadImages(true);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
