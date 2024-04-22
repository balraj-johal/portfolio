import { CSSProperties } from "react";

export type CSSCustomProperty = `--${string}`;
export type CSSCustomProperties = { [key in CSSCustomProperty]: string };

export const extendedStyle = (style: CSSProperties & CSSCustomProperties) => {
  return style as CSSProperties & CSSCustomProperties;
};
