import React from "react";

import { SecondaryTitle } from "./styles";
import css from "./style.module.scss";

interface Props {
  title: string;
  heroMediaSlot: React.ReactNode;
  children: React.ReactNode;
  invertTitleColor?: boolean;
}

export default function BlogEntry({
  title,
  heroMediaSlot,
  children,
  invertTitleColor = true,
}: Props) {
  return (
    <article className={css.BlogPostWrapper}>
      <h1 className="heading-main">{title}</h1>
      <div className={css.BlogEntryHeroMediaWrapper}>
        <SecondaryTitle inverted={invertTitleColor} aria-hidden>
          {title}
        </SecondaryTitle>
        {heroMediaSlot}
      </div>
      <section className={css.BlogPostContent}>{children}</section>
    </article>
  );
}
