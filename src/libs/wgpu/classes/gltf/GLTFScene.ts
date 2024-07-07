import { WebGpuApi } from "../../types";
import { GLTFNode } from "./GLTFNode";

type Properties = {
  flattenedNodes: GLTFNode[];
};

/**
 * @description
 *
 * NOTE: only supports single embedded binary */
export class GLTFScene {
  private flattenedNodes: GLTFNode[];

  constructor({ flattenedNodes }: Properties) {
    this.flattenedNodes = flattenedNodes;
  }

  async buildRenderPipelines(config: {
    api: WebGpuApi;
    shaderModule: GPUShaderModule;
    depthFormat: GPUTextureFormat;
    colorFormat: GPUTextureFormat;
    uniformsBindGroupLayout: GPUBindGroupLayout;
  }): Promise<void> {
    return new Promise(async (resolve, reject) => {
      for (const node of this.flattenedNodes) {
        try {
          if (node.hasMesh) {
            await node.buildRenderPipeline(config);
            // console.log("node", node, " has had its render pipeline built.");
          }
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
    config.renderPassEncoder.setBindGroup(0, config.uniformsBindGroup);
    for (const node of this.flattenedNodes) {
      if (node.hasMesh) node.render(config);
    }
  }
}
