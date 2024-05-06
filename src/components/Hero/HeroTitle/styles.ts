import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const HeroTitleWrapper = styled("div", {
  css: css.HeroTitleWrapper,
  variants: {
    masked: {
      true: css.HeroTitleWrapper_Masked,
    },
  },
});

export const HeroTitleElement = styled("h1", {
  css: css.HeroTitleElement,
});
