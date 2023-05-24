import { HeroWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const Hero = ({ children, ...rest }: Props) => {
  return <HeroWrapper {...rest}>{children}</HeroWrapper>;
};

export default Hero;
