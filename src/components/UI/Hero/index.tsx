import { getImagesInfo } from "@/utils/contentful";
import { getContent } from "@/content/contentful";

import {
  HeroContentLeft,
  HeroSubContent,
  HeroWrapper,
  PhantomLink,
} from "./styles";
import HeroTitle from "./HeroTitle";
import HeroMedia from "./HeroMedia";
import HeroContentRight from "./HeroContentRight";

const rightText = [
  "1x awwwards honourable mention",
  "1x fwa site of the day",
  "",
  "",
  "full stack",
  "webgl",
  "game dev",
  "ar/vr",
  "generative audio",
  "3d modelling",
  "react/next.js",
];

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
          <br />
          Currently&nbsp;
          <PhantomLink
            href="https://phantom.land"
            target="_blank"
            rel="noreferrer"
          >
            @Phantom
          </PhantomLink>
        </HeroContentLeft>
        <HeroContentRight text={rightText} stagger={0.4} delay={1.2} />
      </HeroSubContent>
    </HeroWrapper>
  );
};

export default Hero;
