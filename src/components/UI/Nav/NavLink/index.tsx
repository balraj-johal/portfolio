"use client";

import { useLenis } from "@studio-freight/react-lenis";
import { NavLinkElement } from "./styles";

interface Props {
  id: string;
}

const NavLink = ({ id }: Props) => {
  const lenis = useLenis();
  const href = `#${id}`;

  return (
    <NavLinkElement href={href} onClick={() => lenis.scrollTo(href)}>
      {id}
    </NavLinkElement>
  );
};

export default NavLink;
