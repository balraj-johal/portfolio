import { createClient } from "contentful";

import { CONTENT_TYPE } from "@/types/generated/contentful";

if (!process.env.CONTENTFUL_ACCESS_TOKEN) throw Error("No contentful token");
if (!process.env.CONTENTFUL_SPACE_ID) throw Error("No contentful space ID");

const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.CONTENTFUL_SPACE_ID,
});

export const getContentByType = async (type: CONTENT_TYPE) => {
  const response = await client.getEntries({
    content_type: type,
    include: 2,
  });

  return response.items;
};

export const getContentByID = async (id: string) => {
  const response = await client.getEntries({
    "sys.id": id,
    include: 2,
  });

  return response.items;
};
