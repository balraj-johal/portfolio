import { ReactNode } from "react";

import {
  Document,
  MARKS,
  BLOCKS,
  INLINES,
  Node,
} from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import { RTTextNode } from "@/types/content";

import { RichTextDocWrapper } from "./styles";
import RTMarkBold from "./Marks/RTMarkBold";
import RTEmbeddedEntry from "./Inlines/RTEmbeddedEntry";
import RTBlockParagraph from "./Blocks/RTParagraph";
import RTEmbeddedAssetImage from "./Blocks/RTEmbeddedAssetImage";

interface Props {
  document: Document;
}

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
    [INLINES.EMBEDDED_ENTRY]: (node: Node) => <RTEmbeddedEntry node={node} />,
  },
};

const RichTextDocument = ({ document }: Props) => (
  <RichTextDocWrapper>
    {documentToReactComponents(document, renderOptions)}
  </RichTextDocWrapper>
);

export default RichTextDocument;
