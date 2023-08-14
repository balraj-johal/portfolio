import { FULL_DEPLOYED_URL } from "@/config/vercel";

export const buildNextImageURL = ({
  src,
  width,
  quality = 75,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `${FULL_DEPLOYED_URL}/_next/image?url=${encodeURIComponent(
    src,
  )}&w=${width}&q=${quality}`;
};
