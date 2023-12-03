import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const RTTextSpan = styled("span", {
  css: css.RTTextSpan,
  variants: {
    isBold: {
      true: css.RTTextSpan_IsBold,
    },
  },
});
