import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const HeroTitleWrapper = styled(motion.div, {
  css: css.HeroTitleWrapper,
  variants: {
    masked: {
      true: css.HeroTitleWrapper_Masked,
    },
  },
});

export const HeroTitleElement = styled("h1", {
  css: css.HeroTitleElement,
});
