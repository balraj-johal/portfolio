import { RootBodyElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const RootBody = ({ children }: Props) => {
  return <RootBodyElement>{children}</RootBodyElement>;
};

export default RootBody;
