import { styled } from "@phntms/css-components";

import TransitionLink from "@/components/UI/TransitionLink";

import css from "./style.module.scss";

export const BlogPostWrapper = styled("section", {
  css: css.BlogPostWrapper,
});

export const BlogPostBackLink = styled(TransitionLink, {
  css: css.BlogPostBackLink,
});
