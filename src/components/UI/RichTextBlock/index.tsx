import { TopLevelBlockEnum, TopLevelBlock } from "@contentful/rich-text-types";

// import { RichTextNodeType } from "@/types/content";

import RTParagraph from "./RTParagraph";

interface Props {
  block: TopLevelBlock;
}

const getBlock = (nodeType: TopLevelBlockEnum) => {
  switch (nodeType) {
    case "paragraph":
      return RTParagraph;

    default:
      return () => null;
  }
};

const RichTextBlock = ({ block }: Props) => {
  const Block = getBlock(block.nodeType);

  return <Block content={block.content} />;
};

export default RichTextBlock;
