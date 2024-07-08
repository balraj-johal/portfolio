import { GltfSamplerType } from "../../types/gltf";
import { GLTFTextureFilter, GLTFTextureWrap } from "../../types";

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GLTFSampler {
  magFilter: GLTFTextureFilter;
  minFilter: GLTFTextureFilter;
  wrapS: GLTFTextureWrap;
  wrapT: GLTFTextureWrap;

  constructor(sampler: GltfSamplerType) {
    this.magFilter = sampler.magFilter;
    this.minFilter = sampler.minFilter;
    this.wrapS = sampler.wrapS;
    this.wrapT = sampler.wrapT;
  }
}
