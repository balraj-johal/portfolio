// import { alignTo } from "../../utils/math";
import { WebGpuApi } from "../../types";

type MaterialTextureConfiguration = {
  index: number;
  texCoord?: number;
};

type GLTFMaterialConfiguration = {
  name?: string;
  emissiveFactor?: readonly [number, number, number];
  emissiveTexture?: MaterialTextureConfiguration;
  occlusionTexture?: MaterialTextureConfiguration & {
    strength: number;
  };
  normalTexture?: MaterialTextureConfiguration & {
    scale: number;
  };
  pbrMetallicRoughness: {
    baseColorTexture?: MaterialTextureConfiguration;
    baseColorFactor?: readonly [number, number, number, number];
    metallicRoughnessTexture?: MaterialTextureConfiguration;
    metallicFactor?: number;
    roughnessFactor?: number;
  };
};

/**
 * @description
 *
 * NOTE: only supports single embedded textures */
export class GltfPbrMaterial {
  constructor(materialConfiguration: GLTFMaterialConfiguration) {
    console.log(materialConfiguration);
  }

  upload(api: WebGpuApi) {
    // const bindGroupLayout = api.device.createBindGroupLayout();
    // const bindGroup = api.device.createBindGroup();
    // const buffer = api.device.createBuffer({
    //   size: alignTo(this.view.byteLength, FLOAT_LENGTH_BYTES),
    //   usage: this.usage,
    //   mappedAtCreation: true,
    // });
    // const newView = new Uint8Array(buffer.getMappedRange());
    // newView.set(this.view);
    // buffer.unmap();
    // this.gpuBuffer = buffer;
  }
}
