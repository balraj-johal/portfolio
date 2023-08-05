import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const ListNavLinkElement = styled("a", {
  css: css.ListNavLinkElement,
  variants: {
    active: {
      true: css.ListNavLinkElement_Active,
    },
  },
});
