import { lazy } from "react";

import { notFound } from "next/navigation";
import { Metadata } from "next";

import { SearchParams } from "@/types/routing";
import { getContentByType } from "@/content/contentful";
import Hero from "@/components/Hero";

const LazyProfessionalWorkPage = lazy(
  () => import("@/components/ProfessionalWorkPage"),
);

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const professionalEntries = await getContentByType("professionalWork");

  if (!searchParams.skip) return notFound();

  return (
    <>
      <Hero />
      <LazyProfessionalWorkPage content={professionalEntries} />
    </>
  );
}
