import { lazy } from "react";

import { SearchParams } from "@/types/routing";
import { getContentByType } from "@/content/contentful";
import WebsitePendingSplash from "@/components/UI/Splashes/WebsitePendingSplash";
import Hero from "@/components/UI/Hero";

const LazyProfessionalWorkPage = lazy(
  () => import("@/components/UI/ProfessionalWorkPage"),
);

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const professionalEntries = await getContentByType("professionalWork");

  return (
    <>
      <Hero />
      <LazyProfessionalWorkPage content={professionalEntries} />
      {!searchParams.skip && <WebsitePendingSplash />}
    </>
  );
}
