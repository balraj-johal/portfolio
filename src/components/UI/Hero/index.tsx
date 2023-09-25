import { getImagesInfo } from "@/utils/contentful";
import { getContent } from "@/content/contentful";

import { HeroWrapper } from "./styles";
import HeroTitle from "./HeroTitle";
import HeroMedia from "./HeroMedia";

const Hero = async () => {
  const professionalEntries = await getContent("professionalWork");
  const images = getImagesInfo(professionalEntries);

  return (
    <HeroWrapper>
      <HeroMedia images={images} />
      <HeroTitle>Balraj Johal</HeroTitle>
    </HeroWrapper>
  );
};

export default Hero;
