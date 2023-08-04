import { createClient } from "contentful";

import { ContentType } from "@/types/content";

if (!process.env.CONTENTFUL_ACCESS_TOKEN) throw Error("No contentful token");
if (!process.env.CONTENTFUL_SPACE_ID) throw Error("No contentful space ID");

const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.CONTENTFUL_SPACE_ID,
});

export const getContent = async (type: ContentType) => {
  const response = await client.getEntries({
    content_type: type,
  });

  return response.items;
};
