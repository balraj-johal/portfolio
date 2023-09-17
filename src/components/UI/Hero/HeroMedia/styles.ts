import { motion } from "framer-motion";
import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const HeroMediaWrapper = styled(motion.div, {
  css: [css.HeroMediaWrapper, "no-highlight"],
});
