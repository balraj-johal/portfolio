import Image from "next/image";
import { Node } from "@contentful/rich-text-types";

const RTEmbeddedAssetImage = ({ node }: { node: Node }) => (
  <Image
    src={`https://${node.data.target.fields.file.url}`}
    height={node.data.target.fields.file.details.image.height}
    width={node.data.target.fields.file.details.image.width}
    alt={node.data.target.fields.description}
  />
);

export default RTEmbeddedAssetImage;
