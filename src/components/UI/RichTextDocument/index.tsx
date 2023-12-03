import { ReactNode } from "react";

import { Document, MARKS, BLOCKS, Node } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import RTMarkBold from "./Marks/RTMarkBold";
import RTEmbeddedAssetImage from "./Marks/RTEmbeddedAssetImage";
import RTBlockParagraph from "./Blocks/RTParagraph";

interface Props {
  document: Document;
}

type RTTextNode = string | undefined | ReactNode;

const renderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: RTTextNode) => <RTMarkBold>{text}</RTMarkBold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: Node, children: ReactNode) => (
      <RTBlockParagraph>{children}</RTBlockParagraph>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: Node) => (
      <RTEmbeddedAssetImage node={node} />
    ),
  },
  renderText: (text: string) => text.replace("!", "?"),
};

const RichTextDocument = ({ document }: Props) => {
  return documentToReactComponents(document, renderOptions);
};

export default RichTextDocument;
