"use client";

import { AnchorClickEvent } from "@/types/events";

import { ListNavLinkElement } from "./styles";

interface Props {
  id: string;
  index: number;
  snapToIndex: (index: number) => void;
  active: boolean;
  children: React.ReactNode;
}

const ListNavLink = ({ id, index, snapToIndex, active, children }: Props) => {
  const href = `#${id}`;

  const handleClick = (e: AnchorClickEvent) => {
    e.preventDefault();
    snapToIndex(index);
  };

  return (
    <ListNavLinkElement href={href} onClick={handleClick} active={active}>
      {children}
    </ListNavLinkElement>
  );
};

export default ListNavLink;
