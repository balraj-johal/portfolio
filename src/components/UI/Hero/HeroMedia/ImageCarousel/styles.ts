import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const ImageCarouselWrapper = styled(motion.div, {
  css: css.ImageCarouselWrapper,
});

export const ImageContainer = styled("div", {
  css: css.ImageContainer,
});
