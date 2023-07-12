import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const WebsitePendingSplashWrapper = styled("div", {
  css: css.WebsitePendingSplashWrapper,
  variants: {
    pending: {
      true: css.WebsitePendingSplashWrapper_Pending,
    },
  },
});
