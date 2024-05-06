import { FullHeightWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const FullHeight = ({ children, ...rest }: Props) => {
  return <FullHeightWrapper {...rest}>{children}</FullHeightWrapper>;
};

export default FullHeight;
