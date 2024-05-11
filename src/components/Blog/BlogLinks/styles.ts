import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const SecondaryTitle = styled("h1", {
  css: css.SecondaryTitle,
  variants: {
    inverted: {
      true: css.SecondaryTitle_Inverted,
    },
  },
});
