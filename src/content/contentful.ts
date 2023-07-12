import { Entry, EntrySkeletonType, createClient } from "contentful";

import { ContentType, ContentfulImage } from "@/types/content";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});

export const getContent = async (type: ContentType) => {
  const response = await client.getEntries({
    content_type: type,
  });

  return response.items;
};

export const findEntry = (
  items: Entry<EntrySkeletonType, undefined, string>[],
  slug: string
) => {
  for (const entry of items) {
    if (entry.fields.slug === slug) return entry;
  }
  return undefined;
};

export const getImageURL = (image: ContentfulImage) => {
  if (!image) return "";
  return `https:${image.fields.file.url}`;
};
