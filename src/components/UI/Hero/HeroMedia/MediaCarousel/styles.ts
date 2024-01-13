import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const MediaCarouselWrapper = styled(motion.div, {
  css: css.MediaCarouselWrapper,
});

export const MediaContainer = styled("div", {
  css: css.MediaContainer,
});
