import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const MainElement = styled("main", {
  css: css.MainElement,
  variants: {
    transitioning: {
      false: css.MainElement_Loaded,
    },
  },
});
