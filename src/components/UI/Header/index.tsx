"use client";

import { useState } from "react";

import { useLenis } from "@studio-freight/react-lenis";

import { LenisScrollEvent } from "@/types/lenis";
// import { useApplicationState } from "@/contexts/applicationState";

import { ButtonAreaWrapper, HeaderWrapper } from "./styles";
import ScrollInidcator from "./ScrollIndicator";
import MenuToggle from "./MenuToggle";

const Header = () => {
  // const { headerVisible } = useApplicationState();
  const [scrolling, setScrolling] = useState(false);

  useLenis(({ velocity }: LenisScrollEvent) => {
    setScrolling(Math.abs(velocity) > 0.1);
  });

  return (
    <HeaderWrapper>
      <h2>&nbsp;</h2>
      <ButtonAreaWrapper>
        <MenuToggle visible={!scrolling} />
        <ScrollInidcator visible={scrolling} />
      </ButtonAreaWrapper>
    </HeaderWrapper>
  );
};

export default Header;
