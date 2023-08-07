import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const MenuToggleWrapper = styled("button", {
  css: css.MenuToggleWrapper,
  variants: {
    visible: {
      false: css.MenuToggleWrapper_NotVisible,
    },
  },
});

export const MenuToggleSVG = styled(motion.svg, {
  css: css.MenuToggleSVG,
});

export const MenuToggleLine = styled(motion.line, {
  css: css.MenuToggleLine,
});
