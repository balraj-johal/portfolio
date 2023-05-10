import { StyledH1, Text } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Title = ({ children }: Props) => {
  return (
    <StyledH1>
      <Text>{children}</Text>
    </StyledH1>
  );
};

export default Title;
