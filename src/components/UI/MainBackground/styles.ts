import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const MainBackgroundWrapper = styled("div", {
  css: css.MainBackgroundWrapper,
});

export const MainBackgroundFill = styled(motion.div, {
  css: css.MainBackgroundFill,
});
