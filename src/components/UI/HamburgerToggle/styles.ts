import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const HamburgerToggleWrapper = styled(motion.svg, {
  css: css.HamburgerToggleWrapper,
});

export const HamburgerToggleLine = styled(motion.line, {
  css: css.HamburgerToggleLine,
});
