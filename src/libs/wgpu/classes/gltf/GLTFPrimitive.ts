/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: remove any

import { GLTFRenderMode } from "../../types";
import { GLTFAccessor } from "./GLTFAccessor";

/**
 * @description A GLTFPrimitive describes a "sub mesh" of a main GLTF.
 *              Its properties describe how the primitive should be handled.
 *
 * NOTE: only supports single embedded binary */
export class GLTFPrimitive {
  positionsAccessor: GLTFAccessor;
  indicesAccessor?: GLTFAccessor;
  topology: GLTFRenderMode;
  renderPipeline?: GPURenderPipeline;

  constructor({
    mode,
    positions,
    indices,
  }: {
    mode: GLTFRenderMode;
    positions: GLTFAccessor;
    indices: GLTFAccessor;
  }) {
    this.topology = mode;
    this.positionsAccessor = positions;
    this.indicesAccessor = indices;
    this.positionsAccessor.bufferView.needsUpload = true;
    this.positionsAccessor.bufferView.addUsage(GPUBufferUsage.VERTEX);

    if (this.indicesAccessor) {
      // Set usage for the indices data and flag it as needing upload
      this.indicesAccessor.bufferView.needsUpload = true;
      this.indicesAccessor.bufferView.addUsage(GPUBufferUsage.INDEX);
    }
  }

  // TODO:
  buildRenderPipeline() {}

  // TODO:
  render() {}
}
