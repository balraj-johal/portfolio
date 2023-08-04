import { ContentfulResponse, ContentfulImage } from "@/types/content";

export const findEntry = (items: ContentfulResponse, slug: string) => {
  for (const entry of items) {
    if (entry.fields.slug === slug) return entry;
  }
  return undefined;
};

export const getImageURL = (image: ContentfulImage) => {
  if (!image) return "";
  return `https:${image.fields.file.url}`;
};
