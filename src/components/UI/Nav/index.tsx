import { Dispatch, SetStateAction } from "react";

import { ProfessionalContentEntry, ContentfulResponse } from "@/types/content";

import { NavWrapper } from "./styles";
import NavLink from "./NavLink";

interface Props {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  content: ContentfulResponse;
}

const Nav = ({ activeIndex, setActiveIndex, content, ...rest }: Props) => {
  return (
    <NavWrapper {...rest}>
      {content.map((entry, i) => {
        const fields = entry.fields as ProfessionalContentEntry;
        return (
          <NavLink
            id={fields.slug}
            key={entry.sys.id}
            setActiveIndex={setActiveIndex}
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
