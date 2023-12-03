import { Text } from "@contentful/rich-text-types";

import { RTTextSpan } from "../RTText/styles";

interface Props {
  content: Text;
}

const mappedMarks = (content: Text) => content.marks.map((mark) => mark.type);

const RTText = ({ content }: Props) => {
  const marks = mappedMarks(content);

  if (content.value === "") return null;
  return (
    <RTTextSpan
      className={`
      ${marks.includes("code") ? "code" : ""}
    `}
      // isCode={marks.includes("code")}
      isBold={marks.includes("bold")}
    >
      {content.value}
    </RTTextSpan>
  );
};

export default RTText;
