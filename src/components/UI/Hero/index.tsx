import { getImagesInfo } from "@/utils/contentful";
import { getContent } from "@/content/contentful";

import {
  HeroContentLeft,
  HeroContentRight,
  HeroSubContent,
  HeroWrapper,
} from "./styles";
import HeroTitle from "./HeroTitle";
import HeroMedia from "./HeroMedia";

const Hero = async () => {
  const professionalEntries = await getContent("professionalWork");
  const images = getImagesInfo(professionalEntries);

  return (
    <HeroWrapper>
      <HeroMedia images={images} />
      <HeroTitle>Balraj Johal</HeroTitle>
      <HeroSubContent>
        <HeroContentLeft></HeroContentLeft>
        <HeroContentRight></HeroContentRight>
      </HeroSubContent>
    </HeroWrapper>
  );
};

export default Hero;
