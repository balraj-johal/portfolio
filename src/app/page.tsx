import { getContent } from "@/content/contentful";
import WebsitePendingSplash from "@/components/UI/WebsitePendingSplash";
import Title from "@/components/UI/Title";
import ProfessionalWorkPage from "@/components/UI/ProfessionalWorkPage";
import Hero from "@/components/UI/Hero";

import { MainTitle } from "./styles";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const professionalEntries = await getContent("professionalWork");

  return (
    <>
      {!searchParams.skip && <WebsitePendingSplash />}
      <Hero>
        <MainTitle>Balraj Johal</MainTitle>
      </Hero>
      <ProfessionalWorkPage content={professionalEntries} />
      <Hero>
        <Title>Another test div</Title>
      </Hero>
    </>
  );
}
