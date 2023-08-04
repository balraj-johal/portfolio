"use client";

import { Dispatch, SetStateAction } from "react";

import { AnchorClickEvent } from "@/types/events";

import { NavLinkElement } from "./styles";

interface Props {
  id: string;
  index: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ id, index, setActiveIndex, active, children }: Props) => {
  const href = `#${id}`;

  const handleClick = (e: AnchorClickEvent) => {
    e.preventDefault();
    setActiveIndex(index);
  };

  return (
    <NavLinkElement href={href} onClick={handleClick} active={active}>
      {children}
    </NavLinkElement>
  );
};

export default NavLink;
