import { HeroWrapper, Subtitle } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const Hero = ({ children, ...rest }: Props) => {
  return (
    <HeroWrapper {...rest}>
      {children}
      <Subtitle>I do some things on the internet</Subtitle>
    </HeroWrapper>
  );
};

export default Hero;
