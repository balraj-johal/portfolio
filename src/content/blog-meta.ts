import { BlogEntryMetadata } from "@/types/blog";

export const BLOG_ENTRIES: Record<string, BlogEntryMetadata> = {
  test: {
    slug: "test",
    title: "This is my first blog entry",
    heroImagePath: "/assets/images/blog/kixel.webp",
    datePublished: "11th May 2024",
    draft: true,
  },
};

export const BLOG_HAS_SOME_PUBLISHED_ENTRIES =
  Object.values(BLOG_ENTRIES).findIndex((entry) => !entry.draft) !== -1;
