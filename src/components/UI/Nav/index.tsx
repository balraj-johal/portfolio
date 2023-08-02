import { ProfessionalContentEntry, ContentfulResponse } from "@/types/content";

import { NavWrapper } from "./styles";
import NavLink from "./NavLink";

interface Props {
  content: ContentfulResponse;
}

const Nav = ({ content, ...rest }: Props) => {
  return (
    <NavWrapper {...rest}>
      {content.map((entry) => {
        const fields = entry.fields as ProfessionalContentEntry;
        return (
          <NavLink id={fields.slug} key={entry.sys.id}>
            {fields.title}
          </NavLink>
        );
      })}
    </NavWrapper>
  );
};

export default Nav;
