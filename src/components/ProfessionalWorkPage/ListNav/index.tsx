import { IProfessionalWorkFields } from "@/types/generated/contentful";
import { ContentfulResponse } from "@/types/contentful";

import { ListNavWrapper } from "./styles";
import ListNavLink from "./ListNavLink";

interface Props {
  activeIndex: number;
  snapToIndex: (index: number) => void;
  content: ContentfulResponse;
  title?: string;
}

const ListNav = ({
  activeIndex,
  snapToIndex,
  title,
  content,
  ...rest
}: Props) => {
  return (
    <ListNavWrapper {...rest}>
      {title && <h1>{title}</h1>}
      {content.map((entry, i) => {
        const fields = entry.fields as unknown as IProfessionalWorkFields;
        return (
          <ListNavLink
            id={fields.slug}
            key={entry.sys.id}
            snapToIndex={snapToIndex}
            active={activeIndex === i}
            index={i}
          >
            {fields.title}
          </ListNavLink>
        );
      })}
    </ListNavWrapper>
  );
};

export default ListNav;
