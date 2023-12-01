// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset, Entry } from "contentful";
import { Document } from "@contentful/rich-text-types";

export interface IBlogFields {
  /** Title */
  title: string;

  /** slug */
  slug: string;

  /** Content */
  content: Document;

  /** Hero Image */
  heroImage?: Asset | undefined;

  /** Hero Video Link */
  heroVideoLink?: string | undefined;
}

export interface IBlog extends Entry<IBlogFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "blog";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface ILandingPageContentFields {
  /** Name */
  name: string;

  /** Subtitle */
  subtitle?: string | undefined;

  /** Skills */
  skills?: string | undefined;
}

export interface ILandingPageContent extends Entry<ILandingPageContentFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "landingPageContent";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface IProfessionalWorkFields {
  /** Title */
  title: string;

  /** Slug */
  slug: string;

  /** Link to Work */
  linkToWork?: string | undefined;

  /** One Liner */
  oneLiner: string;

  /** Description */
  description: string;

  /** Image */
  image?: Asset | undefined;

  /** FWA Winner */
  fwaWinner?: boolean | undefined;
}

export interface IProfessionalWork extends Entry<IProfessionalWorkFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "professionalWork";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export type CONTENT_TYPE = "blog" | "landingPageContent" | "professionalWork";

export type IEntry = IBlog | ILandingPageContent | IProfessionalWork;

export type LOCALE_CODE = "en-US";

export type CONTENTFUL_DEFAULT_LOCALE_CODE = "en-US";