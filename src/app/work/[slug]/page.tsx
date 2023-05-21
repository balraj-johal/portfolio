import Title from "@/components/UI/Title";
import { getEntry, PROFRESSIONAL_ENTRIES } from "@/content/profressional";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return PROFRESSIONAL_ENTRIES.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const entry = getEntry(params.slug);
  return { title: entry?.title };
}

export default function Work({ params }: Props) {
  const { slug } = params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  return (
    <div>
      <Link href="/">Back</Link>
      <Title>{entry.title}</Title>
    </div>
  );
}
