import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const StartupWrapper = styled("div", {
  css: css.StartupWrapper,
});

export const StartupFill = styled(motion.div, {
  css: css.StartupFill,
  variants: {
    stageOneDone: {
      true: css.StartupFill_StageOneDone,
    },
  },
});
