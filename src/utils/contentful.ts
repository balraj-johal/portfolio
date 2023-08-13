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

export const getImageURLs = (content: ContentfulResponse) => {
  const URLs = [];
  for (const entry of content) {
    const fields = entry.fields;
    const contenfulImage = fields.image as ContentfulImage;
    const imageURL = getImageURL(contenfulImage);
    if (imageURL) URLs.push(imageURL);
  }
  return URLs;
};
