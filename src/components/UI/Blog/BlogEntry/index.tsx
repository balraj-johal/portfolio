import { getImageInfo } from "@/utils/contentful";
import { IBlogFields } from "@/types/generated/contentful";
import { ContentfulImage } from "@/types/content";

import RichTextDocument from "../../RichTextDocument";
import BlogEntryHeroMedia from "./BlogEntryHeroMedia";

interface Props {
  content: IBlogFields;
}

const BlogEntry = async ({ content }: Props) => {
  if (!content) return null;

  const { title, heroImage, content: document } = content;

  const imageInfo = getImageInfo(heroImage as unknown as ContentfulImage);

  return (
    <>
      <h1>{title}</h1>
      <BlogEntryHeroMedia imageInfo={imageInfo} />
      <RichTextDocument document={document} />
    </>
  );
};

export default BlogEntry;
