import { notFound } from "next/navigation";

import { findEntryBySlug, getFields } from "@/utils/contentful";
import { IBlogFields } from "@/types/generated/contentful";
import { getContentByType } from "@/content/contentful";
import BlogEntry from "@/components/UI/Blog/BlogEntry";

import { BlogPostBackLink, BlogPostWrapper } from "./styles";

interface Props {
  params: {
    slug: string;
  };
}

const CONTENT_TYPE = "blog";

const getEntries = async () => {
  return await getContentByType(CONTENT_TYPE);
};

export async function generateStaticParams() {
  const entries = await getEntries();
  return entries.map((entry) => ({
    slug: entry.fields.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const entries = await getEntries();
  const entryTitle = findEntryBySlug(entries, params.slug)?.fields.title;
  return { title: `${entryTitle} - Balraj Johal` };
}

export default async function BlogEntryPage({ params }: Props) {
  const entries = await getEntries();
  const entry = findEntryBySlug(entries, params.slug);
  if (!entry) notFound();

  const fields = getFields<IBlogFields>(entry);

  return (
    <BlogPostWrapper>
      <BlogPostBackLink href="/blog">Back</BlogPostBackLink>
      <BlogEntry content={fields} />
    </BlogPostWrapper>
  );
}
