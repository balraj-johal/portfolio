import Image from "next/image";

import { ImageInfo } from "@/types/content";

import { BlogEntryHeroMediaWrapper } from "./styles";

interface Props {
  imageInfo?: ImageInfo;
  videoLink?: string;
}

const BlogEntryHeroMedia = async ({ imageInfo, videoLink }: Props) => {
  if (!imageInfo && !videoLink) return null;

  return (
    <BlogEntryHeroMediaWrapper>
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
