import { SUPPORTED_VIDEO_FILE_TYPES } from "@/config/media";

export function isUrlSupportedVideoFormat(url: string) {
  return !!SUPPORTED_VIDEO_FILE_TYPES.find((filetype) => {
    return url.includes(filetype);
  });
}
