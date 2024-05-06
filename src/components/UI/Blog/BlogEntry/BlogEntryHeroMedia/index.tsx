import Image from "next/image";

import { ImageInfo } from "@/types/content";

import { BlogEntryHeroMediaWrapper } from "./styles";

interface Props {
  text: string;
  imageInfo?: ImageInfo;
  videoLink?: string;
}

const BlogEntryHeroMedia = async ({ text, imageInfo, videoLink }: Props) => {
  if (!imageInfo && !videoLink) return null;

  return (
    <BlogEntryHeroMediaWrapper>
      <h1 aria-hidden>{text}</h1>
      {imageInfo && (
        <Image
          src={imageInfo.url}
          alt={imageInfo.description}
          width={1920}
          height={1080}
        />
      )}
    </BlogEntryHeroMediaWrapper>
  );
};

export default BlogEntryHeroMedia;
