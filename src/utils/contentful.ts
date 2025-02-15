import type { Entry, EntrySkeletonType } from "contentful";
import type { Node } from "@contentful/rich-text-types";

import type {
  IProfessionalWorkFields,
  IVideoFields,
} from "@/types/generated/contentful";
import type {
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

export function getMediaContent(fields: IProfessionalWorkFields) {
  const imageFields = fields.image?.fields;

  const heroVideoFields = fields.heroVideo?.fields as unknown as IVideoFields;
  const videoFields = heroVideoFields
    ? {
        width: heroVideoFields.width,
        height: heroVideoFields.height,
        ...heroVideoFields.file.fields,
      }
    : null;

  return videoFields ?? imageFields;
}
