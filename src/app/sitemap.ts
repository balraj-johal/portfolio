import { MetadataRoute } from "next";

import { BASE_DEPLOYED_URL } from "@/config/meta";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_DEPLOYED_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
