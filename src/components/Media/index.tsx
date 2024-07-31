import Image from "next/image";
import { AssetDetails, Asset, ChainModifiers } from "contentful";

const SUPPORTED_FILE_TYPES = ["mp4", "webm"];

const Media = ({
  content,
  first,
  poster,
}: {
  content: Asset<ChainModifiers, string>;
  first?: boolean;
  poster?: Asset<ChainModifiers, string>;
}) => {
  const file = content.fields.file;
  if (!file) throw new Error("No media file");

  const { url, details } = file;
  const preppedUrl = `https:${url}`;
  const preppedPoster = poster?.fields.file
    ? `https:${poster?.fields.file.url}`
    : undefined;

  const isVideo = !!SUPPORTED_FILE_TYPES.find((filetype) =>
    preppedUrl.includes(filetype),
  );

  if (isVideo) {
    return (
      <video muted playsInline autoPlay loop poster={preppedPoster}>
        <source src={preppedUrl}></source>
      </video>
    );
  }

  const imageDetails = (details as AssetDetails)?.image;
  if (imageDetails) {
    return (
      <Image
        src={preppedUrl}
        width={imageDetails.width}
        height={imageDetails.height}
        priority={first}
        alt=""
      />
    );
  } else {
    return <Image src={preppedUrl} alt="" fill priority={first} />;
  }
};

export default Media;
