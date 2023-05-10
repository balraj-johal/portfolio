import { MyWorkWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const MyWork = ({ children }: Props) => {
  return <MyWorkWrapper>{children}</MyWorkWrapper>;
};

export default MyWork;
