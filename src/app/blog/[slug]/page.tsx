import { notFound } from "next/navigation";

import { findEntryBySlug } from "@/utils/contentful";
import { IBlogFields } from "@/types/generated/contentful";
import { getContent, getFields } from "@/content/contentful";
import TransitionLink from "@/components/UI/TransitionLink";

import { BlogPostWrapper } from "./styles";

interface Props {
  params: {
    slug: string;
  };
}

const CONTENT_TYPE = "blog";

const getEntries = async () => {
  return await getContent(CONTENT_TYPE);
};

export async function generateStaticParams() {
  const entries = await getEntries();
  return entries.map((entry) => ({
    slug: entry.fields.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const entries = await getEntries();
  const entry = findEntryBySlug(entries, params.slug);
  return { title: entry?.fields.title };
}

export default async function BlogEntry({ params }: Props) {
  const entries = await getEntries();
  const entry = findEntryBySlug(entries, params.slug);
  if (!entry) notFound();

  const { title } = getFields<IBlogFields>(entry);

  return (
    <BlogPostWrapper>
      <TransitionLink href="/blog">Back</TransitionLink>
      <h1>{title}</h1>
    </BlogPostWrapper>
  );
}
