import { SearchParams } from "@/types/routing";
import { getContent } from "@/content/contentful";
import Hero from "@/components/UI/Hero";

import WebsitePendingSplash from "@/components/UI/WebsitePendingSplash";
import ProfessionalWork from "@/components/UI/ProfessionalWork";

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const professionalEntries = await getContent("professionalWork");

  return (
    <>
      {!searchParams.skip && <WebsitePendingSplash />}
      <Hero />
      <ProfessionalWork content={professionalEntries} />
    </>
  );
}
