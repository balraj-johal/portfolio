import { notFound } from "next/navigation";

import { findEntry } from "@/utils/contentful";
import { IBlogFields } from "@/types/generated/contentful";
import { BlogPostEntry } from "@/types/content";
import { getContent } from "@/content/contentful";
import TransitionLink from "@/components/UI/TransitionLink";

import { BlogPostWrapper } from "./styles";

interface Props {
  params: {
    slug: string;
  };
}

const CONTENT_TYPE = "blog";

export async function generateStaticParams() {
  const entries = await getContent(CONTENT_TYPE);
  return entries.map((entry) => ({
    slug: entry.fields.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const entries = await getContent(CONTENT_TYPE);
  const entry = findEntry(entries, params.slug);
  return { title: entry?.fields.title };
}

export default async function BlogEntry({ params }: Props) {
  const entries = await getContent(CONTENT_TYPE);
  const entry = findEntry(entries, params.slug);
  if (!entry) notFound();

  const { title, content } = entry.fields as unknown as IBlogFields;
  console.log("content", content.content);

  return (
    <BlogPostWrapper>
      <TransitionLink href="/">Back</TransitionLink>
      <h1>{title}</h1>
    </BlogPostWrapper>
  );
}
