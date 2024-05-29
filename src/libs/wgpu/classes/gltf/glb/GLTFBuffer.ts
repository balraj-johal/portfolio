/** NOTE: only supports single embedded binary */
export class GLTFBuffer {
  contents: Uint8Array;

  constructor(contents: ArrayBuffer, offset: number, size: number) {
    this.contents = new Uint8Array(contents, offset, size);
  }
}
