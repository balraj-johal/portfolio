import { ProfessionalContentEntry, ContentfulResponse } from "@/types/content";

import { NavWrapper } from "./styles";
import NavLink from "./NavLink";

interface Props {
  activeIndex: number;
  snapToIndex: (index: number) => void;
  content: ContentfulResponse;
}

const Nav = ({ activeIndex, snapToIndex, content, ...rest }: Props) => {
  return (
    <NavWrapper {...rest}>
      {content.map((entry, i) => {
        const fields = entry.fields as ProfessionalContentEntry;
        return (
          <NavLink
            id={fields.slug}
            key={entry.sys.id}
            snapToIndex={snapToIndex}
            active={activeIndex === i}
            index={i}
          >
            {fields.title}
          </NavLink>
        );
      })}
    </NavWrapper>
  );
};

export default Nav;
