"use client";

import { defaultTransition } from "@/theme/franer-configs";
import { useApplicationState } from "@/contexts/applicationState";

import { HamburgerToggleLine, HamburgerToggleWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const HamburgerToggle = ({ ...rest }: Props) => {
  const { menuOpen, setMenuOpen } = useApplicationState();

  return (
    <HamburgerToggleWrapper
      onClick={() => setMenuOpen(!menuOpen)}
      viewBox="0 0 31 27"
      transition={defaultTransition}
      animate={{ scale: menuOpen ? 1.2 : 1 }}
      {...rest}
    >
      <HamburgerToggleLine
        transition={defaultTransition}
        animate={
          menuOpen
            ? {
                opacity: 0,
                translateY: "50%",
                scaleX: 0,
              }
            : {
                opacity: 1,
                translateY: 0,
                scaleX: 1,
              }
        }
        x1="31"
        y1="1.5"
        x2="3.05176e-05"
        y2="1.5"
      />
      <HamburgerToggleLine
        transition={defaultTransition}
        style={{ originX: "50%", originY: "50%" }}
        animate={
          menuOpen
            ? {
                rotate: -45,
                opacity: 1,
              }
            : {
                rotate: 0,
                opacity: 0,
              }
        }
        x1="31"
        y1="13.4998"
        x2="3.05176e-05"
        y2="13.4998"
      />
      <HamburgerToggleLine
        transition={defaultTransition}
        style={{ originX: "50%", originY: "50%" }}
        animate={
          menuOpen
            ? {
                rotate: 45,
              }
            : {
                rotate: 0,
              }
        }
        x1="31"
        y1="13.4998"
        x2="3.05176e-05"
        y2="13.4998"
      />
      <HamburgerToggleLine
        transition={defaultTransition}
        animate={
          menuOpen
            ? {
                opacity: 0,
                translateY: "-50%",
                scaleX: 0,
              }
            : {
                opacity: 1,
                translateY: 0,
                scaleX: 1,
              }
        }
        x1="31"
        y1="25.5"
        x2="3.05176e-05"
        y2="25.5"
      />
    </HamburgerToggleWrapper>
  );
};

export default HamburgerToggle;
