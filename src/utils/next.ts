export const buildNextImageURL = ({
  src,
  width,
  quality = 75,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
};
