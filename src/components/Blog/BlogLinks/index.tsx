import React from "react";

import { BLOG_ENTRIES } from "@/content/blog-meta";

import css from "./style.module.scss";

interface Props {
  verbose?: boolean;
}

export default function BlogLinks({ verbose }: Props) {
  return (
    <ol className={css.BlogLinks}>
      {Object.values(BLOG_ENTRIES).map(({ slug, title, datePublished }) => (
        <li key={slug}>
          <a href={`/blog/${slug}`}>
            {title} &gt;
            {verbose && <span>{datePublished}</span>}
          </a>
        </li>
      ))}
    </ol>
  );
}
