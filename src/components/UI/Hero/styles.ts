import { styled } from "@phntms/css-components";

import css from "./style.module.css";

export const HeroWrapper = styled("section", {
  css: css.HeroWrapper,
});

export const HeroSubContent = styled("div", {
  css: [css.HeroSubContent, "twelve-col-grid"],
});

export const HeroContentLeft = styled("p", {
  css: css.HeroContentLeft,
});

export const HeroContentRight = styled("p", {
  css: css.HeroContentRight,
});
