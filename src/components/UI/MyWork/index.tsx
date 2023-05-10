import Nav from "../Nav";
import { MyWorkWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const MyWork = ({ children }: Props) => {
  return (
    <MyWorkWrapper>
      <Nav />
      {children}
    </MyWorkWrapper>
  );
};

export default MyWork;
