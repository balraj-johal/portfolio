import { ContentEntry } from "@/types/content";
import { getContent } from "@/content/contentful";

import { MyWorkWrapper } from "./styles";
import ProfessionalEntryCard from "../ProfessionalEntryCard";

const MyWork = async () => {
  const content = await getContent("professionalWork");

  return (
    <MyWorkWrapper>
      {content.map((entry) => (
        <ProfessionalEntryCard
          content={entry.fields as ContentEntry}
          key={entry.sys.id}
        />
      ))}
    </MyWorkWrapper>
  );
};

export default MyWork;
