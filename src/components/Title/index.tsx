import { TitleElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Title = ({ children }: Props) => {
  return <TitleElement>{children}</TitleElement>;
};

export default Title;
