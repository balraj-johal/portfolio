import { getImagesInfo } from "@/utils/contentful";
import { getContent } from "@/content/contentful";

import { HeroWrapper } from "./styles";
import ImageStrip from "./ImageStrip";

const Hero = async () => {
  const professionalEntries = await getContent("professionalWork");
  const images = getImagesInfo(professionalEntries);

  return (
    <HeroWrapper>
      <ImageStrip images={images} />
    </HeroWrapper>
  );
};

export default Hero;
