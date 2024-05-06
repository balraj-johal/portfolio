import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

import { SearchParams } from "@/types/routing";
import BlogEntry from "@/components/Blog/BlogEntry";

const TITLE = "This is my first blog entry";
const HERO_IMAGE = "/assets/images/blog/kixel.webp";

export const metadata: Metadata = {
  title: `${TITLE} | Balraj Johal`,
  description: "Creative Developer | Based in London",
  openGraph: {
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
    locale: "en_GB",
  },
  robots: {
    index: false,
  },
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  if (!searchParams.skip) notFound();

  return (
    <BlogEntry
      title={TITLE}
      invertTitleColor={false}
      heroMediaSlot={<Image src={HERO_IMAGE} alt="" width={720} height={480} />}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </BlogEntry>
  );
}
