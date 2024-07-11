import { getGltfAddressMode, getGltfTextureFilterMode } from "../../utils/gltf";
import { GltfSamplerType } from "../../types/gltf";
import { WebGpuApi } from "../../types";

const DEFAULT_MAG_FILTER: GPUFilterMode = "linear";
const DEFAULT_MIN_FILTER: GPUFilterMode = "linear";
const DEFAULT_MIPMAP_FILTER: GPUFilterMode = "nearest";
const DEFAULT_ADDRESS_MODE_U: GPUAddressMode = "repeat";
const DEFAULT_ADDRESS_MODE_V: GPUAddressMode = "repeat";

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GLTFSampler {
  magFilter: GPUFilterMode = DEFAULT_MAG_FILTER;
  minFilter: GPUFilterMode = DEFAULT_MIN_FILTER;
  mipMapFilter: GPUFilterMode = DEFAULT_MIPMAP_FILTER;
  addressModeU: GPUAddressMode = DEFAULT_ADDRESS_MODE_U;
  addressModeV: GPUAddressMode = DEFAULT_ADDRESS_MODE_V;

  constructor(sampler?: GltfSamplerType) {
    if (!sampler) return;

    this.magFilter = getGltfTextureFilterMode(sampler.magFilter);
    this.minFilter = getGltfTextureFilterMode(sampler.minFilter);
    this.addressModeU = getGltfAddressMode(sampler.wrapS);
    this.addressModeV = getGltfAddressMode(sampler.wrapT);
  }

  create(api: WebGpuApi) {
    const descriptor: GPUSamplerDescriptor = {
      magFilter: this.magFilter,
      minFilter: this.minFilter,
      addressModeU: this.addressModeU,
      addressModeV: this.addressModeV,
      mipmapFilter: this.mipMapFilter,
    };

    api.device.createSampler(descriptor);
  }
}
