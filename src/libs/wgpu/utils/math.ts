export const FLOAT_LENGTH_BYTES = 4;

/** This function ensures the value is a multiple of align */
export function alignTo(value: number, align: number) {
  return Math.floor((value + align - 1) / align) * align;
}
