import { WebGpuApi } from "../../types";
import { GLTFPrimitive } from "./GLTFPrimitive";

/**
 * @description A GLTFMesh describes a single mesh in a gltf file.
 *              This mesh can have multiple primitives ("sub meshes").
 *
 * NOTE: only supports single embedded binary */
export class GLTFMesh {
  name?: string;
  primitives: GLTFPrimitive[] = [];

  constructor({
    name,
    primitives,
  }: {
    name?: string;
    primitives: GLTFPrimitive[];
  }) {
    this.name = name;
    this.primitives = primitives;
  }

  async buildRenderPipeline(config: {
    api: WebGpuApi;
    shaderModule: GPUShaderModule;
    depthFormat: GPUTextureFormat;
    colorFormat: GPUTextureFormat;
    uniformsBindGroupLayout: GPUBindGroupLayout;
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

  render(config: {
    renderPassEncoder: GPURenderPassEncoder;
    uniformsBindGroup: GPUBindGroup;
  }) {
    for (const primitive of this.primitives) {
      primitive.render(config);
    }
  }
}
