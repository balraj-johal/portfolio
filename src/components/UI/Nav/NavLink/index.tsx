"use client";

import Lenis from "@studio-freight/lenis";
import { NavLinkElement } from "./styles";

interface Props {
  id: string;
}

const NavLink = ({ id }: Props) => {
  const lenis = new Lenis();
  const href = `#${id}`;

  return (
    <NavLinkElement href={href} onClick={() => lenis.scrollTo(href)}>
      {id}
    </NavLinkElement>
  );
};

export default NavLink;
