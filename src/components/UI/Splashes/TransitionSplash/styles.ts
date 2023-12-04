import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const TransitionSplashWrapper = styled("div", {
  css: css.TransitionSplashWrapper,
  variants: {
    transitioning: {
      true: css.TransitionSplashWrapper_Transitioning,
    },
  },
});
