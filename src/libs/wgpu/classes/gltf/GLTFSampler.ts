import { GltfSamplerType } from "../../types/gltf";
import { GLTFFilterType, GLTFWrapType } from "../../types";

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GLTFSampler {
  magFilter: GLTFFilterType;
  minFilter: GLTFFilterType;
  wrapS: GLTFWrapType;
  wrapT: GLTFWrapType;

  constructor(sampler: GltfSamplerType) {
    this.magFilter = sampler.magFilter;
    this.minFilter = sampler.minFilter;
    this.wrapS = sampler.wrapS;
    this.wrapT = sampler.wrapT;
  }
}
