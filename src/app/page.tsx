import { getContent } from "@/content/contentful";
import WebsitePendingSplash from "@/components/UI/WebsitePendingSplash";
import Title from "@/components/UI/Title";
import Subtitle from "@/components/UI/Subtitle";
import ProfessionalWorkPage from "@/components/UI/ProfessionalWorkPage";
import Hero from "@/components/UI/Hero";

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
        <Title>Balraj Johal</Title>
        <Subtitle>I do some things on the internet</Subtitle>
      </Hero>
      <ProfessionalWorkPage content={professionalEntries} />
      <Hero>
        <Title>Another test div</Title>
      </Hero>
    </>
  );
}
