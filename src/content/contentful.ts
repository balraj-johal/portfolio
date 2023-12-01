import { Entry, EntrySkeletonType, createClient } from "contentful";

import { CONTENT_TYPE } from "@/types/generated/contentful";

if (!process.env.CONTENTFUL_ACCESS_TOKEN) throw Error("No contentful token");
if (!process.env.CONTENTFUL_SPACE_ID) throw Error("No contentful space ID");

const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.CONTENTFUL_SPACE_ID,
});

export const getContent = async (type: CONTENT_TYPE) => {
  const response = await client.getEntries({
    content_type: type,
  });

  return response.items;
};

export const getFields = <T>(
  item: Entry<EntrySkeletonType, undefined, string>,
) => {
  return item.fields as T;
};
