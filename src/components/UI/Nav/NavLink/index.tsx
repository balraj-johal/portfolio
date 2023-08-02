"use client";

import { useLenis } from "@studio-freight/react-lenis";

import { NavLinkElement } from "./styles";

interface Props {
  id: string;
  children: React.ReactNode;
}

const NavLink = ({ id, children }: Props) => {
  const lenis = useLenis();
  const href = `#${id}`;

  return (
    <NavLinkElement href={href} onClick={() => lenis.scrollTo(href)}>
      {children}
    </NavLinkElement>
  );
};

export default NavLink;
