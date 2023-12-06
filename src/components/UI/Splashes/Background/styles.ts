import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const BackgroundWrapper = styled("div", {
  css: css.BackgroundWrapper,
  variants: {
    transitioning: {
      true: css.BackgroundWrapper_Transitioning,
    },
  },
});
