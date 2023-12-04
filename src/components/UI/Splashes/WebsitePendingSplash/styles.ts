import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const WebsitePendingSplashWrapper = styled("div", {
  css: css.WebsitePendingSplashWrapper,
  variants: {
    pending: {
      true: css.WebsitePendingSplashWrapper_Pending,
    },
  },
});
