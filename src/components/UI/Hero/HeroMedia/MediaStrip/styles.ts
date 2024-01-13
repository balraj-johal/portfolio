import Image from "next/image";
import { styled } from "@phntms/css-components";

import css from "./style.module.scss";

export const MediaStripWrapper = styled("div", {
  css: css.MediaStripWrapper,
});

export const MediaContainer = styled("div", {
  css: css.MediaContainer,
  variants: {
    visible: {
      true: css.MediaContainer_Visible,
    },
  },
});

export const StripVideo = styled("video", {
  css: css.StripVideo,
  variants: {
    visible: {
      true: css.StripVideo_Visible,
    },
  },
});

export const StripImage = styled(Image, {
  css: css.StripImage,
  variants: {
    visible: {
      true: css.StripImage_Visible,
    },
  },
});
