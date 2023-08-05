import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const NavLinkElement = styled("a", {
  css: css.NavLinkElement,
  variants: {
    active: {
      true: css.NavLinkElement_Active,
    },
  },
});
