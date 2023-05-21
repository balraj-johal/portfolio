import Title from "@/components/UI/Title";
import TransitionLink from "@/components/UI/TransitionLink";
import { getEntry, PROFRESSIONAL_ENTRIES } from "@/content/professional";
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
      <TransitionLink href="/">Back</TransitionLink>
      <Title>{entry.title}</Title>
    </div>
  );
}
