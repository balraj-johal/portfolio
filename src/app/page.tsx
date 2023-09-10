import { lazy } from "react";

import { SearchParams } from "@/types/routing";
import { getContent } from "@/content/contentful";
import Startup from "@/components/UI/Startup";
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
  const professionalEntries = await getContent("professionalWork");

  return (
    <>
      <Startup />
      <Hero />
      <LazyProfessionalWorkPage content={professionalEntries} />
      {!searchParams.skip && <WebsitePendingSplash />}
    </>
  );
}
