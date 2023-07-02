import { ContentEntry } from "@/types/content";
import { getContent } from "@/content/contentful";

import { MyWorkWrapper } from "./styles";
import ProfessionalEntry from "../ProfessionalEntry";

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
