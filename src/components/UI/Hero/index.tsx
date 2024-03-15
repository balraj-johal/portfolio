import { getImagesInfo } from "@/utils/contentful";
import { getContentByType } from "@/content/contentful";

// import Preloader from "../Preloader";
import {
  HeroContentLeft,
  HeroContentRight,
  HeroSubContent,
  HeroWrapper,
} from "./styles";
import HeroTitle from "./HeroTitle";
import HeroMedia from "./HeroMedia";

const Hero = async () => {
  const professionalEntries = await getContentByType("professionalWork");
  const images = getImagesInfo(professionalEntries);

  return (
    <HeroWrapper>
      {/* <Preloader /> */}
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
