import { NavWrapper } from "./styles";
import NavLink from "./NavLink";

interface Props {
  children?: React.ReactNode;
}

const NAV_LINKS = ["work", "personal", "skills", "contact"];

const Nav = ({ children, ...rest }: Props) => {
  return (
    <NavWrapper {...rest}>
      {NAV_LINKS.map((link) => (
        <NavLink id={link} key={link} />
      ))}
      {children}
    </NavWrapper>
  );
};

export default Nav;
