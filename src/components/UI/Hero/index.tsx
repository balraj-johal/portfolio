import { HeroWrapper } from "./styles";
import ImageStrip from "./ImageStrip";

interface Props {
  imageURLs: string[];
}

const Hero = ({ imageURLs }: Props) => {
  return (
    <HeroWrapper>
      <ImageStrip imageURLs={imageURLs} />
    </HeroWrapper>
  );
};

export default Hero;
