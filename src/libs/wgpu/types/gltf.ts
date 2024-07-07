/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReadonlyVec3, mat4 } from "gl-matrix";

/** Simple skeleton type that describes which properties can be expected
 *  on a gltf header. */
export interface GltfJsonHeader {
  accessors?: Record<string, any>[];
  asset?: any;
  bufferViews?: Record<string, any>[];
  buffers?: Record<string, any>[];
  cameras?: Record<string, any>[];
  materials?: Record<string, any>[];
  meshes?: Record<string, any>[];
  nodes?: GltfNode[];
  /** Default scene */
  scene?: number;
  scenes?: GltfScene[];
}

export type GltfScene = {
  nodes: number[];
};

export type GltfNode = {
  /** Index of child nodes */
  children?: number[];
  matrix?: number[];
  mesh?: number;
  camera?: number;
  /** Non matrix values for scale transform */
  scale?: ReadonlyVec3;
  /** Non matrix values for rotation transform */
  rotation?: number[];
  /** Non matrix values for translation transform */
  translation?: ReadonlyVec3;
};

export type GltfFlattenedNode = {
  transformMatrix: mat4;
  meshIndex?: number;
  camera?: number;
};
