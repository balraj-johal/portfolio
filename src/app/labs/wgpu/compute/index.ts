import {
  alignTo,
  Camera,
  createShaderModule,
  FLOAT_LENGTH_BYTES,
  WebGpuApi,
} from "@/libs/wgpu";
import { WebGPUInstance, WebGPUInstanceProperties } from "@/libs/wgpu";

import { getComputeShader, getRenderShader } from "./shaders";

type WebGPUExplorationProperties = WebGPUInstanceProperties;

const DEPTH_TEXTURE_FORMAT: GPUTextureFormat = "depth24plus-stencil8";

const COMPUTE_INPUT = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// function calculateWorkgroupSize(inputLength: number) {
//   // const WORKGROUP_SIZE_MAX = [64, 32, 32]; // TODO: check if this is reasonable
//   const WORKGROUP_SIZE_MAX = [4, 4, 4]; // NOTE: Temp values
// }

// TODO: get this data into a vertex buffer, which is then rendered.

const NUMBER_VERTICES_MAX = 4;
const NUMBER_INDICES_MAX = 6;

const INDICES = new Uint16Array([
  0,
  1,
  2, // Tri 2
  0,
  2,
  3, // Tri 1
]);

export default class WebGPUExplorationCompute extends WebGPUInstance {
  private camera;

  constructor(properties: WebGPUExplorationProperties) {
    super(properties);

    this.camera = new Camera({
      canvas: this.canvas,
      initialPosition: [0, 0, 5],
      nearPlane: 0.01,
      farPlane: 10,
    });
  }

  private createVertexState(shaderModule: GPUShaderModule): GPUVertexState {
    const positionAttribute: GPUVertexAttribute = {
      format: "float32x3",
      offset: 0,
      shaderLocation: 0,
    };

    const bufferLayout: GPUVertexBufferLayout = {
      arrayStride: 3 * FLOAT_LENGTH_BYTES, // 1 vec3<f32>
      attributes: [positionAttribute],
    };

    return {
      module: shaderModule,
      entryPoint: "vertex_main", // Name of the vertex module defined in shader
      buffers: [bufferLayout],
    };
  }

  private createFragmentState(shaderModule: GPUShaderModule): GPUFragmentState {
    const target: GPUColorTargetState = {
      format: this.preferredFormat,
    };

    return {
      module: shaderModule,
      entryPoint: "fragment_main", // Name of the fragment module defined in shader
      targets: [target], // NOTE: here's where MRT would be configured I think
    };
  }

  private createRenderPassDescription(
    depthStencilTexture: GPUTexture,
  ): GPURenderPassDescriptor {
    const colorAttachment: GPURenderPassColorAttachment = {
      // view will be updated to the current render target each frame
      view: null as unknown as GPUTextureView,
      loadOp: "clear",
      clearValue: [0.9, 0.3, 0.3, 1],
      storeOp: "store",
    };
    const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
      // view will be set to the current render target each frame
      view: depthStencilTexture.createView(),
      depthLoadOp: "clear",
      depthClearValue: 1.0,
      depthStoreOp: "store",
      stencilLoadOp: "clear",
      stencilClearValue: 0,
      stencilStoreOp: "store",
    };

    return {
      label: "render pass",
      colorAttachments: [colorAttachment],
      depthStencilAttachment,
    };
  }

  private createDepthStencilTexture(api: WebGpuApi) {
    if (!this.api) throw new Error("No WebGPU API ready");

    return this.api.device.createTexture({
      size: {
        width: this.currentCanvasDimensions.width,
        height: this.currentCanvasDimensions.height,
        depthOrArrayLayers: 1,
      },
      format: DEPTH_TEXTURE_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  async start() {
    await this.initializeContext({ usage: GPUTextureUsage.RENDER_ATTACHMENT });
    if (!this.api) throw new Error("No WebGPU API ready");

    /** -- COMPUTE -- */
    const computeShader = getComputeShader([64, 1, 1]);

    const computeShaderModule = await createShaderModule(this.api, {
      label: "compute test",
      code: computeShader,
    });

    const computePipeline = this.api.device.createComputePipeline({
      label: "processing input data pipeline",
      layout: "auto",
      compute: {
        module: computeShaderModule,
        entryPoint: "processInputData",
      },
    });

    const computeInputBuffer = this.api.device.createBuffer({
      label: "input data buffer",
      size: alignTo(COMPUTE_INPUT.byteLength, FLOAT_LENGTH_BYTES),
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });
    this.api.device.queue.writeBuffer(computeInputBuffer, 0, COMPUTE_INPUT);

    const vertexLength = NUMBER_VERTICES_MAX * 3 * FLOAT_LENGTH_BYTES;
    const indexLength = NUMBER_INDICES_MAX * FLOAT_LENGTH_BYTES;
    const computeOutputLength = vertexLength + indexLength;

    const computeOutputBuffer = this.api.device.createBuffer({
      label: "output data buffer",
      size: alignTo(computeOutputLength, FLOAT_LENGTH_BYTES),
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const computeBindGroup = this.api.device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: computeInputBuffer } },
        { binding: 1, resource: { buffer: computeOutputBuffer } },
      ],
    });

    const computeResultsBuffer = this.api.device.createBuffer({
      label: "compute results data buffer",
      size: alignTo(computeOutputLength, FLOAT_LENGTH_BYTES),
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const performComputePass = (commandEncoder: GPUCommandEncoder) => {
      const computePass = commandEncoder.beginComputePass({
        label: "compute pass",
      });
      computePass.setPipeline(computePipeline);
      computePass.setBindGroup(0, computeBindGroup);
      computePass.dispatchWorkgroups(COMPUTE_INPUT.length);

      // NOTE: compute pass must be ended before processing results, duh
      computePass.end();

      commandEncoder.copyBufferToBuffer(
        computeOutputBuffer,
        0,
        computeResultsBuffer,
        0,
        computeResultsBuffer.size,
      );
    };

    /** -- render -- */
    const renderShader = getRenderShader();
    const renderShaderModule = await createShaderModule(this.api, {
      label: "render",
      code: renderShader,
    });

    const vertexState = this.createVertexState(renderShaderModule);
    const fragmentState = this.createFragmentState(renderShaderModule);

    let depthStencilTexture = this.createDepthStencilTexture(this.api);
    let renderPassDescription =
      this.createRenderPassDescription(depthStencilTexture);

    const meshVertexBuffer = this.api.device.createBuffer({
      label: "mesh vertex buffer",
      size: vertexLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const meshIndexBuffer = this.api.device.createBuffer({
      label: "mesh index buffer",
      size: indexLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    this.api.device.queue.writeBuffer(meshIndexBuffer, 0, INDICES);

    const bindGroupLayout = this.api.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" },
        },
      ],
    });
    const renderPipelineLayout = this.api.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });
    const renderPipeline = await this.api.device.createRenderPipelineAsync({
      layout: renderPipelineLayout,
      vertex: vertexState,
      fragment: fragmentState,
      depthStencil: {
        format: DEPTH_TEXTURE_FORMAT,
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });

    const viewParametersBuffer = this.camera.createBuffer(this.api);
    const viewParameterBindGroup = this.api.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: viewParametersBuffer } }],
    });

    const performRenderPass = async (commandEncoder: GPUCommandEncoder) => {
      if (!this.api) throw new Error("No WebGPU API ready");

      if (this.hasResized()) {
        this.setupCanvas();

        depthStencilTexture?.destroy();

        depthStencilTexture = this.createDepthStencilTexture(this.api);
        renderPassDescription =
          this.createRenderPassDescription(depthStencilTexture);

        this.configureContext({
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
      }

      const colorAttachments = [...renderPassDescription.colorAttachments];
      const firstColorAttachment = colorAttachments[0];

      if (firstColorAttachment != null) {
        firstColorAttachment.view = this.api.context
          .getCurrentTexture()
          .createView();
      }

      this.camera.updateBuffer(this.api);

      commandEncoder.copyBufferToBuffer(
        computeOutputBuffer,
        0,
        meshVertexBuffer,
        0,
        vertexLength,
      );

      const renderPass = commandEncoder.beginRenderPass(renderPassDescription);
      renderPass.setPipeline(renderPipeline);
      // TODO: is this doin shit?
      renderPass.setBindGroup(0, viewParameterBindGroup);

      renderPass.setVertexBuffer(0, meshVertexBuffer);
      renderPass.setIndexBuffer(meshIndexBuffer, "uint16");
      renderPass.drawIndexed(6);

      renderPass.end();
    };

    const render = async () => {
      if (!this.api) throw new Error("No WebGPU API ready");

      // prep the commmand encoder
      const commandEncoder = this.api.device.createCommandEncoder();

      performComputePass(commandEncoder);

      await computeResultsBuffer.mapAsync(GPUMapMode.READ);
      const range = computeResultsBuffer.getMappedRange();
      const result = new Float32Array(range).slice(0, 12);
      computeResultsBuffer.unmap();
      console.log(result);

      // TODO: can we go straight buffer to buffer here?
      performRenderPass(commandEncoder);

      // submit commands to GPU to render
      this.api.device.queue.submit([commandEncoder.finish()]);

      // request render of next frame
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}
