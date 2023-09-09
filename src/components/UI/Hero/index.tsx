import { getImagesInfo } from "@/utils/contentful";
import { getContent } from "@/content/contentful";

import { HeroWrapper } from "./styles";
import HeroMedia from "./HeroMedia";

const Hero = async () => {
  const professionalEntries = await getContent("professionalWork");
  const images = getImagesInfo(professionalEntries);

  return (
    <HeroWrapper>
      <HeroMedia images={images} />
    </HeroWrapper>
  );
};

export default Hero;
