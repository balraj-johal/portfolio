import { SearchParams } from "@/types/routing";
import { getContent } from "@/content/contentful";
import Startup from "@/components/UI/Startup";
import WebsitePendingSplash from "@/components/UI/Splashes/WebsitePendingSplash";
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
      <Startup />
      <Hero />
      <ProfessionalWorkPage content={professionalEntries} />
      {!searchParams.skip && <WebsitePendingSplash />}
    </>
  );
}
