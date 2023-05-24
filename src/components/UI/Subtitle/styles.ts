import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const SubtitleElement = styled("span", {
  css: css.Subtitle,
  variants: {
    animate: {
      true: css.Subtitle_Animate,
    },
  },
});
