import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const PreloaderWrapper = styled("div", {
  css: css.PreloaderWrapper,
});

export const PreloaderImage = styled(motion.img, {
  css: css.PreloaderImage,
});
