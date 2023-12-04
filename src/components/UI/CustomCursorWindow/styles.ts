import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

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
      link: css.CustomCursorElement_Link,
      hidden: css.CustomCursorElement_Hidden,
    },
  },
});
