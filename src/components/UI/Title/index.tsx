import { StyledH1, Text } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Title = ({ children }: Props) => {
  return (
    <div>
      <StyledH1>
        <Text animate>{children}</Text>
      </StyledH1>
    </div>
  );
};

export default Title;
