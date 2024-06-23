import { GLTFComponentType, GLTFType } from "@/libs/wgpu/types";

import {
  getGltfTypeSize,
  gltfVertexType as getGltfVertexType,
  parseGltfType,
} from "../../utils/gltf";
import { GLTFBufferView } from "./GLTFBufferView";

/**
 * @description A GLTFAccessor describes "metadata" of a GLTFBufferView.
 *              For example, a bufferView may be of type FLOAT or SHORT,
 *              and this distinction is made in the accessor.
 *
 * NOTE: only supports single embedded binary */
export class GLTFAccessor {
  count: number;
  componentType: GLTFComponentType;
  gltfType: GLTFType;
  bufferView: GLTFBufferView;
  byteOffset = 0;

  // TODO: remove this any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(bufferView: GLTFBufferView, accessor: any) {
    this.count = accessor.count;
    this.componentType = accessor.componentType;
    this.gltfType = parseGltfType(accessor.type);
    this.bufferView = bufferView;
    if (!!accessor.byteOffset) {
      this.byteOffset = accessor.byteOffset;
    }
  }

  get byteLength() {
    return this.count * this.byteStride;
  }

  get byteStride() {
    const elementSize = getGltfTypeSize(this.componentType, this.gltfType);
    return Math.max(elementSize, this.bufferView.byteStride);
  }

  get vertexType() {
    return getGltfVertexType(this.componentType, this.gltfType);
  }
}
