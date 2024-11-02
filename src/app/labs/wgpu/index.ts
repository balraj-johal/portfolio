import { uploadGlb } from "@/libs/wgpu/classes/gltf";
import { FLOAT_LENGTH_BYTES } from "@/libs/wgpu";
import {
  checkShaderModuleCompilation,
  WebGPUInstance,
  Camera,
  WebGPUInstanceProperties,
} from "@/libs/wgpu";

import shader from "./shaders/triangle.wgsl";
import Triangle from "./classes/Triangle";

const DEPTH_TEXTURE_FORMAT: GPUTextureFormat = "depth24plus-stencil8";

interface WebGPUExplorationProperties extends WebGPUInstanceProperties {}

export default class WebGPUExploration extends WebGPUInstance {
  shaderModule?: GPUShaderModule;

  depthStencilTexture?: GPUTexture;

  private camera;

  constructor(properties: WebGPUExplorationProperties) {
    super(properties);

    this.camera = new Camera({
      canvas: this.canvas,
    });
  }

  /**
   * Defines the connection between vertex input buffers and the shader itself.
   *
   * i.e., stuff like what format each input is in, how to parse the inputs, which location
   */
  private createVertexState(shaderModule: GPUShaderModule): GPUVertexState {
    // defines the properties of the two interleaved attributes
    const positionAttribute: GPUVertexAttribute = {
      format: "float32x4",
      offset: 0,
      shaderLocation: 0,
    };
    const colorAttribute: GPUVertexAttribute = {
      format: "float32x4",
      offset: 4 * FLOAT_LENGTH_BYTES, // offset after 1 float 4
      shaderLocation: 1,
    };

    const bufferLayout: GPUVertexBufferLayout = {
      arrayStride: 2 * 4 * FLOAT_LENGTH_BYTES, // 2 float 4's
      attributes: [positionAttribute, colorAttribute],
    };

    return {
      module: shaderModule,
      entryPoint: "vertex_main", // Name of the vertex module defined in shader
      buffers: [bufferLayout],
    };
  }

  /**
   * Defines the connection between fragment output buffers and the shader itself.
   *
   * i.e., stuff like what format each input is in, how to parse the inputs, which location.
   *
   * NOTE: We're rendering directly to the swap chain.
   */
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

  private async newShaderModule(shader: string) {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    const shaderModule = this.api.device.createShaderModule({ code: shader });
    await checkShaderModuleCompilation(shaderModule);

    return shaderModule;
  }

  private createBindGroupLayout() {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    return this.api.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" },
        },
      ],
    });
  }

  private createDepthStencilTexture() {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

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

  private async createRenderPipeline(
    pipelineLayout: GPUPipelineLayout,
    vertexState: GPUVertexState,
    fragmentState: GPUFragmentState,
  ) {
    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    return await this.api.device.createRenderPipelineAsync({
      layout: pipelineLayout,
      vertex: vertexState,
      fragment: fragmentState,
      depthStencil: {
        format: DEPTH_TEXTURE_FORMAT,
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });
  }

  /** WTF */
  private createRenderPassDescription(
    depthStencilTexture: GPUTexture,
  ): GPURenderPassDescriptor {
    const colorAttachment: GPURenderPassColorAttachment = {
      // view will be updated to the current render target each frame
      view: null as unknown as GPUTextureView,
      loadOp: "clear",
      clearValue: [0.3, 0.3, 0.3, 1],
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
      colorAttachments: [colorAttachment],
      depthStencilAttachment,
    };
  }

  async start() {
    await this.initializeContext({
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    if (!this.api) {
      throw new Error("No WebGPU API ready");
    }

    this.shaderModule = await this.newShaderModule(shader);

    const vertexState = this.createVertexState(this.shaderModule);
    const fragmentState = this.createFragmentState(this.shaderModule);

    this.depthStencilTexture = this.createDepthStencilTexture();
    let renderPassDescription = this.createRenderPassDescription(
      this.depthStencilTexture,
    );

    const bindGroupLayout = this.createBindGroupLayout();
    const renderPipelineLayout = this.api.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });
    const renderPipeline = await this.createRenderPipeline(
      renderPipelineLayout,
      vertexState,
      fragmentState,
    );

    // Render Pass!

    // create view parameters
    const viewParametersBuffer = this.camera.createBuffer(this.api);
    const viewParameterBindGroup = this.api.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: viewParametersBuffer } }],
    });

    const triangle = new Triangle(this.api);

    const res = await fetch("/assets/avocado.glb");
    const meshBuffer = await res.arrayBuffer();
    uploadGlb(meshBuffer, this.api);

    const render = () => {
      if (!this.api) {
        throw new Error("No WebGPU API ready");
      }

      const cameraBuffer = this.camera.getUpdatedBuffer(this.api);

      if (this.hasResized()) {
        this.setupCanvas();

        this.depthStencilTexture?.destroy();

        this.depthStencilTexture = this.createDepthStencilTexture();
        renderPassDescription = this.createRenderPassDescription(
          this.depthStencilTexture,
        );

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

      const commandEncoder = this.api.device.createCommandEncoder();
      commandEncoder.copyBufferToBuffer(
        cameraBuffer,
        0,
        viewParametersBuffer,
        0,
        16 * FLOAT_LENGTH_BYTES,
      );

      const renderPass = commandEncoder.beginRenderPass(renderPassDescription);
      renderPass.setPipeline(renderPipeline);
      // TODO: is this doin shit?
      renderPass.setBindGroup(0, viewParameterBindGroup);

      if (triangle.dataBuffer) {
        renderPass.setVertexBuffer(0, triangle.dataBuffer);
        renderPass.draw(3, 1, 0, 0);
      }

      renderPass.end();
      this.api.device.queue.submit([commandEncoder.finish()]);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}
