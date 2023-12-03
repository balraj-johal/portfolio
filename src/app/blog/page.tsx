import { notFound } from "next/navigation";

import { getFields } from "@/utils/contentful";
import { IBlogFields, IBlogPageFields } from "@/types/generated/contentful";
import { getContentByType } from "@/content/contentful";
import TransitionLink from "@/components/UI/TransitionLink";
import BlogEntryLink from "@/components/UI/Blog/BlogEntryLink";

import { BlogPostsWrapper } from "./styles";

const PAGE_INFO_CONTENT_TYPE = "blogPage";
const ENTRIES_CONTENT_TYPE = "blog";

const getPageInfo = async () => {
  const pageInfoEntries = await getContentByType(PAGE_INFO_CONTENT_TYPE);
  return getFields<IBlogPageFields>(pageInfoEntries[0]);
};

const getParsedEntryFields = async () => {
  const entries = await getContentByType(ENTRIES_CONTENT_TYPE);
  return entries.map((entry) => getFields<IBlogFields>(entry));
};

export async function generateMetadata() {
  const pageInfo = await getPageInfo();
  return { title: pageInfo?.metaTitle };
}

export default async function BlogEntries() {
  const pageInfo = await getPageInfo();
  const entries = await getParsedEntryFields();
  if (!pageInfo || !entries) notFound();

  const { title } = pageInfo;

  return (
    <BlogPostsWrapper>
      <TransitionLink href="/">Back</TransitionLink>
      <h1>{title}</h1>
      <div>
        {entries.map((entry) => (
          <BlogEntryLink key={entry.slug} slug={entry.slug} />
        ))}
      </div>
    </BlogPostsWrapper>
  );
}
