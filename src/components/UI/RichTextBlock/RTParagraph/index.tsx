import { Inline, Text, Block } from "@contentful/rich-text-types";

import RTText from "../RTText";

interface Props {
  content: Array<Inline | Text | Block>;
}

const RTParagraph = ({ content }: Props) => {
  return (
    <p>
      {content.map((element, i) => {
        if (element.nodeType !== "text") return null;
        return <RTText content={element} key={i} />;
      })}
    </p>
  );
};

export default RTParagraph;
