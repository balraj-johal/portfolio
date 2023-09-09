import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const ImageContainer = styled("div", {
  css: css.ImageContainer,
  variants: {
    visible: {
      true: css.ImageContainer_Visible,
    },
  },
});

export const ImageStripWrapper = styled("div", {
  css: css.ImageStripWrapper,
});
