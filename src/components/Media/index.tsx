import type {
  AssetDetails,
  Asset,
  ChainModifiers,
  AssetFile,
} from "contentful";

import { isUrlSupportedVideoFormat } from "@/utils/media";
import type { IVideoFields } from "@/types/generated/contentful";

import style from "./style.module.scss";
import MediaVideo from "./MediaVideo";
import MediaPlaceholder from "./MediaPlaceholder";
import MediaImage from "./MediaImage";

type MediaVideoType = IVideoFields["file"]["fields"] & {
  width: number;
  height: number;
};

/**
 * Disgusting type that extracts the correct typings from Contentful's
 * typgenerated types for the media asset. This can be either: A direct reference
 * to a file, or a reference to the Video content type which references a file, thus
 * the two cases here.
 */
type ContentType = MediaVideoType | Asset<ChainModifiers, string>["fields"];

interface Props {
  content: ContentType;
  first?: boolean;
}

type DumbFile =
  | AssetFile
  | {
      [x: string]: AssetFile | undefined;
    };

const getAspectRatio = (file: DumbFile, content: ContentType) => {
  const videoDetails = content as MediaVideoType;
  if (videoDetails.width && videoDetails.height) {
    return videoDetails.width / videoDetails.height;
  }

  const imageDetails = (file.details as AssetDetails)?.image;
  if (imageDetails) {
    return imageDetails.width / imageDetails.height;
  }

  // console.log(file);

  return "unset";

  // TODO: enable this once all content has been shifted to use new Video content type
  // throw new Error(`Couldn't calculate aspect ratio for media ${content.title}`);
};

const Media = ({ content, first }: Props) => {
  const { file } = content;
  if (!file) throw new Error("No media file");

  const url = `https:${file.url}`;
  const aspectRatio = getAspectRatio(file, content);

  return (
    <div className={style.MediaContainer} style={{ aspectRatio }}>
      <MediaPlaceholder />
      {isUrlSupportedVideoFormat(url) ? (
        <MediaVideo src={url} />
      ) : (
        <MediaImage src={url} isFirst={first} />
      )}
    </div>
  );
};

export default Media;
