import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const StartupWrapper = styled("div", {
  css: css.StartupWrapper,
});

export const StartupFill = styled("div", {
  css: css.StartupFill,
  variants: {
    stageOneDone: {
      true: css.StartupFill_StageOneDone,
    },
  },
});
