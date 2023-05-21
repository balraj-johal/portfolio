import { PROFRESSIONAL_ENTRIES } from "@/content/profressional";
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
  for (const entry of PROFRESSIONAL_ENTRIES) {
    if (entry.slug === slug) return true;
  }
  return false;
};

export default function Work({ params }: Props) {
  const { slug } = params;
  if (!isRouteValid(slug)) notFound();

  return <h1>{slug}</h1>;
}
