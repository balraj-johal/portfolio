import { StyledH1 } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Title = ({ children }: Props) => {
  return <StyledH1>{children}</StyledH1>;
};

export default Title;
