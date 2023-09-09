import { CSSProperties } from "react";

export const extendedStyle = <T>(style: CSSProperties & T) => {
  return style;
};
