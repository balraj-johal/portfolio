/**
 * @description A GLTFBuffer is a big section of binary data,
 *              that could contain many contiguious sub-sections of stuff.
 *              e.g. one buffer would have, vertex data, texture data, maybe?
 *
 * NOTE: only supports single embedded binary */
export class GLTFBuffer {
  contents: Uint8Array;

  constructor(contents: ArrayBuffer, offset: number, size: number) {
    this.contents = new Uint8Array(contents, offset, size);
  }
}
