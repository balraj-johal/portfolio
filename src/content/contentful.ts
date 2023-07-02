import { createClient } from "contentful";

import { ContentType } from "@/types/content";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});

export const getContent = async (type: ContentType) => {
  const response = await client.getEntries({
    content_type: type,
  });

  return response.items;
};
