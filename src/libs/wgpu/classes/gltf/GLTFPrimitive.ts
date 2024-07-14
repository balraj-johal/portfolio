import { GLTFRenderMode, WebGpuApi } from "../../types";
import { GltfPbrMaterial } from "./GltfPbrMaterial";
import { GLTFAccessor } from "./GLTFAccessor";

const SHADER_LOCATION_FROM_ATTRIBUTE = {
  positions: 0,
  texCoords: 1,
  normals: 2,
};

/**
 * @description A GLTFPrimitive describes a "sub mesh" of a main GLTF.
 *              Its properties describe how the primitive should be handled.
 *
 * NOTE: only supports single embedded binary */
export class GLTFPrimitive {
  positionsAccessor: GLTFAccessor;
  topology: GLTFRenderMode;
  material?: GltfPbrMaterial;
  indicesAccessor?: GLTFAccessor;
  normalsAccessor?: GLTFAccessor;
  texCoordsAccessors?: GLTFAccessor[];
  renderPipeline?: GPURenderPipeline;

  constructor({
    mode,
    positions,
    indices,
    normals,
    texCoords,
    material,
  }: {
    mode: GLTFRenderMode;
    positions: GLTFAccessor;
    indices?: GLTFAccessor;
    normals?: GLTFAccessor;
    texCoords?: GLTFAccessor[];
    material?: GltfPbrMaterial;
  }) {
    this.material = material;
    this.topology = mode;

    this.indicesAccessor = indices;
    this.normalsAccessor = normals;
    this.texCoordsAccessors = texCoords;

    this.positionsAccessor = positions;
    this.positionsAccessor.bufferView.needsUpload = true;
    this.positionsAccessor.bufferView.addUsage(GPUBufferUsage.VERTEX);

    if (this.indicesAccessor) {
      // Set usage for the indices data and flag it as needing upload
      this.indicesAccessor.bufferView.needsUpload = true;
      this.indicesAccessor.bufferView.addUsage(GPUBufferUsage.INDEX);
    }

    if (this.normalsAccessor) {
      // Set usage for the normals data and flag it as needing upload
      this.normalsAccessor.bufferView.needsUpload = true;
      this.normalsAccessor.bufferView.addUsage(GPUBufferUsage.UNIFORM);
      this.normalsAccessor.bufferView.addUsage(GPUBufferUsage.VERTEX);
    }

    if (this.texCoordsAccessors) {
      // TODO: loop through all tex coords accessorts here
      // Set usage for the tex coords data and flag it as needing upload
      this.texCoordsAccessors[0].bufferView.needsUpload = true;
      this.texCoordsAccessors[0].bufferView.addUsage(GPUBufferUsage.UNIFORM);
      this.texCoordsAccessors[0].bufferView.addUsage(GPUBufferUsage.VERTEX);
    }
  }

  async buildRenderPipeline({
    api,
    shaderModule,
    depthFormat,
    colorFormat,
    uniformsBindGroupLayout,
    nodeParametersBindGroupLayout,
  }: {
    api: WebGpuApi;
    shaderModule: GPUShaderModule;
    depthFormat: GPUTextureFormat;
    colorFormat: GPUTextureFormat;
    uniformsBindGroupLayout: GPUBindGroupLayout;
    nodeParametersBindGroupLayout: GPUBindGroupLayout;
  }) {
    // TODO: something here is fucking broken!!!
    // it's a validation issue, so something in my descriptors when I've modified to add the tex coordinates

    const vertexBufferLayouts: GPUVertexBufferLayout[] = [];
    // defines the properties of the positions attribute
    // Note: We do not pass the positions.byteOffset here, as its
    // meaning can vary in different glB files, i.e., if it's
    // being used for interleaved element offset or an absolute
    // offset.
    const positionAttribute: GPUVertexAttribute = {
      format: this.positionsAccessor.vertexType as GPUVertexFormat, // "float32x3"
      offset: 0,
      shaderLocation: SHADER_LOCATION_FROM_ATTRIBUTE["positions"],
    };
    const positionVertexBufferLayout: GPUVertexBufferLayout = {
      arrayStride: this.positionsAccessor.byteStride,
      attributes: [positionAttribute],
    };
    vertexBufferLayouts.push(positionVertexBufferLayout);

    if (this.texCoordsAccessors) {
      console.log(this.texCoordsAccessors);
      const texCoord0Attribute: GPUVertexAttribute = {
        format: this.texCoordsAccessors[0].vertexType as GPUVertexFormat, // "float32x2"
        offset: 0,
        shaderLocation: SHADER_LOCATION_FROM_ATTRIBUTE["texCoords"],
      };
      const texCoord0BufferLayout: GPUVertexBufferLayout = {
        arrayStride: this.texCoordsAccessors[0].byteStride,
        attributes: [texCoord0Attribute],
      };
      vertexBufferLayouts.push(texCoord0BufferLayout);
    }

    if (this.normalsAccessor) {
      console.log(this.normalsAccessor);
      const normalAttribute: GPUVertexAttribute = {
        format: this.normalsAccessor.vertexType as GPUVertexFormat, // "float32x3"
        offset: 0,
        shaderLocation: SHADER_LOCATION_FROM_ATTRIBUTE["normals"],
      };
      const normalBufferLayout: GPUVertexBufferLayout = {
        arrayStride: this.normalsAccessor.byteStride,
        attributes: [normalAttribute],
      };
      vertexBufferLayouts.push(normalBufferLayout);
    }

    const vertexState: GPUVertexState = {
      module: shaderModule,
      entryPoint: "vertex_main", // Name of the vertex module defined in shader
      buffers: vertexBufferLayouts,
    };

    const fragmentState: GPUFragmentState = {
      module: shaderModule,
      entryPoint: "fragment_main",
      targets: [{ format: colorFormat }],
    };

    // Our loader only supports triangle lists and strips, so by default we set
    // the primitive topology to triangle list
    const primitive: GPUPrimitiveState = { topology: "triangle-list" };

    // then check and handle if it's instead a triangle strip
    if (
      this.topology == GLTFRenderMode.TRIANGLE_STRIP &&
      this.indicesAccessor
    ) {
      primitive.topology = "triangle-strip";
      primitive.stripIndexFormat = this.indicesAccessor
        .vertexType as GPUIndexFormat;
    }

    const bindGroupLayouts: GPUBindGroupLayout[] = [];
    bindGroupLayouts.push(uniformsBindGroupLayout);
    bindGroupLayouts.push(nodeParametersBindGroupLayout);

    if (this.material) {
      const { bindGroupLayout } = this.material;
      if (!bindGroupLayout) {
        throw new Error(
          `Material ${this.material.name} has not had its bind group layout created yet.`,
        );
      }
      bindGroupLayouts.push(bindGroupLayout);
    }

    const renderPipelineLayout = api.device.createPipelineLayout({
      bindGroupLayouts,
    });

    this.renderPipeline = await api.device.createRenderPipelineAsync({
      layout: renderPipelineLayout,
      vertex: vertexState,
      fragment: fragmentState,
      primitive: primitive,
      depthStencil: {
        format: depthFormat,
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });

    return this.renderPipeline;
  }

  render({ renderPassEncoder }: { renderPassEncoder: GPURenderPassEncoder }) {
    if (!this.renderPipeline) {
      throw new Error("No render pipline to render from GLTFPrimitive");
    }

    // TODO: how can I hoist this so this doesn't get set over n over for no reason?
    // material sorting?
    if (this.material && this.material.bindGroup) {
      renderPassEncoder.setBindGroup(2, this.material.bindGroup);
    }

    renderPassEncoder.setPipeline(this.renderPipeline);

    if (!this.positionsAccessor.bufferView.gpuBuffer) {
      throw new Error("No gpu buffer in positions accessor buffer view");
    }
    renderPassEncoder.setVertexBuffer(
      0,
      this.positionsAccessor.bufferView.gpuBuffer,
      this.positionsAccessor.byteOffset,
      this.positionsAccessor.byteLength,
    );

    if (
      this.texCoordsAccessors &&
      this.texCoordsAccessors[0].bufferView.gpuBuffer
    ) {
      renderPassEncoder.setVertexBuffer(
        SHADER_LOCATION_FROM_ATTRIBUTE["texCoords"],
        this.texCoordsAccessors[0].bufferView.gpuBuffer,
        this.texCoordsAccessors[0].byteOffset,
        this.texCoordsAccessors[0].byteLength,
      );
    }

    if (this.normalsAccessor?.bufferView.gpuBuffer) {
      renderPassEncoder.setVertexBuffer(
        SHADER_LOCATION_FROM_ATTRIBUTE["normals"],
        this.normalsAccessor.bufferView.gpuBuffer,
        this.normalsAccessor.byteOffset,
        this.normalsAccessor.byteLength,
      );
    }

    if (this.indicesAccessor) {
      if (!this.indicesAccessor.bufferView.gpuBuffer) {
        throw new Error("No gpu buffer in indices accessor buffer view");
      }

      renderPassEncoder.setIndexBuffer(
        this.indicesAccessor.bufferView.gpuBuffer,
        this.indicesAccessor.vertexType as GPUIndexFormat,
        this.indicesAccessor.byteOffset,
        this.indicesAccessor.byteLength,
      );

      renderPassEncoder.drawIndexed(this.indicesAccessor.count);
    } else {
      renderPassEncoder.draw(this.positionsAccessor.count);
    }
  }
}

export enum SupportedPrimitiveAttribute {
  TEXCOORD_0 = "TEXCOORD_0",
  POSITION = "POSITION",
  NORMAL = "NORMAL",
}

export function isPrimitiveAttributeSupported(
  attribute: string,
): attribute is SupportedPrimitiveAttribute {
  return Object.keys(SupportedPrimitiveAttribute).includes(
    attribute as SupportedPrimitiveAttribute,
  );
}
