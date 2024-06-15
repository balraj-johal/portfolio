import { FLOAT_LENGTH_BYTES, alignTo } from "@/libs/wgpu/utils/math";

import { GLTFBuffer } from "./GLTFBuffer";

/**
 * @description A GLTFBufferView is a representation of a part of a GLTFBuffer.
 *              For example, a GLTFBuffer may have vertex position & normal data in it.
 *              You'd then have two BufferViews that allow you to access that data correctly.
 *
 * NOTE: only supports single embedded binary */
export class GLTFBufferView {
  length: number;
  byteStride = 0;
  usage: GPUBufferUsageFlags = 0;
  viewByteOffset = 0;
  needsUpload = false;
  gpuBuffer?: GPUBuffer;
  view: Uint8Array;

  constructor(buffer: GLTFBuffer, view: Record<string, unknown>) {
    this.length = view["byteLength"] as number;
    if (view["byteStride"] !== undefined) {
      this.byteStride = view["byteStride"] as number;
    }
    if (view["byteOffset"] !== undefined) {
      this.viewByteOffset = view["byteOffset"] as number;
    }

    // Create the buffer view. Note that subarray creates a new typed
    // view over the same array buffer, we do not make a copy here.
    this.view = buffer.contents.subarray(
      this.viewByteOffset,
      this.viewByteOffset + this.length,
    );
  }

  addUsage(usage: GPUBufferUsageFlags) {
    // This is a bitwise OR (|) operator,
    // effectively combining all the binary uage flags
    this.usage = this.usage | usage;
  }

  upload(device: GPUDevice) {
    const buffer = device.createBuffer({
      size: alignTo(this.view.byteLength, FLOAT_LENGTH_BYTES),
      usage: this.usage,
      mappedAtCreation: true,
    });

    const newView = new Uint8Array(buffer.getMappedRange());
    newView.set(this.view);
    buffer.unmap();
    this.gpuBuffer = buffer;
  }
}
