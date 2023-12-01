import { Entry, EntrySkeletonType } from "contentful";

export type ContentfulImage = {
  fields: {
    file: {
      url: string;
    };
    title: string;
    desription: string;
  };
  sys: {
    id: string;
  };
};

export type ImageInfo = {
  url: string;
  title: string;
  description: string;
  id: string;
};

export type ContentfulResponse = Entry<EntrySkeletonType, undefined, string>[];
