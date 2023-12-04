import Link from "next/link";
import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const ListNavLinkElement = styled(Link, {
  css: css.ListNavLinkElement,
  variants: {
    active: {
      true: css.ListNavLinkElement_Active,
    },
  },
});
