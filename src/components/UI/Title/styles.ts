import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const HeadingOne = styled("h1", {
  css: [css.HeadingOne, "type-h1"],
});

export const Text = styled("span", {
  css: css.Text,
  variants: {
    animate: {
      true: css.Text_Animate,
    },
  },
});
