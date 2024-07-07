import { WebGpuApi } from "../../types";
import { GLTFPrimitive } from "./GLTFPrimitive";

type Properties = {
  name?: string;
  primitives: GLTFPrimitive[];
};

/**
 * @description A GLTFMesh describes a single mesh in a gltf file.
 *              This mesh can have multiple primitives ("sub meshes").
 *
 * NOTE: only supports single embedded binary */
export class GLTFMesh {
  private readonly name?: string;
  private readonly primitives: GLTFPrimitive[] = [];

  constructor({ name, primitives }: Properties) {
    this.name = name;
    this.primitives = primitives;
  }

  async buildRenderPipeline(config: {
    api: WebGpuApi;
    shaderModule: GPUShaderModule;
    depthFormat: GPUTextureFormat;
    colorFormat: GPUTextureFormat;
    uniformsBindGroupLayout: GPUBindGroupLayout;
    nodeParametersBindGroupLayout: GPUBindGroupLayout;
  }): Promise<void> {
    return new Promise(async (resolve, reject) => {
      for (const primitive of this.primitives) {
        try {
          await primitive.buildRenderPipeline(config);
        } catch (error) {
          reject(error);
        }
      }
      resolve();
    });
  }

  render(config: { renderPassEncoder: GPURenderPassEncoder }) {
    for (const primitive of this.primitives) {
      primitive.render(config);
    }
  }
}
