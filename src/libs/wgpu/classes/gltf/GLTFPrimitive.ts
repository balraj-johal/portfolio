import { GLTFRenderMode, WebGpuApi } from "../../types";
import { GLTFAccessor } from "./GLTFAccessor";

/**
 * @description A GLTFPrimitive describes a "sub mesh" of a main GLTF.
 *              Its properties describe how the primitive should be handled.
 *
 * NOTE: only supports single embedded binary */
export class GLTFPrimitive {
  positionsAccessor: GLTFAccessor;
  indicesAccessor?: GLTFAccessor;
  topology: GLTFRenderMode;
  renderPipeline?: GPURenderPipeline;

  constructor({
    mode,
    positions,
    indices,
  }: {
    mode: GLTFRenderMode;
    positions: GLTFAccessor;
    indices?: GLTFAccessor;
  }) {
    this.topology = mode;
    this.positionsAccessor = positions;
    this.indicesAccessor = indices;
    this.positionsAccessor.bufferView.needsUpload = true;
    this.positionsAccessor.bufferView.addUsage(GPUBufferUsage.VERTEX);

    if (this.indicesAccessor) {
      // Set usage for the indices data and flag it as needing upload
      this.indicesAccessor.bufferView.needsUpload = true;
      this.indicesAccessor.bufferView.addUsage(GPUBufferUsage.INDEX);
    }
  }

  async buildRenderPipeline({
    api,
    shaderModule,
    depthFormat,
    colorFormat,
    uniformsBindGroupLayout,
  }: {
    api: WebGpuApi;
    shaderModule: GPUShaderModule;
    depthFormat: GPUTextureFormat;
    colorFormat: GPUTextureFormat;
    uniformsBindGroupLayout: GPUBindGroupLayout;
  }) {
    // defines the properties of the positions attribute

    // Note: We do not pass the positions.byteOffset here, as its
    // meaning can vary in different glB files, i.e., if it's
    // being used for interleaved element offset or an absolute
    // offset.
    const positionAttribute: GPUVertexAttribute = {
      format: this.positionsAccessor.vertexType as GPUVertexFormat, // "float32x3"
      offset: 0,
      shaderLocation: 0,
    };

    const vertexBufferLayout: GPUVertexBufferLayout = {
      arrayStride: this.positionsAccessor.byteStride,
      attributes: [positionAttribute],
    };

    const vertexState: GPUVertexState = {
      module: shaderModule,
      entryPoint: "vertex_main", // Name of the vertex module defined in shader
      buffers: [vertexBufferLayout],
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

    const renderPipelineLayout = api.device.createPipelineLayout({
      bindGroupLayouts: [uniformsBindGroupLayout],
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

  render({
    renderPassEncoder,
    uniformsBindGroup,
  }: {
    renderPassEncoder: GPURenderPassEncoder;
    uniformsBindGroup: GPUBindGroup;
  }) {
    if (!this.renderPipeline) {
      throw new Error("No render pipline to render from GLTFPrimitive");
    }

    renderPassEncoder.setPipeline(this.renderPipeline);
    renderPassEncoder.setBindGroup(0, uniformsBindGroup);

    if (!this.positionsAccessor.bufferView.gpuBuffer) {
      throw new Error("No gpu buffer in positions accessor buffer view");
    }
    renderPassEncoder.setVertexBuffer(
      0,
      this.positionsAccessor.bufferView.gpuBuffer,
      this.positionsAccessor.byteOffset,
      this.positionsAccessor.byteLength,
    );

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

export function buildPrimitiveClass(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primitiveData: any,
  accessors: GLTFAccessor[],
): GLTFPrimitive {
  // determine primitive's render mode
  const mode = primitiveData.mode ?? GLTFRenderMode.TRIANGLES;
  if (
    mode != GLTFRenderMode.TRIANGLES &&
    mode != GLTFRenderMode.TRIANGLE_STRIP
  ) {
    throw Error(`Currently Unsupported primitive mode ${mode}`);
  }

  // Find the vertex indices accessor if provided
  const indices = accessors[primitiveData.indices];

  // get the positions accessor
  const positions: GLTFAccessor | undefined = (() => {
    for (const attribute in primitiveData["attributes"]) {
      const accessor = accessors[primitiveData["attributes"][attribute]];
      if (attribute == "POSITION") {
        return accessor;
      }
    }
  })();

  if (!positions) {
    throw new Error("No positions accessor present building GLTFPrimitive");
  }

  return new GLTFPrimitive({ mode, positions, indices });
}
