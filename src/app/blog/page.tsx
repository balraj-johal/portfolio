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

export default function BlogEntries() {
  return (
    <section className={css.BlogPostsWrapper}>
      <h1 className="heading-main">Words</h1>
      <BlogLinks verbose />
    </section>
  );
}
