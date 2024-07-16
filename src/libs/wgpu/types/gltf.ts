/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReadonlyVec3, mat4 } from "gl-matrix";

import { GLTFTexture } from "../classes/gltf/GLTFTexture";
import { GLTFTextureFilter, GLTFTextureWrap } from ".";

export enum SupportedMimeType {
  JPEG = "image/jpeg",
  PNG = "image/png",
  WEBP = "image/webp",
  // TODO: confirm support here
  // seems ok: https://github.com/KhronosGroup/KTX-Specification/issues/18
  KTX2 = "image/ktx2",
}

/** Simple skeleton type that describes which properties can be expected
 *  on a gltf header. */
export interface GltfJsonHeader {
  accessors?: Record<string, any>[];
  asset?: any;
  bufferViews?: Record<string, any>[];
  buffers?: Record<string, any>[];
  cameras?: Record<string, any>[];
  materials?: GltfMaterialHeader[];
  textures?: GltfTextureType[];
  images?: any[];
  samplers?: GltfSamplerType[];
  meshes?: Record<string, any>[];
  nodes?: GltfNode[];
  /** Default scene */
  scene?: number;
  scenes?: GltfScene[];
}

export type MaterialTextureConfiguration = {
  index: number;
  texCoord?: number;
};

export type Array3 = readonly [number, number, number];
export type Array4 = readonly [number, number, number, number];

export type GltfMaterialHeader = {
  name?: string;
  emissiveFactor?: Array3;
  emissiveTexture?: MaterialTextureConfiguration;
  occlusionTexture?: MaterialTextureConfiguration & {
    strength: number;
  };
  normalTexture?: MaterialTextureConfiguration & {
    scale: number;
  };
  pbrMetallicRoughness: {
    baseColorTexture?: MaterialTextureConfiguration;
    baseColorFactor?: Array4;
    metallicRoughnessTexture?: MaterialTextureConfiguration;
    metallicFactor?: number;
    roughnessFactor?: number;
  };
};

export type GltfTextureList = [string, GLTFTexture][];

export type GltfTextureType = {
  source: number;
  sampler: number;
};

/** NOTE: does not support URI's */
export type GltfImageType = {
  bufferView: number;
  mimeType: SupportedMimeType;
};

export type GltfSamplerType = {
  magFilter: GLTFTextureFilter;
  minFilter: GLTFTextureFilter;
  wrapS: GLTFTextureWrap;
  wrapT: GLTFTextureWrap;
};

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