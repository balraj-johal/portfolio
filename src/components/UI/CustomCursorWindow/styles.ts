import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const CustomCursorWindowWrapper = styled("div", {
  css: css.CustomCursorWindowWrapper,
});

export const CustomCursorWrapper = styled("div", {
  css: css.CustomCursorWrapper,
});

export const CustomCursorElement = styled("div", {
  css: css.CustomCursorElement,
  variants: {
    type: {
      text: css.CustomCursorElement_Text,
      hidden: css.CustomCursorElement_Hidden,
    },
  },
});
