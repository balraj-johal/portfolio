import React from "react";

import { SecondaryTitle } from "./styles";
import css from "./style.module.scss";

interface Props {
  title: string;
  datePublished: string;
  heroMediaSlot: React.ReactNode;
  children: React.ReactNode;
  invertTitleColor?: boolean;
}

export default function BlogEntry({
  title,
  datePublished,
  heroMediaSlot,
  children,
  invertTitleColor = true,
}: Props) {
  return (
    <article className={css.BlogPostWrapper}>
      <section>
        <h1 className="heading-main">{title}</h1>
        <div className={css.BlogEntryHeroMediaWrapper}>
          <SecondaryTitle inverted={invertTitleColor} aria-hidden>
            {title}
          </SecondaryTitle>
          {heroMediaSlot}
        </div>
        <p className={css.PublishedOn}>
          <span className="visually-hidden">Published on:</span>
          <span>{datePublished}</span>
        </p>
      </section>
      <section className={css.BlogPostContent}>{children}</section>
    </article>
  );
}
