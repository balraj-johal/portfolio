import { API } from "./types";

export default class Triangle {
  api: API;
  dataBuffer?: GPUBuffer;

  constructor(api: API) {
    this.api = api;

    this.createDataBuffer();
  }

  private createDataBuffer() {
    const buffer = this.api.device.createBuffer({
      size: 3 * 4 * 4 * 2, // 3 verts with 4 floats per "channel", with 2 channels?
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true, // See docs.md, Mapped Data Buffer
    });

    const mappedBuffer: ArrayBuffer = buffer.getMappedRange();

    // create a view of the mapped ArrayBuffer such that we can set the typed floats easily
    const float32BufferView = new Float32Array(mappedBuffer);

    // Interleaved positions and colors
    float32BufferView.set([
      1,
      -1,
      0,
      1, // ^ position
      1,
      0,
      0,
      1, // ^ color
      -1,
      -1,
      0,
      1, // ^ position
      0,
      1,
      0,
      1, // ^ color
      0,
      1,
      0,
      1, // ^ position
      0,
      0,
      1,
      1, // ^ color
    ]);

    // unmap the buffer to allow the gpu to access it again
    buffer.unmap();

    this.dataBuffer = buffer;
  }
}
