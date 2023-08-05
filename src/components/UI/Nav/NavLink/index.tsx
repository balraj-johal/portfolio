"use client";

import { AnchorClickEvent } from "@/types/events";

import { NavLinkElement } from "./styles";

interface Props {
  id: string;
  index: number;
  snapToIndex: (index: number) => void;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ id, index, snapToIndex, active, children }: Props) => {
  const href = `#${id}`;

  const handleClick = (e: AnchorClickEvent) => {
    e.preventDefault();
    snapToIndex(index);
  };

  return (
    <NavLinkElement href={href} onClick={handleClick} active={active}>
      {children}
    </NavLinkElement>
  );
};

export default NavLink;
