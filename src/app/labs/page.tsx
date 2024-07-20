import { notFound } from "next/navigation";

import { SearchParams } from "@/types/routing";
import BlogLinks from "@/components/Blog/BlogLinks";

import css from "./style.module.scss";

export async function generateMetadata() {
  return {
    title: "Blog | Balraj Johal",
    robots: {
      index: false,
    },
  };
}

export default async function BlogEntries({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!searchParams.secret) notFound();

  return (
    <section className={css.BlogPostsWrapper}>
      <h1 className="heading-main">Words</h1>
      <BlogLinks verbose />
    </section>
  );
}
