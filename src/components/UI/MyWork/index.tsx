import { PROFRESSIONAL_ENTRIES } from "@/content/profressional";
import ProfessionalEntry from "../ProfessionalEntry";
import { MyWorkWrapper } from "./styles";

const MyWork = () => {
  return (
    <MyWorkWrapper>
      {PROFRESSIONAL_ENTRIES.map((entry) => (
        <ProfessionalEntry content={entry} key={entry.slug} />
      ))}
    </MyWorkWrapper>
  );
};

export default MyWork;
