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

const isRouteValid = (slug: string) => {
  return !!getEntry(slug);
};

export async function generateMetadata({ params }: Props) {
  const entry = getEntry(params.slug);
  return { title: entry?.title };
}

export default function Work({ params }: Props) {
  const { slug } = params;
  if (!isRouteValid(slug)) notFound();

  return (
    <div>
      <Link href="/">Back</Link>
      <h1>{slug}</h1>
    </div>
  );
}
