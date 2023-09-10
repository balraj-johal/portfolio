import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const LoadingSplashWrapper = styled("div", {
  css: css.LoadingSplashWrapper,
  variants: {
    loading: {
      true: css.LoadingSplashWrapper_Loading,
    },
  },
});
