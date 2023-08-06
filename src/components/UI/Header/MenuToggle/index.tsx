"use client";

import { defaultTransition } from "@/theme/framer-configs";
import { useApplicationState } from "@/contexts/applicationState";

import { MenuToggleLine, MenuToggleSVG, MenuToggleWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
  visible?: boolean;
}

const MenuToggle = ({ visible, ...rest }: Props) => {
  const { menuOpen, setMenuOpen } = useApplicationState();

  return (
    <MenuToggleWrapper
      visible={visible}
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label={menuOpen ? "close menu" : "open menu"}
      {...rest}
    >
      <MenuToggleSVG
        viewBox="0 0 31 27"
        transition={defaultTransition}
        animate={{ scale: menuOpen ? 1.2 : 1 }}
      >
        <MenuToggleLine
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
        <MenuToggleLine
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
        <MenuToggleLine
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
        <MenuToggleLine
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
      </MenuToggleSVG>
    </MenuToggleWrapper>
  );
};

export default MenuToggle;
