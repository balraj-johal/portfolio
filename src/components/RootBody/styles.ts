import { styled } from "@phntms/css-components";

import { FONT_CLASSES } from "@/theme/fonts/fonts";

import css from "./style.module.scss";

export const RootBodyElement = styled("body", {
  css: [css.RootBodyElement, FONT_CLASSES],
});
