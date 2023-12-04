import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const ScrollIndicatorWrapper = styled("div", {
  css: css.ScrollIndicatorWrapper,
  variants: {
    visible: {
      false: css.ScrollIndicatorWrapper_NotVisible,
    },
  },
});
