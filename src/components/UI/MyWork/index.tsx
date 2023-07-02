import { ContentEntry } from "@/types/content";
import { getContent } from "@/content/contentful";

import ProfessionalEntry from "../ProfessionalEntry";
import { MyWorkWrapper } from "./styles";

const MyWork = async () => {
  const content = await getContent("professionalWork");

  return (
    <MyWorkWrapper>
      {content.map((entry) => (
        <ProfessionalEntry
          content={entry.fields as ContentEntry}
          key={entry.sys.id}
        />
      ))}
    </MyWorkWrapper>
  );
};

export default MyWork;
