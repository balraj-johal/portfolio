import { findEntryBySlug } from "@/utils/contentful";
import { IBlogFields } from "@/types/generated/contentful";
import { getContent, getFields } from "@/content/contentful";

import { BlogEntryLinkWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
  slug: string;
}

const CONTENT_TYPE = "blog";

const getEntryContent = async (slug: string) => {
  const entries = await getContent(CONTENT_TYPE);
  const entry = findEntryBySlug(entries, slug);
  if (!entry) return;
  return getFields<IBlogFields>(entry);
};

const BlogEntryLink = async ({ slug }: Props) => {
  const content = await getEntryContent(slug);
  if (!content) return null;

  return (
    <BlogEntryLinkWrapper href={`blog/${slug}`}>
      {content.title}
    </BlogEntryLinkWrapper>
  );
};

export default BlogEntryLink;
