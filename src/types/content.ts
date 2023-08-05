import { Entry, EntrySkeletonType } from "contentful";

export type ProfessionalContentEntry = {
  slug: string;
  title: string;
  oneLiner: string;
  imageID: string;
  href: string;
  image: ContentfulImage;
};

export type ContentType = "professionalWork";

export type ContentfulImage = {
  fields: {
    file: {
      url: string;
    };
  };
};

export type ContentfulResponse = Entry<EntrySkeletonType, undefined, string>[];
