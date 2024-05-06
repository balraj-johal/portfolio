import { notFound } from "next/navigation";

import { getFields } from "@/utils/contentful";
import { SearchParams } from "@/types/routing";
import { IBlogFields, IBlogPageFields } from "@/types/generated/contentful";
import { getContentByType } from "@/content/contentful";
import BlogEntryLink from "@/components/Blog/BlogEntryLink";

import css from "./style.module.scss";

const PAGE_INFO_CONTENT_TYPE = "blogPage";
const ENTRIES_CONTENT_TYPE = "blog";

export async function generateMetadata() {
  return {
    title: "Blog | Balraj Johal",
    robots: {
      index: false,
    },
  };
}

const getPageInfo = async () => {
  const pageInfoEntries = await getContentByType(PAGE_INFO_CONTENT_TYPE);
  return getFields<IBlogPageFields>(pageInfoEntries[0]);
};

const getParsedEntryFields = async () => {
  const entries = await getContentByType(ENTRIES_CONTENT_TYPE);
  return entries.map((entry) => getFields<IBlogFields>(entry));
};

export default async function BlogEntries({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageInfo = await getPageInfo();
  const entries = await getParsedEntryFields();
  if (!pageInfo || !entries || !searchParams.skip) notFound();

  const { title } = pageInfo;

  return (
    <section className={css.BlogPostsWrapper}>
      <h1>{title}</h1>
      <div>
        {entries.map((entry) => (
          <BlogEntryLink key={entry.slug} slug={entry.slug} />
        ))}
      </div>
    </section>
  );
}
