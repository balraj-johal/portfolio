import { MousePos } from "@/types/events";

/**
 * @param pos Takes normalised mouse position and maps it to a css transform
 * @returns css transform
 */
export const buildTranslation = (pos: MousePos) => {
  const xPosInPX = window.innerWidth * pos.x;
  const yPosInPX = window.innerHeight * (1 - pos.y);
  return `translate(${xPosInPX}px, ${yPosInPX}px)`;
};
