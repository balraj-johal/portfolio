import { mat4 } from "gl-matrix";

import { FLOAT_LENGTH_BYTES } from "../../utils/math";
import { GltfNode } from "../../types/gltf";
import { WebGpuApi } from "../../types";
import { GLTFMesh } from "./GLTFMesh";

type Properties = {
  transformMatrix: mat4;
  mesh?: GLTFMesh;
  camera?: number;
  name?: string;
};

/** If gltf node has a local matrix, return that, or return a default matrix. */
export function getNodeTransformMatrix(node: GltfNode) {
  if (node.matrix) {
    const matrix = node.matrix;
    return mat4.fromValues(
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4],
      matrix[5],
      matrix[6],
      matrix[7],
      matrix[8],
      matrix[9],
      matrix[10],
      matrix[11],
      matrix[12],
      matrix[13],
      matrix[14],
      matrix[15],
    );
  } else {
    const scale = node.scale ?? [1, 1, 1];
    const rotation = node.rotation ?? [0, 0, 0, 1];
    const translation = node.translation ?? [0, 0, 0];
    return mat4.fromRotationTranslationScale(
      mat4.create(),
      rotation,
      translation,
      scale,
    );
  }
}

/**
 * @description A GLTFNode describes a single node in a gltf file.
 *              A node here refers to an object pointing at a mesh,
 *              and having a scene transform.
 *
 *              For example, there may be multiple nodes pointing
 *              at the same mesh.
 *
 * NOTE: only supports single embedded binary */
export class GLTFNode {
  hasMesh = false;

  private readonly transformMatrix: mat4;
  private readonly mesh?: GLTFMesh;
  private readonly camera?: number;

  private nodeParametersBuffer?: GPUBuffer;
  private nodeParametersBindGroup?: GPUBindGroup;

  constructor({ transformMatrix, mesh }: Properties) {
    this.transformMatrix = transformMatrix;
    if (mesh) {
      this.mesh = mesh;
      this.hasMesh = true;
    }
  }

  async buildRenderPipeline(config: {
    api: WebGpuApi;
    shaderModule: GPUShaderModule;
    depthFormat: GPUTextureFormat;
    colorFormat: GPUTextureFormat;
    uniformsBindGroupLayout: GPUBindGroupLayout;
  }): Promise<void> {
    // create the buffer to pass the node's transform data to the GPU with
    this.nodeParametersBuffer = config.api.device.createBuffer({
      size: 16 * FLOAT_LENGTH_BYTES,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    // set the value of that buffer
    const mappedBufferArray = new Float32Array(
      this.nodeParametersBuffer.getMappedRange(),
    );
    mappedBufferArray.set(this.transformMatrix);
    this.nodeParametersBuffer.unmap();

    const nodeParametersBindGroupLayout =
      config.api.device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
              type: "uniform",
            },
          },
        ],
      });

    this.nodeParametersBindGroup = config.api.device.createBindGroup({
      layout: nodeParametersBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.nodeParametersBuffer,
          },
        },
      ],
    });

    return new Promise(async (resolve, reject) => {
      try {
        if (this.mesh) {
          await this.mesh?.buildRenderPipeline({
            ...config,
            nodeParametersBindGroupLayout,
          });
        }
      } catch (error) {
        reject(error);
      }
      resolve();
    });
  }

  render({ renderPassEncoder }: { renderPassEncoder: GPURenderPassEncoder }) {
    if (!this.nodeParametersBindGroup) {
      throw new Error("No GLTFNode parameters bind group");
    }
    if (!this.mesh) {
      throw new Error("GLTFNode has no mesh to render.");
    }

    renderPassEncoder.setBindGroup(1, this.nodeParametersBindGroup);
    this.mesh.render({ renderPassEncoder });
  }
}
