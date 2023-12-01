import { notFound } from "next/navigation";

import { findEntry } from "@/utils/contentful";
import { IProfessionalWorkFields } from "@/types/generated/contentful";
import { getContent } from "@/content/contentful";
import TransitionLink from "@/components/UI/TransitionLink";

interface Props {
  params: {
    slug: string;
  };
}

const CONTENT_TYPE = "professionalWork";

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

export default async function Work({ params }: Props) {
  const entries = await getContent(CONTENT_TYPE);
  const entry = findEntry(entries, params.slug);
  if (!entry) notFound();

  const { title, oneLiner } =
    entry.fields as unknown as IProfessionalWorkFields;

  return (
    <>
      <TransitionLink href="/">Back</TransitionLink>
      <h1>{title}</h1>
      <p>{oneLiner}</p>
    </>
  );
}
