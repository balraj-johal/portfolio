import { NavWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const Nav = ({ children, ...rest }: Props) => {
  return (
    <NavWrapper {...rest}>
      <span>boo</span>
      <span>boop</span>
      {children}
    </NavWrapper>
  );
};

export default Nav;
