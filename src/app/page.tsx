import { SearchParams } from "@/types/routing";
import { getContent } from "@/content/contentful";
import WebsitePendingSplash from "@/components/UI/WebsitePendingSplash";
import ProfessionalWorkPage from "@/components/UI/ProfessionalWorkPage";
import Hero from "@/components/UI/Hero";

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
      <ProfessionalWorkPage content={professionalEntries} />
    </>
  );
}
