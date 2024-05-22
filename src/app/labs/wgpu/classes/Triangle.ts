import { FLOAT_LENGTH_BYTES } from "../../../../libs/wgpu/utils/math";
import { API } from "../../../../libs/wgpu/types";

export default class Triangle {
  api: API;
  dataBuffer?: GPUBuffer;

  constructor(api: API) {
    this.api = api;

    this.createDataBuffer();
  }

  private createDataBuffer() {
    // checked
    const buffer = this.api.device.createBuffer({
      size: 3 * 2 * 4 * FLOAT_LENGTH_BYTES, // 3 verts with 4 floats per "channel", with 2 channels?
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true, // See docs.md, Mapped Data Buffer
    });

    const mappedBufferRange: ArrayBuffer = buffer.getMappedRange();

    // create a view of the mapped ArrayBuffer such that we can set the typed floats easily
    const float32BufferView = new Float32Array(mappedBufferRange);

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
