import { Node } from "@contentful/rich-text-types";

import { getEmbedItem } from "@/utils/contentful";
import { CONTENT_TYPE } from "@/types/generated/contentful";

import RTCodeBlock from "../RTCodeBlock";

const getEmbedComponent = (contentType: CONTENT_TYPE) => {
  switch (contentType) {
    case "codeBlock":
      return RTCodeBlock;
  }
};

const RTEmbeddedEntry = ({ node }: { node: Node }) => {
  const item = getEmbedItem(node);
  const type = item.sys.contentType.sys.id as CONTENT_TYPE;

  const Embed = getEmbedComponent(type);

  if (!Embed) return null;
  return <Embed fields={item.fields} />;
};

export default RTEmbeddedEntry;
