import { notFound } from "next/navigation";

import { findEntryBySlug } from "@/utils/contentful";
import { IProfessionalWorkFields } from "@/types/generated/contentful";
import { getContentByType } from "@/content/contentful";

interface Props {
  params: {
    slug: string;
  };
}

const CONTENT_TYPE = "professionalWork";

export async function generateMetadata({ params }: Props) {
  const entries = await getContentByType(CONTENT_TYPE);
  const entry = findEntryBySlug(entries, params.slug);
  return {
    title: entry?.fields.title,
    robots: {
      index: false,
    },
  };
}

export async function generateStaticParams() {
  const entries = await getContentByType(CONTENT_TYPE);
  return entries.map((entry) => ({
    slug: entry.fields.slug,
  }));
}

export default async function Work({ params }: Props) {
  const entries = await getContentByType(CONTENT_TYPE);
  const entry = findEntryBySlug(entries, params.slug);
  if (!entry) notFound();

  const { title, oneLiner } =
    entry.fields as unknown as IProfessionalWorkFields;

  return (
    <>
      <h1>{title}</h1>
      <p>{oneLiner}</p>
    </>
  );
}
