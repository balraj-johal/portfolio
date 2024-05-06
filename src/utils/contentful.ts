import { Entry, EntrySkeletonType } from "contentful";
import { Node } from "@contentful/rich-text-types";

import {
  ContentfulResponse,
  ContentfulImage,
  ImageInfo,
} from "@/types/contentful";

export const findEntryBySlug = (items: ContentfulResponse, slug: string) => {
  for (const entry of items) {
    if (entry.fields.slug === slug) return entry;
  }
  return undefined;
};

export const getImageInfo = (image: ContentfulImage): ImageInfo => {
  return {
    url: `https:${image.fields.file.url}`,
    title: image.fields.title,
    description: image.fields.desription,
    id: image.sys.id,
  };
};

export const getImagesInfo = (content: ContentfulResponse): ImageInfo[] => {
  const result = [];
  for (const entry of content) {
    const fields = entry.fields;
    const image = fields.image as ContentfulImage;
    const data: ImageInfo = getImageInfo(image);
    result.push(data);
  }
  return result;
};

export const getImageURLs = (content: ContentfulResponse) => {
  const URLs = [];
  for (const entry of content) {
    const fields = entry.fields;
    const image = fields.image as ContentfulImage;
    const imageURL = `https:${image.fields.file.url}`;
    if (imageURL) URLs.push(imageURL);
  }
  return URLs;
};

export const getFields = <T>(
  item: Entry<EntrySkeletonType, undefined, string>,
) => {
  return item.fields as T;
};

export const getEmbedItem = (node: Node) => {
  return node.data.target;
};
