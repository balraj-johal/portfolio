import { getContent } from "@/content/contentful";

import StickyContainer from "../StickyContainer";
import Nav from "../Nav";
import ProfessionalEntries from "./ProfessionalEntries";

const ProfessionalWorkPage = async () => {
  const content = await getContent("professionalWork");

  return (
    <StickyContainer length={content.length}>
      <Nav content={content} />
      <ProfessionalEntries content={content} />
    </StickyContainer>
  );
};

export default ProfessionalWorkPage;
