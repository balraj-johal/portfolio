import { MainElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Main = ({ children, ...rest }: Props) => {
  return <MainElement {...rest}>{children}</MainElement>;
};

export default Main;
