import { alignTo, FLOAT_LENGTH_BYTES } from "../../utils/math";
import {
  Array3,
  Array4,
  GltfMaterialHeader,
  GltfTextureList,
} from "../../types/gltf";
import { WebGpuApi } from "../../types";
import { GLTFTexture } from "./GLTFTexture";

type MaterialParameters = {
  baseColorFactor: Array4;
  metallicFactor: number;
  roughnessFactor: number;
  emissiveFactor?: Array3;
  occlusionStrength?: number;
  normalScale?: number;
};

export enum SupportedTexture {
  Emissive = "emissiveTexture",
  Occlusion = "occlusionTexture",
  Normal = "normalTexture",
  BaseColor = "baseColorTexture",
  MetallicRoughness = "metallicRoughnessTexture",
}

function isSupportedTextureName(name: string): name is SupportedTexture {
  return Object.values(SupportedTexture).includes(name as SupportedTexture);
}

/**
 * These start at one as the first binding is for the material parameters.
 * They have a stride of 2 to account for the texture sampler resource as well
 * as the texture.
 *
 *  e.g.
 *    binding(1)      - base colour texture
 *    binding(1 + 1)  - base colour sampler
 */
const BINDING_NUMBER_BY_TEXTURE_TYPE: Record<SupportedTexture, number> = {
  [SupportedTexture.BaseColor]: 1,
  [SupportedTexture.MetallicRoughness]: 3,
  [SupportedTexture.Normal]: 5,
  [SupportedTexture.Occlusion]: 7,
  [SupportedTexture.Emissive]: 9,
};

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GltfPbrMaterial {
  name?: string;
  preparedTextures: Partial<Record<SupportedTexture, GLTFTexture>> = {};
  materialParameters: MaterialParameters = {
    baseColorFactor: [1, 1, 1, 1],
    metallicFactor: 1,
    roughnessFactor: 1,
  };

  materialParametersBuffer?: GPUBuffer;
  bindGroupLayout?: GPUBindGroupLayout;
  bindGroup?: GPUBindGroup;

  constructor(
    materialHeader: GltfMaterialHeader,
    textureList: GltfTextureList,
  ) {
    this.name = materialHeader.name;

    this.populateMaterialParameters(materialHeader);
    this.populatePreparedTextures(textureList);
  }

  private populatePreparedTextures(textureList: GltfTextureList) {
    for (const [name, texture] of textureList) {
      if (isSupportedTextureName(name)) this.preparedTextures[name] = texture;
    }
  }

  private populateMaterialParameters(materialHeader: GltfMaterialHeader) {
    this.materialParameters.emissiveFactor = materialHeader.emissiveFactor;
    this.materialParameters.occlusionStrength =
      materialHeader.occlusionTexture?.strength;
    this.materialParameters.normalScale = materialHeader.normalTexture?.scale;
    if (materialHeader.pbrMetallicRoughness.metallicFactor) {
      this.materialParameters.metallicFactor =
        materialHeader.pbrMetallicRoughness.metallicFactor;
    }
    if (materialHeader.pbrMetallicRoughness.roughnessFactor) {
      this.materialParameters.roughnessFactor =
        materialHeader.pbrMetallicRoughness.roughnessFactor;
    }
    if (materialHeader.pbrMetallicRoughness.baseColorFactor) {
      this.materialParameters.baseColorFactor =
        materialHeader.pbrMetallicRoughness.baseColorFactor;
    }
  }

  upload(api: WebGpuApi) {
    this.materialParametersBuffer = this.createParamsBuffer(api);
    this.bindGroupLayout = this.buildBindGroupLayout(api);
    this.bindGroup = this.buildBindGroup(
      api,
      this.bindGroupLayout,
      this.materialParametersBuffer,
      this.materialParametersBuffer.size,
    );
  }

  private createParamsBuffer = (api: WebGpuApi): GPUBuffer => {
    /**
     * Bit of a weird order, but this describes the total length in bytes of every
     * parameter sent to the buffer. You can confirm the length by checking the
     * "running count" later on in this function.
     *
     * NOTE: the way I've set this up isn't very memory efficient. To allow for
     * all the types of material textures and parameters, I've created a buffer
     * that is of the MAX size, rather than the real size.
     *
     * Like, if I'm not using emission, I'm still making space in the parameters
     * uniform data buffer for that data anyway.
     *
     * I reckon this'll be fine for now, as the perf/memory impact shouldn't be
     * thaaaat bad, but this is a known inefficiency.
     * */
    const byteLengthOfMaterialParameters = 12;
    /**
     * Uniform buffers need to have an "alignment" of 8/16 or some shit,
     * see: https://learnopengl.com/Advanced-OpenGL/Advanced-GLSL
     * so we need to make sure our buffer is a multiple of 8.
     */
    const bufferSize =
      FLOAT_LENGTH_BYTES * alignTo(byteLengthOfMaterialParameters, 8);

    // create GPU buffer that's mapped
    const gpuBuffer = api.device.createBuffer({
      size: bufferSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
      mappedAtCreation: true,
    });

    // create a CPU buffer that's linked to the memory space of the GPU buffer
    const cpuBuffer = new Float32Array(gpuBuffer.getMappedRange());

    // upload data to the CPU buffer, and therefore syncing this w the GPU buffer (citation needed)
    if (this.materialParameters.baseColorFactor) {
      cpuBuffer.set(this.materialParameters.baseColorFactor, 0); // running count - 4 bytes(?)
    }
    if (this.materialParameters.metallicFactor) {
      cpuBuffer.set([this.materialParameters.metallicFactor], 4); // running count - 5 bytes(?)
    }
    if (this.materialParameters.roughnessFactor) {
      cpuBuffer.set([this.materialParameters.roughnessFactor], 5); // running count - 6 bytes(?)
    }
    if (this.materialParameters.emissiveFactor) {
      cpuBuffer.set(this.materialParameters.emissiveFactor, 6); // running count - 10 bytes(?)
    }
    if (this.materialParameters.occlusionStrength) {
      cpuBuffer.set([this.materialParameters.occlusionStrength], 10); // running count - 11 bytes(?)
    }
    if (this.materialParameters.normalScale) {
      cpuBuffer.set([this.materialParameters.normalScale], 11); // running count - 12 bytes(?)!
    }

    // unmap the buffer, allowing final usage in the GPU
    gpuBuffer.unmap();

    return gpuBuffer;
  };

  private buildBindGroupLayout = (api: WebGpuApi): GPUBindGroupLayout => {
    const entries: GPUBindGroupLayoutEntry[] = [];
    const bufferType: GPUBufferBindingType = "uniform";
    const sharedEntryConfig = {
      visibility: GPUShaderStage.FRAGMENT,
      buffer: {
        type: bufferType,
      },
    };

    const materialParameterEntry: GPUBindGroupLayoutEntry = {
      binding: 0,
      ...sharedEntryConfig,
    };
    entries.push(materialParameterEntry);

    const createEntriesForTexture = (type: SupportedTexture) => {
      const textureEntry: GPUBindGroupLayoutEntry = {
        binding: BINDING_NUMBER_BY_TEXTURE_TYPE[type],
        ...sharedEntryConfig,
      };
      const samplerEntry: GPUBindGroupLayoutEntry = {
        binding: BINDING_NUMBER_BY_TEXTURE_TYPE[type] + 1,
        ...sharedEntryConfig,
      };

      entries.push(textureEntry);
      entries.push(samplerEntry);
    };

    for (const [name] of Object.entries(this.preparedTextures)) {
      if (isSupportedTextureName(name)) createEntriesForTexture(name);
    }

    return api.device.createBindGroupLayout({
      entries: entries,
    });
  };

  private buildBindGroup = (
    api: WebGpuApi,
    bindGroupLayout: GPUBindGroupLayout,
    materialParametersBuffer: GPUBuffer,
    materialParametersBufferSize: number,
  ): GPUBindGroup => {
    const entries: GPUBindGroupEntry[] = [];

    const materialParametersEntry: GPUBindGroupEntry = {
      binding: 0,
      resource: {
        buffer: materialParametersBuffer,
        size: materialParametersBufferSize,
      },
    };
    entries.push(materialParametersEntry);

    const createEntriesForTexture = (
      type: SupportedTexture,
      texture: GLTFTexture,
    ) => {
      if (!texture.image.gpuTextureView)
        throw new Error(
          `GPUTextureView has not been created on GPU for ${type} material ${this.name}`,
        );

      const textureEntry: GPUBindGroupEntry = {
        binding: BINDING_NUMBER_BY_TEXTURE_TYPE[type],
        resource: texture.image.gpuTextureView,
      };

      if (!texture.sampler.gpuSampler)
        throw new Error(
          `Sampler has not been created on GPU for material ${this.name}`,
        );

      const samplerEntry: GPUBindGroupEntry = {
        binding: BINDING_NUMBER_BY_TEXTURE_TYPE[type] + 1,
        resource: texture.sampler.gpuSampler,
      };

      entries.push(textureEntry);
      entries.push(samplerEntry);
    };

    for (const [name, texture] of Object.entries(this.preparedTextures)) {
      if (isSupportedTextureName(name)) createEntriesForTexture(name, texture);
    }

    return api.device.createBindGroup({
      layout: bindGroupLayout,
      entries,
    });
  };
}
