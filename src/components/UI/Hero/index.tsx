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
        <HeroContentLeft>
          Creative Developer <br />
          Currently{" "}
          <a href="https://phantom.land" target="_blank" rel="noreferrer">
            @Phantom
          </a>
        </HeroContentLeft>
        <HeroContentRight>
          1x awwwards honourable mention <br />
          1 x fwa site of the day <br />
          <br />
          <br />
          full stack <br />
          WEBGL <br />
          game dev <br />
          AR/VR <br />
          generative audio <br />
          3d modelling <br />
          REact/next.js <br />
        </HeroContentRight>
      </HeroSubContent>
    </HeroWrapper>
  );
};

export default Hero;
