import { notFound } from "next/navigation";

import { ContentEntry } from "@/types/content";
import { findEntry, getContent } from "@/content/contentful";
import TransitionLink from "@/components/UI/TransitionLink";
import Title from "@/components/UI/Title";
import Main from "@/components/UI/Main";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const entries = await getContent("professionalWork");
  return entries.map((entry) => ({
    slug: entry.fields.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const entries = await getContent("professionalWork");
  const entry = findEntry(entries, params.slug);
  return { title: entry?.fields.title };
}

export default async function Work({ params }: Props) {
  const entries = await getContent("professionalWork");
  const entry = findEntry(entries, params.slug);
  if (!entry) notFound();

  const { title, oneLiner } = entry.fields as ContentEntry;

  return (
    <Main>
      <TransitionLink href="/">Back</TransitionLink>
      <Title>{title}</Title>
      <p>{oneLiner}</p>
    </Main>
  );
}
